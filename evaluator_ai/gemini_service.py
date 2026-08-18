import os
import json
import logging
from typing import Dict, Any, Tuple, Optional, Union
from google import genai
from google.genai import types

logger = logging.getLogger(__name__)


def get_use_case_config(use_case: str) -> Tuple[str, str, str]:
    """
    Returns (api_key, model_name, display_name) for a given use case.
    Reads environment variables dynamically.

    Key resolution priority:
    - For TECHNICAL: TECHNICAL_GEMINI_API_KEY → fallback GEMINI_API_KEY
    - For COMMERCIAL/INVOICE: COMMERCIAL_GEMINI_API_KEY → fallback GEMINI_API_KEY
    - For RFP: GEMINI_API_KEY only
    """
    uc = use_case.lower().strip()

    if uc in ("rfp", "rfp_assistant", "rfp_creation"):
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash").strip()
        return api_key, model, "RFP"

    elif uc in ("technical", "technical_evaluation"):
        # Use dedicated technical key if set and non-empty, else fall back to GEMINI_API_KEY
        api_key = os.environ.get("TECHNICAL_GEMINI_API_KEY", "").strip()
        if not api_key:
            api_key = os.environ.get("GEMINI_API_KEY", "").strip()
            logger.info("[GeminiService] TECHNICAL_GEMINI_API_KEY not set, using GEMINI_API_KEY as fallback.")
        model = os.environ.get("TECHNICAL_GEMINI_MODEL", "gemini-3.6-flash").strip()
        return api_key, model, "Technical"


    elif uc in ("commercial", "commercial_evaluation", "invoice", "invoice_processing"):
        # Use dedicated commercial key if set and non-empty, else fall back to GEMINI_API_KEY
        api_key = os.environ.get("COMMERCIAL_GEMINI_API_KEY", "").strip()
        if not api_key:
            api_key = os.environ.get("GEMINI_API_KEY", "").strip()
            logger.info("[GeminiService] COMMERCIAL_GEMINI_API_KEY not set, using GEMINI_API_KEY as fallback.")
        model = os.environ.get("COMMERCIAL_GEMINI_MODEL", "gemini-3.1-flash-lite").strip()
        return api_key, model, "Commercial"

    else:
        # Fallback to standard GEMINI_API_KEY
        api_key = os.environ.get("GEMINI_API_KEY", "").strip()
        model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash").strip()
        return api_key, model, "General"


def get_gemini_client(use_case: str) -> Tuple[Optional[genai.Client], Optional[str], str]:
    """
    Instantiate and return (client, model_name, error_message) for a use case.
    Does NOT throw unhandled exceptions or expose secrets.
    """
    api_key, model, display_name = get_use_case_config(use_case)

    if not api_key:
        if display_name == "RFP":
            err = "RFP Gemini model unavailable. Please check the configured model name and Gemini API configuration."
        else:
            err = f"{display_name} Gemini API key is not configured."
        return None, model, err

    try:
        client = genai.Client(api_key=api_key)
        return client, model, ""
    except Exception as e:
        logger.error(f"[GeminiService] Failed to initialize client for {display_name}: {e}")
        return None, model, f"Failed to initialize {display_name} Gemini client."


def generate(
    use_case: str,
    prompt: Union[str, list],
    temperature: float = 0.0,
    response_mime_type: Optional[str] = None,
    system_instruction: Optional[str] = None
) -> Tuple[Optional[str], Optional[str]]:
    """
    Generate content from Gemini for a given use_case.
    Returns (raw_text, error_message).
    If raw_text is present, error_message is None.
    If an error occurs, raw_text is None and error_message is user-safe string.

    For TECHNICAL and COMMERCIAL use cases:
    - If the dedicated key fails with 401, automatically retries with GEMINI_API_KEY.
    - This ensures backward compatibility when only GEMINI_API_KEY is set in env.
    """
    client, model, err = get_gemini_client(use_case)
    if err:
        return None, err

    api_key, model, display_name = get_use_case_config(use_case)

    config_args = {"temperature": temperature}
    if response_mime_type:
        config_args["response_mime_type"] = response_mime_type
    if system_instruction:
        config_args["system_instruction"] = system_instruction

    config = types.GenerateContentConfig(**config_args)

    def _call(c: genai.Client, m: str) -> Tuple[Optional[str], Optional[str]]:
        """Inner call helper. Returns (text, error)."""
        try:
            response = c.models.generate_content(
                model=m,
                contents=prompt,
                config=config
            )
            if not response or not response.text or not response.text.strip():
                return None, "Gemini returned an empty response."
            return response.text.strip(), None
        except Exception as e:
            return None, str(e)

    raw_text, call_err = _call(client, model)

    # If dedicated key fails with auth error for technical/commercial,
    # retry with the main GEMINI_API_KEY and GEMINI_MODEL
    if call_err and use_case in ("technical", "technical_evaluation", "commercial", "commercial_evaluation", "invoice", "invoice_processing"):
        err_lower = call_err.lower()
        if "401" in err_lower or "unauthenticated" in err_lower or "invalid" in err_lower or "access_token_type" in err_lower:
            fallback_key = os.environ.get("GEMINI_API_KEY", "").strip()
            fallback_model = os.environ.get("GEMINI_MODEL", "gemini-3.6-flash").strip()
            if fallback_key and fallback_key != api_key:
                logger.warning(f"[GeminiService] {display_name} key auth failed, retrying with GEMINI_API_KEY fallback.")
                try:
                    fallback_client = genai.Client(api_key=fallback_key)
                    raw_text, call_err = _call(fallback_client, fallback_model)
                    if not call_err:
                        logger.info(f"[GeminiService] {display_name} fallback to GEMINI_API_KEY succeeded.")
                        return raw_text, None
                except Exception as fe:
                    logger.error(f"[GeminiService] Fallback client init failed: {fe}")
                    call_err = str(fe)

    if call_err:
        err_lower = call_err.lower()
        logger.error(f"[GeminiService] Error calling Gemini for {display_name} ({model}): {call_err}")

        if "404" in err_lower or "not_found" in err_lower or "no longer available" in err_lower:
            if display_name == "RFP":
                return None, "RFP Gemini model unavailable. Please check the configured model name and Gemini API configuration."
            else:
                return None, f"{display_name} Gemini model unavailable. Please check the configured Gemini model."

        if "401" in err_lower or "unauthenticated" in err_lower or "access_token" in err_lower or "permission_denied" in err_lower:
            return None, f"{display_name} Gemini API key is invalid. Please check the configured API key."

        if "429" in err_lower or "quota" in err_lower or "resource_exhausted" in err_lower or "rate limit" in err_lower:
            return None, f"{display_name} Gemini API rate limit or quota exceeded. Please try again later."

        if "timeout" in err_lower or "deadline" in err_lower:
            return None, "Gemini request timed out. Please try again."

        return None, f"{display_name} Gemini call failed. Please verify API configuration and try again."

    return raw_text, None


def validate_json_response(raw_text: str) -> Tuple[Optional[Union[dict, list]], Optional[str]]:
    """
    Clean and validate JSON response from Gemini.
    Returns (parsed_json_obj, error_message).
    """
    if not raw_text or not raw_text.strip():
        return None, "Gemini returned an empty response."

    text = raw_text.strip()

    # Strip markdown code fencing ```json ... ```
    if text.startswith("```"):
        lines = text.splitlines()
        if lines[0].startswith("```"):
            lines = lines[1:]
        if lines and lines[-1].startswith("```"):
            lines = lines[:-1]
        text = "\n".join(lines).strip()

    try:
        parsed = json.loads(text)
        return parsed, None
    except json.JSONDecodeError as e:
        logger.error(f"[GeminiService] JSON parse error: {e}. Raw text preview: {text[:200]}")
        return None, "Gemini returned an invalid JSON response."
