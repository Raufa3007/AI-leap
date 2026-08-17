# ============================================================
# V6.py
# Proposal Evaluation Project
# Technical + Commercial Evaluation API
# ============================================================

from dotenv import load_dotenv

load_dotenv()

# ============================================================
# GOOGLE GEMINI - CURRENT SDK
# ============================================================

from google import genai
from google.genai import types

# ============================================================
# FLASK
# ============================================================

from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from werkzeug.utils import secure_filename

# ============================================================
# STANDARD LIBRARIES
# ============================================================

import os
import re
import json
import math
import shutil
from io import StringIO

# ============================================================
# FILE / DATA PROCESSING
# ============================================================

import fitz  # PyMuPDF
import pandas as pd


# ============================================================
# FLASK INITIALIZATION
# ============================================================

app = Flask(__name__)

# ------------------------------------------------------------
# CORS
# ------------------------------------------------------------
# Allows Vercel frontend to communicate with Render backend.
# For production you can restrict this to your Vercel domain.
# ------------------------------------------------------------

CORS(
    app,
    resources={
        r"/*": {
            "origins": "*"
        }
    }
)


@app.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response


# ============================================================
# CONFIGURATION
# ============================================================

UPLOAD_FOLDER = "uploaded_files"

os.makedirs(
    UPLOAD_FOLDER,
    exist_ok=True
)

app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


# ============================================================
# GEMINI CONFIGURATION
# ============================================================

GEMINI_MODEL = "gemini-2.5-flash"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")

if not GEMINI_API_KEY:

    print(
        "WARNING: GEMINI_API_KEY is not configured."
    )

client = genai.Client(api_key=GEMINI_API_KEY)



# ============================================================
# COMMERCIAL CRITERIA
# ============================================================

COMMERCIAL_CRITERIA = [
    {
        "name": "Technical Proposal",
        "weight": 40
    },
    {
        "name": "Past Project Experience",
        "weight": 15
    },
    {
        "name": "On-Time Delivery",
        "weight": 10
    },
    {
        "name": "Compliance",
        "weight": 10
    },
    {
        "name": "Financial Stability",
        "weight": 10
    },
    {
        "name": "Customer References",
        "weight": 10
    },
    {
        "name": "Risk Score",
        "weight": 5
    }
]


# ============================================================
# HELPER FUNCTIONS
# ============================================================

def sanitize_filename(filename):
    """
    Remove path traversal and unsafe characters.
    """

    if not filename:
        return "unknown_file"

    filename = filename.strip()

    filename = filename.replace(
        "/",
        "_"
    )

    filename = filename.replace(
        "\\",
        "_"
    )

    filename = re.sub(
        r'[<>:"|?*]',
        "_",
        filename
    )

    return filename


# ============================================================

def clean_text(text):
    """
    Remove duplicate empty lines,
    trailing spaces and tabs.
    """

    if not text:
        return ""

    text = re.sub(
        r'\n\s*\n+',
        '\n\n',
        text
    )

    text = re.sub(
        r'[ ]+\n',
        '\n',
        text
    )

    text = re.sub(
        r'[^\S\r\n]+',
        ' ',
        text
    )

    return text.strip()


# ============================================================
# FIX (Bug 1):
# pandas removed DataFrame.applymap in newer releases.
# Use DataFrame.apply(...) + Series.map(...) instead, which
# is what the rest of the file (extract_tables_from_response,
# normalize_parameter_table) already uses.
# ============================================================

def parse_markdown_table_to_json(markdown_table_text):
    try:
        # ====================================================
        # FIX: Gemini sometimes prepends a preamble sentence
        # before the markdown table (e.g. "Here is the expert
        # evaluation..."). That line has no "|" in it, so
        # pandas was treating it as a 1-column header and
        # every real table row after it parsed as null.
        #
        # Strip out any line that isn't part of the pipe table
        # before handing the text to pd.read_csv.
        # ====================================================
        table_lines = [
            line for line in markdown_table_text.splitlines()
            if "|" in line
        ]

        if not table_lines:
            print("No markdown table lines found in Gemini output.")
            return []

        table_text = "\n".join(table_lines)

        df = pd.read_csv(
            StringIO(table_text),
            sep="|",
            engine="python",
            skipinitialspace=True
        )

        # drop any unnamed column
        df = df.loc[:, ~df.columns.str.contains('^Unnamed')]

        # FIXED: applymap -> apply + map (applymap is removed in newer pandas)
        df = df.apply(
            lambda column: column.map(
                lambda value: value.strip() if isinstance(value, str) else value
            )
        )

        json_data = df.to_dict(orient="records")
        return json_data

    except Exception as e:

        print(
            "Error parsing markdown to JSON:",
            e
        )

        return []


# ============================================================
# FIX (Bug 2):
# sanitize_nan was called in evaluate_files() but was never
# defined anywhere in the file. Added here so NaN/inf values
# produced by pandas (e.g. from ragged/missing table cells)
# are converted to JSON-safe None before jsonify/json.dumps.
# ============================================================

def sanitize_nan(data):
    """
    Recursively replace NaN / inf float values with None so
    the result can always be safely serialized to JSON.
    """

    if isinstance(data, dict):
        return {key: sanitize_nan(value) for key, value in data.items()}

    elif isinstance(data, list):
        return [sanitize_nan(item) for item in data]

    elif isinstance(data, float) and (math.isnan(data) or math.isinf(data)):
        return None

    else:
        return data


def evaluate_commercial_vendors(vendors):

    prompt = generate_commercial_prompt(vendors)

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "temperature": 0
        }
    )

    print(response.text)

    text = response.text.strip()

    # Remove markdown fences
    text = text.replace("```json", "")
    text = text.replace("```", "")
    text = text.strip()

    try:
        result = json.loads(text)
    except json.JSONDecodeError:
        print("Gemini returned invalid JSON:")
        print(text)
        raise

    return result




def call_gemini(prompt, temperature=0.0):
    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "temperature": temperature
        }
    )

    return response.text.strip()


# --- File Reading and AI Interaction Functions ---

def read_text_file(file_path):
    """
    Read complete text file.
    """

    try:

        with open(
            file_path,
            "r",
            encoding="utf-8"
        ) as file:

            return file.read()

    except FileNotFoundError:

        print(
            f"File not found: {file_path}"
        )

        return None

    except Exception as e:

        print(
            f"Error reading file {file_path}: {e}"
        )

        return None


# ============================================================

def extract_text_from_pdf_page(
    pdf_path,
    page_number
):
    """
    Extract text from a single PDF page.
    """

    try:

        with fitz.open(
            pdf_path
        ) as doc:

            if (
                page_number < 0
                or page_number >= len(doc)
            ):

                return (
                    f"Error: Page number "
                    f"{page_number} is out of bounds."
                )

            page = doc[
                page_number
            ]

            return page.get_text()

    except Exception as e:

        print(
            f"Error extracting PDF text: {e}"
        )

        return None


# ============================================================
# COMMERCIAL EVALUATION PROMPT
# ============================================================

def generate_commercial_prompt(
    vendors
):
    """
    Generate the commercial evaluation prompt.
    """

    prompt = f"""
You are an expert Procurement Commercial Evaluation Officer.

Your task is to evaluate EVERY vendor independently.

You must evaluate vendors using the following commercial evaluation criteria.

COMMERCIAL EVALUATION CRITERIA:

1. Technical Proposal - Weight: 40
2. Past Project Experience - Weight: 15
3. On-Time Delivery - Weight: 10
4. Compliance - Weight: 10
5. Financial Stability - Weight: 10
6. Customer References - Weight: 10
7. Risk Score - Weight: 5

TOTAL WEIGHT = 100


SCORING RULES:

- Each criterion has a maximum score equal to its weight.
- Technical Proposal maximum = 40.
- Past Project Experience maximum = 15.
- On-Time Delivery maximum = 10.
- Compliance maximum = 10.
- Financial Stability maximum = 10.
- Customer References maximum = 10.
- Risk Score maximum = 5.
- The sum of all seven criterion scores MUST equal overallScore.
- overallScore must be between 0 and 100.
- Evaluate every vendor independently.
- Do not give all vendors the same score unless the evidence genuinely supports it.
- Do not invent evidence.
- If evidence is missing, award an appropriate partial or lower score.
- Clearly explain when evidence is insufficient.
- Keep the reasoning concise and professional.
- If a page/proposal reference is available, include it.
- If no reference is available, use "Not specified".


RECOMMENDATION RULES:

80-100:
Recommended

60-79:
Conditionally Recommended

0-59:
Not Recommended


STATUS:

After evaluating the vendor, use:

"Completed"


AI INSIGHT:

Provide one concise overall commercial assessment for each vendor.


CRITICAL:

Return ONLY valid JSON.

Do NOT return:

- Markdown
- ```json
- ```
- Explanations outside JSON
- Comments
- Any additional top-level fields


EXPECTED JSON STRUCTURE:

{{
    "criteria": [
        {{
            "name": "Technical Proposal",
            "weight": 40
        }},
        {{
            "name": "Past Project Experience",
            "weight": 15
        }},
        {{
            "name": "On-Time Delivery",
            "weight": 10
        }},
        {{
            "name": "Compliance",
            "weight": 10
        }},
        {{
            "name": "Financial Stability",
            "weight": 10
        }},
        {{
            "name": "Customer References",
            "weight": 10
        }},
        {{
            "name": "Risk Score",
            "weight": 5
        }}
    ],
    "vendors": [
        {{
            "id": 1,
            "name": "Accenture",
            "overallScore": 89,
            "status": "Completed",
            "recommendation": "Recommended",
            "aiInsight": "Strong overall commercial capability with low commercial risk.",
            "evaluations": [
                {{
                    "criterion": "Technical Proposal",
                    "weight": 40,
                    "score": 36,
                    "reason": "Strong alignment with the requested requirements.",
                    "reference": "Pages 106-112"
                }},
                {{
                    "criterion": "Past Project Experience",
                    "weight": 15,
                    "score": 14,
                    "reason": "Strong experience in comparable projects.",
                    "reference": "Pages 120-124"
                }},
                {{
                    "criterion": "On-Time Delivery",
                    "weight": 10,
                    "score": 9,
                    "reason": "Strong delivery history.",
                    "reference": "Pages 125-127"
                }},
                {{
                    "criterion": "Compliance",
                    "weight": 10,
                    "score": 9,
                    "reason": "Most requirements are satisfied.",
                    "reference": "Pages 128-130"
                }},
                {{
                    "criterion": "Financial Stability",
                    "weight": 10,
                    "score": 9,
                    "reason": "Strong financial position.",
                    "reference": "Pages 131-134"
                }},
                {{
                    "criterion": "Customer References",
                    "weight": 10,
                    "score": 8,
                    "reason": "Positive relevant customer references.",
                    "reference": "Pages 135-137"
                }},
                {{
                    "criterion": "Risk Score",
                    "weight": 5,
                    "score": 4,
                    "reason": "Overall commercial risk is low.",
                    "reference": "Pages 138-139"
                }}
            ]
        }}
    ]
}}


FINAL VALIDATION:

1. Return JSON only.
2. Include every vendor.
3. Every vendor must contain all 7 evaluations.
4. Each score must be numeric.
5. No score may exceed its criterion weight.
6. overallScore must equal the sum of all seven scores.
7. Each evaluation must contain:
   - criterion
   - weight
   - score
   - reason
   - reference
8. Do not add markdown.
9. Do not invent proposal evidence.


VENDOR DATA:

{json.dumps(
    vendors,
    indent=2,
    ensure_ascii=False
)}
"""

    return prompt


# ============================================================
# NORMALIZE COMMERCIAL RESULT
# ============================================================

def normalize_commercial_result(
    result
):
    """
    Validate and normalize Gemini commercial result.
    """

    if not isinstance(
        result,
        dict
    ):

        raise ValueError(
            "Commercial evaluation response "
            "must be a JSON object."
        )

    if "vendors" not in result:

        raise ValueError(
            "Commercial evaluation response "
            "missing 'vendors'."
        )

    evaluated_vendors = result.get(
        "vendors",
        []
    )

    normalized_vendors = []

    for index, vendor in enumerate(
        evaluated_vendors
    ):

        if not isinstance(
            vendor,
            dict
        ):

            continue

        vendor_id = (
            vendor.get("id")
            or index + 1
        )

        try:

            vendor_id = int(
                vendor_id
            )

        except Exception:

            vendor_id = index + 1

        evaluations = vendor.get(
            "evaluations",
            []
        )

        if not isinstance(
            evaluations,
            list
        ):

            evaluations = []

        normalized_evaluations = []

        total_score = 0

        for criterion in COMMERCIAL_CRITERIA:

            criterion_name = criterion[
                "name"
            ]

            criterion_weight = criterion[
                "weight"
            ]

            matching_evaluation = None

            for evaluation in evaluations:

                if not isinstance(
                    evaluation,
                    dict
                ):

                    continue

                evaluation_name = str(
                    evaluation.get(
                        "criterion",
                        ""
                    )
                ).strip().lower()

                if (
                    evaluation_name
                    == criterion_name.lower()
                ):

                    matching_evaluation = evaluation

                    break

            if matching_evaluation:

                raw_score = matching_evaluation.get(
                    "score",
                    0
                )

                try:

                    score = float(
                        raw_score
                    )

                except (
                    TypeError,
                    ValueError
                ):

                    score = 0

                score = max(
                    0,
                    min(
                        criterion_weight,
                        score
                    )
                )

                score = round(
                    score,
                    2
                )

                reason = (
                    matching_evaluation.get(
                        "reason"
                    )
                    or
                    "No detailed reasoning provided."
                )

                reference = (
                    matching_evaluation.get(
                        "reference"
                    )
                    or
                    "Not specified"
                )

            else:

                score = 0

                reason = (
                    "Insufficient evidence "
                    "provided for this criterion."
                )

                reference = "Not specified"

            total_score += score

            normalized_evaluations.append(
                {
                    "criterion": criterion_name,
                    "weight": criterion_weight,
                    "score": score,
                    "reason": reason,
                    "reference": reference
                }
            )

        overall_score = round(
            total_score,
            2
        )

        # ----------------------------------------------------
        # Recommendation
        # ----------------------------------------------------

        if overall_score >= 80:

            recommendation = (
                "Recommended"
            )

        elif overall_score >= 60:

            recommendation = (
                "Conditionally Recommended"
            )

        else:

            recommendation = (
                "Not Recommended"
            )

        # ----------------------------------------------------
        # AI recommendation
        # ----------------------------------------------------

        ai_recommendation = str(
            vendor.get(
                "recommendation",
                ""
            )
        ).strip()

        if ai_recommendation in [
            "Recommended",
            "Conditionally Recommended",
            "Not Recommended"
        ]:

            # Use the score-based recommendation
            # as the final source of truth.
            recommendation = recommendation

        normalized_vendor = {
            "id": vendor_id,

            "name": vendor.get(
                "name",
                f"Vendor {vendor_id}"
            ),

            "overallScore": overall_score,

            "status": vendor.get(
                "status"
            ) or "Completed",

            "recommendation": recommendation,

            "aiInsight": vendor.get(
                "aiInsight"
            ) or
            "Commercial evaluation completed.",

            "evaluations":
                normalized_evaluations
        }

        normalized_vendors.append(
            normalized_vendor
        )

    return {
        "criteria": COMMERCIAL_CRITERIA,
        "vendors": normalized_vendors
    }


# ============================================================
# COMMERCIAL EVALUATION
# ============================================================

def evaluate_commercial_vendors(
    vendors
):
    """
    Evaluate all vendors commercially.
    """

    if not vendors:

        raise ValueError(
            "No vendors were provided "
            "for commercial evaluation."
        )

    prompt = generate_commercial_prompt(
        vendors
    )

    print(
        "\n========== COMMERCIAL PROMPT ==========\n"
    )

    print(
        prompt
    )

    print(
        "\n========================================\n"
    )

    response = client.models.generate_content(
        model=GEMINI_MODEL,
        contents=prompt,
        config={
            "temperature": 0
        }
    )


    if not response:
        raise ValueError(
            "Gemini returned an empty response."
        )

    raw_text = response.text.strip()

    print(
        "\n========== RAW COMMERCIAL GEMINI RESPONSE ==========\n"
    )

    print(raw_text)

    print(
        "\n======================================================\n"
    )

    cleaned_text = clean_gemini_json(raw_text)

    try:

        result = json.loads(
            cleaned_text
        )

    except json.JSONDecodeError as e:

        print(
            "\n========== INVALID GEMINI JSON ==========\n"
        )

        print(
            cleaned_text
        )

        print(
            "\n==========================================\n"
        )

        raise ValueError(
            f"Gemini returned invalid JSON: {e}"
        )

    final_result = normalize_commercial_result(
        result
    )

    print(
        "\n========== FINAL COMMERCIAL JSON ==========\n"
    )

    print(
        json.dumps(
            final_result,
            indent=2,
            ensure_ascii=False
        )
    )

    print(
        "\n===========================================\n"
    )

    return final_result


# ============================================================
# RFP RUBRIC FUNCTIONS
# ============================================================

def extract_table_from_gemini(
    text
):
    """
    Ask Gemini to extract the Evaluation Parameters
    table from the RFP.
    """

    prompt = (
        "From the following text, extract the "
        "'Evaluation Parameters' table located under section 51. "
        "Present the data in markdown table format with these columns:\n"
        "- Main Criterion (with English in brackets)\n"
        "- Weight %\n"
        "- Sub-Criterion (with English in brackets)\n"
        "- Sub-Weight %\n"
        "- Expectation\n\n"

        "The English translation of both the main criterion "
        "and sub-criterion should appear inside brackets next "
        "to the Arabic text.\n\n"

        "For each sub-criterion, generate a multi-level "
        "evaluation rubric using:\n"
        "- Excellent (Full Marks)\n"
        "- Good (Partial Marks)\n"
        "- Insufficient (Low/No Marks)\n\n"

        f"TEXT TO ANALYZE:\n{text}"
    )

    try:

        return call_gemini(
            prompt,
            temperature=0.0
        )

    except Exception as e:

        print(
            f"Gemini error during table extraction: {e}"
        )

        return None


# ============================================================

def extract_tables_from_response(
    response_content
):
    """
    Extract markdown tables from Gemini response.
    """

    if not response_content:

        return []

    lines = response_content.splitlines()

    tables = []

    current_table = []

    for line in lines:

        if "|" in line:

            current_table.append(
                line
            )

        else:

            if current_table:

                if len(
                    current_table
                ) >= 2:

                    tables.append(
                        "\n".join(
                            current_table
                        )
                    )

                current_table = []

    if (
        current_table
        and
        len(current_table) >= 2
    ):

        tables.append(
            "\n".join(
                current_table
            )
        )

    parsed_tables = []

    for table_content in tables:

        try:

            table = pd.read_csv(
                StringIO(
                    table_content
                ),
                sep="|",
                engine="python",
                skipinitialspace=True
            )

            table = table.loc[
                :,
                ~table.columns.astype(str)
                .str.contains(
                    "^Unnamed"
                )
            ]

            table = table.apply(
                lambda column: column.map(
                    lambda value:
                    value.strip()
                    if isinstance(
                        value,
                        str
                    )
                    else value
                )
            )

            parsed_tables.append(
                table
            )

        except Exception as e:

            print(
                f"Error parsing table: {e}"
            )

    return parsed_tables


# ============================================================

def normalize_parameter_table(
    df
):
    """
    Normalize extracted RFP parameter table.
    """

    try:

        if (
            df is None
            or df.empty
        ):

            return []

        df.columns = [
            str(col).strip()
            for col in df.columns
        ]

        df = df.apply(
            lambda column: column.map(
                lambda value:
                value.strip()
                if isinstance(
                    value,
                    str
                )
                else value
            )
        )

        # Remove markdown separator rows

        first_column = df.columns[0]

        df = df[
            ~df[first_column]
            .astype(str)
            .str.match(
                r"^\s*:?-+:?\s*$"
            )
        ]

        # Fill missing values

        df = df.ffill()

        # Normalize expected number of columns

        if len(
            df.columns
        ) >= 5:

            df = df.iloc[
                :,
                :5
            ]

            df.columns = [
                "main_criteria",
                "main_weight",
                "sub_criteria",
                "sub_weight",
                "expectation"
            ]

        return df.to_dict(
            orient="records"
        )

    except Exception as e:

        print(
            f"Error normalizing table: {e}"
        )

        return []


# ============================================================
# TECHNICAL EVALUATION PROMPT
# ============================================================

def generate_evaluation_prompt(
    parameter_table,
    proposal_texts,
    rfp_text,
    human_evaluation_text
):

    prompt = []

    prompt.append(
        """
You are an expert RFP technical evaluator with 20 years
of experience in government IT procurement.

Your task is to evaluate the submitted proposals against
the supplied RFP criteria.

Your evaluation must be evidence-based, professional,
and objective.
"""
    )

    prompt.append(
        "\n\n### Expert Judgment Calibration\n"
        "Study the provided internal evaluation document and "
        "use its reasoning patterns to calibrate your assessment. "
        "Do not mention this document in your final response.\n\n"
        f"--- START INTERNAL TRAINING DOCUMENT ---\n"
        f"{human_evaluation_text}\n"
        f"--- END INTERNAL TRAINING DOCUMENT ---"
    )

    if rfp_text:

        prompt.append(
            "\n\n### RFP Full Text\n"
            + rfp_text
        )

    prompt.append(
        "\n\n### Evaluation Criteria Rubric\n"
        "The following table contains the evaluation criteria:\n"
    )

    prompt.append(
        json.dumps(
            parameter_table,
            ensure_ascii=False,
            indent=2
        )
    )

    proposal_names = [
        name
        for name, _ in proposal_texts
    ]

    prompt.append(
        f"\n\n### Proposals to Evaluate "
        f"({len(proposal_names)} total): "
        + ", ".join(
            proposal_names
        )
    )

    prompt.append(
        "\n\n### Proposal Contents:\n"
    )

    for name, text in proposal_texts:

        prompt.append(
            f"\n## Proposal: {name}\n{text}"
        )

    prompt.append(
        """
### EXPERT EVALUATION INSTRUCTIONS

- Evaluate every proposal independently.
- Apply the supplied rubric.
- Assess actual evidence, not just keywords.
- Consider technical feasibility.
- Award nuanced partial scores.
- Do not exceed the specified sub-weight.
- Include a concise reason.
- Include a page reference when available.
- If no page reference exists, use "Not specified".
"""
    )

    prompt.append(
        "\n\n### OUTPUT FORMAT\n"
        "Return ONLY a single markdown table.\n\n"
        "| Main Criterion | Sub-Criterion | Main Weight | Sub Weight | "
        + " | ".join(
            [
                f"{name} Score | "
                f"{name} Reason | "
                f"{name} Reference"
                for name in proposal_names
            ]
        )
        + " |\n"
        + "|---|---|---|---|"
        + "---|---|---|" * len(
            proposal_names
        )
    )

    prompt.append(
        """
The final row must be:

Total Score

The total score must contain the sum of the scores for
each proposal.

All content must be in clear professional English.

Do not include Arabic text in the final table.
"""
    )

    return "\n".join(
        prompt
    )


# ============================================================
# TECHNICAL TABLE CLEANING
# ============================================================

def clean_gemini_json(text):
    """
    Strip markdown fences from a Gemini JSON response.
    """
    text = text.strip()
    text = text.replace("```json", "")
    text = text.replace("```", "")
    return text.strip()


def clean_evaluation_json(rows):
    """
    Clean parsed evaluation rows.
    """

    cleaned = []

    for row in rows:

        if not isinstance(
            row,
            dict
        ):

            continue

        # Skip redundant header rows

        if all(
            str(key).strip()
            ==
            str(value).strip()
            for key, value in row.items()
        ):

            continue

        # Skip separator rows

        if all(
            re.match(
                r"^-+$",
                str(value).strip()
            )
            for value in row.values()
        ):

            continue

        cleaned.append(
            {
                str(key).strip(): value
                for key, value in row.items()
            }
        )

    return cleaned


# ============================================================
# TECHNICAL OVERALL AI INSIGHTS
# ============================================================

def generate_technical_overall_insights(
    evaluation_table,
    proposal_names
):

    print(
        "\n=== AI INSIGHT DEBUG START ==="
    )

    print(
        "[1] Vendors:",
        proposal_names
    )

    print(
        "[1] Evaluation table exists:",
        bool(evaluation_table)
    )

    if (
        not evaluation_table
        or
        not proposal_names
    ):

        print(
            "[ERROR] Missing evaluation data or vendor names"
        )

        return {}

    prompt = f"""
You are a senior government IT procurement technical evaluation expert.

The technical evaluation below contains criterion/sub-criterion scores,
reasoning, and references for multiple vendor proposals.

Your task is to produce ONE concise overall AI insight for EACH vendor.

The insight must:
- Be highly concise: maximum 2 sentences.
- Highlight the most important technical strengths and weaknesses.
- Use specific, high-value technical keywords from the evaluation.
- Mention the most significant evidence or gap only when relevant.
- Focus on what matters for the procurement decision.
- Avoid repeating individual criterion scores or the total score.
- Avoid generic statements.
- Do not invent or assume information.
- Do not use bullet points.

Return ONLY valid JSON in exactly this structure:

{{
    "vendors": [
        {{
            "name": "Vendor Name",
            "aiInsight": "Concise, evidence-based technical assessment."
        }}
    ]
}}

IMPORTANT:
- Return exactly ONE insight for every vendor.
- Use the vendor names EXACTLY as provided.
- Keep each insight between 20-40 words.
- Focus on the 1-2 most decision-relevant technical findings.

VENDOR NAMES:

{json.dumps(
    proposal_names,
    ensure_ascii=False,
    indent=2
)}

TECHNICAL EVALUATION DATA:

{json.dumps(
    evaluation_table,
    ensure_ascii=False,
    indent=2
)}
"""

    print(
        "[2] Calling Gemini..."
    )

    try:

        raw = call_gemini(
            prompt,
            temperature=0.0,
            response_mime_type="application/json"
        )

    except Exception as e:

        print(
            "Technical overall insight Gemini error:",
            e
        )

        return {
            name:
            "Overall technical insight could not be generated."
            for name in proposal_names
        }

    print(
        raw
    )

    cleaned = clean_gemini_json(
        raw
    )

    print(
        cleaned
    )

    try:

        result = json.loads(
            cleaned
        )

    except json.JSONDecodeError as e:

        print(
            "Technical overall insight JSON parse error:",
            e
        )

        print(
            cleaned
        )

        return {
            name:
            "Overall technical insight could not be generated."
            for name in proposal_names
        }

    insights = {}

    for item in result.get(
        "vendors",
        []
    ):

        if not isinstance(
            item,
            dict
        ):

            continue

        name = str(
            item.get(
                "name",
                ""
            )
        ).strip()

        insight = str(
            item.get(
                "aiInsight",
                ""
            )
        ).strip()

        print(
            f"\n[DEBUG] Vendor: {name}"
        )

        print(
            f"[DEBUG] Insight: {insight}"
        )

        if (
            name
            and
            insight
        ):

            insights[name] = insight

    # --------------------------------------------------------
    # Match names case-insensitively
    # --------------------------------------------------------

    normalized = {}

    for vendor_name in proposal_names:

        matched = next(
            (
                value
                for key, value
                in insights.items()
                if key.lower()
                ==
                vendor_name.lower()
            ),
            None
        )

        normalized[
            vendor_name
        ] = (
            matched
            or
            "Overall technical insight was not provided."
        )

        print(
            f"[DEBUG] Matching "
            f"{vendor_name} -> {matched}"
        )

    print(
        "\n[DEBUG] FINAL INSIGHTS:"
    )

    print(
        normalized
    )

    return normalized


# ============================================================
# ROOT
# ============================================================

@app.route(
    "/",
    methods=["GET"]
)
def index():

    return jsonify(
        {
            "message":
                "Flask Proposal Evaluation API is running.",

            "version":
                "V6"
        }
    )


# ============================================================
# DEFAULT FILES
# ============================================================

@app.route(
    "/default_files",
    methods=["GET"]
)
def get_default_files():

    try:

        rfp_name = None

        proposal_names = []

        for filename in sorted(
            os.listdir(
                UPLOAD_FOLDER
            )
        ):

            if filename.startswith(
                "rfp_"
            ):

                rfp_name = filename

            elif filename.startswith(
                "proposal_"
            ):

                proposal_names.append(
                    filename
                )

        return jsonify(
            {
                "rfp":
                    rfp_name,

                "proposals":
                    proposal_names
            }
        ), 200

    except Exception as e:

        return jsonify(
            {
                "error":
                    str(e)
            }
        ), 500


# ============================================================
# UPLOAD FILES
# ============================================================

@app.route(
    "/upload",
    methods=["POST"]
)
def upload_files():

    try:

        print(
            "Received upload request."
        )

        rfp_file = request.files.get(
            "rfp"
        )

        proposal_files = request.files.getlist(
            "proposals"
        )

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True
        )

        rfp_path = None

        proposal_paths = []

        # ----------------------------------------------------
        # RFP
        # ----------------------------------------------------

        if rfp_file:

            if not rfp_file.filename:

                return jsonify(
                    {
                        "error":
                            "RFP file has no filename."
                    }
                ), 400

            rfp_filename = (
                "rfp_"
                +
                secure_filename(
                    rfp_file.filename
                )
            )

            rfp_path = os.path.join(
                UPLOAD_FOLDER,
                rfp_filename
            )

            print(
                f"Saving RFP: {rfp_path}"
            )

            rfp_file.save(
                rfp_path
            )

        # ----------------------------------------------------
        # PROPOSALS
        # ----------------------------------------------------

        existing_files = os.listdir(
            UPLOAD_FOLDER
        )

        existing_proposals = [
            filename
            for filename in existing_files
            if filename.startswith(
                "proposal_"
            )
        ]

        next_index = (
            len(existing_proposals)
            + 1
        )

        for proposal_file in proposal_files:

            if not proposal_file.filename:

                continue

            original_name = sanitize_filename(
                proposal_file.filename
            )

            proposal_filename = (
                f"proposal_{next_index}_"
                f"{original_name}"
            )

            proposal_path = os.path.join(
                UPLOAD_FOLDER,
                proposal_filename
            )

            print(
                f"Saving proposal: "
                f"{proposal_path}"
            )

            proposal_file.save(
                proposal_path
            )

            proposal_paths.append(
                proposal_path
            )

            next_index += 1

        return jsonify(
            {
                "message":
                    "Files uploaded successfully",

                "rfp_path":
                    rfp_path,

                "proposal_paths":
                    proposal_paths
            }
        ), 200

    except Exception as e:

        print(
            f"Upload error: {e}"
        )

        return jsonify(
            {
                "error":
                    f"An error occurred: {str(e)}"
            }
        ), 500


# ============================================================
# CLEAR ALL FILES
# ============================================================

@app.route(
    "/clear_all",
    methods=["POST"]
)
def clear_all_files():

    try:

        if os.path.exists(
            UPLOAD_FOLDER
        ):

            shutil.rmtree(
                UPLOAD_FOLDER
            )

        os.makedirs(
            UPLOAD_FOLDER,
            exist_ok=True
        )

        return jsonify(
            {
                "message":
                    "All uploaded files cleared"
            }
        ), 200

    except Exception as e:

        return jsonify(
            {
                "error":
                    f"Failed to clear files: {str(e)}"
            }
        ), 500


# ============================================================
# COMMERCIAL EVALUATION API
# ============================================================

@app.route(
    "/evaluate-commercial",
    methods=["POST"]
)
def evaluate_commercial():

    try:

        # ----------------------------------------------------
        # Validate Content-Type
        # ----------------------------------------------------

        if not request.is_json:

            print(
                "Commercial evaluation request "
                "did not contain application/json."
            )

            print(
                "Received Content-Type:",
                request.content_type
            )

            return jsonify(
                {
                    "error":
                        "Request Content-Type must be "
                        "application/json.",

                    "received_content_type":
                        request.content_type
                }
            ), 415

        # ----------------------------------------------------
        # Parse JSON
        # ----------------------------------------------------

        request_data = request.get_json(
            silent=True
        )

        if not request_data:

            return jsonify(
                {
                    "error":
                        "Request body is empty "
                        "or invalid JSON."
                }
            ), 400

        # ----------------------------------------------------
        # Vendors
        # ----------------------------------------------------

        vendors = request_data.get(
            "vendors",
            []
        )

        if not isinstance(
            vendors,
            list
        ):

            return jsonify(
                {
                    "error":
                        "'vendors' must be an array."
                }
            ), 400

        if len(vendors) == 0:

            return jsonify(
                {
                    "error":
                        "No vendors were provided."
                }
            ), 400

        print(
            "\n========== COMMERCIAL REQUEST =========="
        )

        print(
            json.dumps(
                request_data,
                indent=2,
                ensure_ascii=False
            )
        )

        print(
            "========================================\n"
        )

        # ----------------------------------------------------
        # Evaluate
        # ----------------------------------------------------

        result = evaluate_commercial_vendors(
            vendors
        )

        return jsonify(
            result
        ), 200

    except Exception as e:

        print(
            "\nCOMMERCIAL EVALUATION ERROR:"
        )

        print(
            str(e)
        )

        return jsonify(
            {
                "error":
                    f"Commercial evaluation failed: {str(e)}"
            }
        ), 500


# ============================================================
# TECHNICAL OVERALL AI INSIGHTS
# ============================================================

def generate_technical_overall_insights(evaluation_table, proposal_names):
    print("\n=== AI INSIGHT DEBUG START ===")
    print("[1] Vendors:", proposal_names)
    print("[1] Evaluation table exists:", bool(evaluation_table))

    if not evaluation_table or not proposal_names:
        print("[ERROR] Missing evaluation data or vendor names")
        return {}

    """
    Generate one overall AI insight for each vendor from the completed
    technical criterion scores/reasons. The insight is returned separately
    from the row-level evaluation table so the frontend can display it
    inside each vendor's technical assessment.
    """

    prompt = f"""
You are a senior government IT procurement technical evaluation expert.

The technical evaluation below contains criterion/sub-criterion scores,
reasoning, and references for multiple vendor proposals.

Your task is to produce ONE concise overall AI insight for EACH vendor.

The insight must:
- Be highly concise: maximum 2 sentences.
- Highlight the most important technical strengths and weaknesses.
- Use specific, high-value technical keywords from the evaluation.
- Mention the most significant evidence or gap only when relevant.
- Focus on what matters for the procurement decision.
- Avoid repeating individual criterion scores or the total score.
- Avoid generic statements.
- Do not invent or assume information.
- Do not use bullet points.

Return ONLY valid JSON in exactly this structure:

{{
    "vendors": [
        {{
            "name": "Vendor Name",
            "aiInsight": "Concise, evidence-based technical assessment."
        }}
    ]
}}

IMPORTANT:
- Return exactly ONE insight for every vendor.
- Use the vendor names EXACTLY as provided.
- Keep each insight between 20-40 words.
- Focus on the 1-2 most decision-relevant technical findings.

VENDOR NAMES:
{json.dumps(proposal_names, ensure_ascii=False, indent=2)}

TECHNICAL EVALUATION DATA:
{json.dumps(evaluation_table, ensure_ascii=False, indent=2)}
"""
    print("[2] Calling Gemini...")

    raw = call_gemini(prompt, temperature=0.0)
    print(raw)
    cleaned = clean_gemini_json(raw)
    print(cleaned)

    try:
        result = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("Technical overall insight JSON parse error:", e)
        print(cleaned)
        return {
            name: "Overall technical insight could not be generated."
            for name in proposal_names
        }

    insights = {}
    for item in result.get("vendors", []):
        if not isinstance(item, dict):
            continue
        name = str(item.get("name", "")).strip()
        insight = str(item.get("aiInsight", "")).strip()
        print(f"\n[DEBUG] Vendor: {name}")
        print(f"[DEBUG] Insight: {insight}")
        if name and insight:
            insights[name] = insight

    # Match names case-insensitively and always provide a value.
    normalized = {}
    for vendor_name in proposal_names:
        matched = next(
            (v for k, v in insights.items() if k.lower() == vendor_name.lower()),
            None
        )
        normalized[vendor_name] = (
            matched or "Overall technical insight was not provided."
        )
        print(f"[DEBUG] Matching {vendor_name} -> {matched}")

    print("\n[DEBUG] FINAL INSIGHTS:")
    print(normalized)
    return normalized


# ============================================================
# TECHNICAL EVALUATION
# ============================================================

@app.route(
    "/evaluate",
    methods=["POST", "OPTIONS"]
)
def evaluate_files():

    if request.method == "OPTIONS":
        return jsonify({}), 200

    try:

        # ----------------------------------------------------
        # Step 1:
        # Read internal evaluation document
        # ----------------------------------------------------

        human_eval_text = read_text_file(
            "evaluationDoc.txt"
        )

        if human_eval_text is None:

            return jsonify(
                {
                    "error":
                        "Crucial file "
                        "'evaluationDoc.txt' not found."
                }
            ), 404

        # ----------------------------------------------------
        # Step 2:
        # Find RFP PDF
        # ----------------------------------------------------

        rfp_path = None

        # First look inside uploaded_files

        if os.path.exists(
            UPLOAD_FOLDER
        ):

            for filename in sorted(
                os.listdir(
                    UPLOAD_FOLDER
                )
            ):

                if (
                    filename.startswith(
                        "rfp_"
                    )
                    and
                    filename.lower().endswith(
                        ".pdf"
                    )
                ):

                    rfp_path = os.path.join(
                        UPLOAD_FOLDER,
                        filename
                    )

                    break

        # Fallback to rfp.pdf

        if rfp_path is None:

            if os.path.exists(
                "rfp.pdf"
            ):

                rfp_path = "rfp.pdf"

        if rfp_path is None:

            return jsonify(
                {
                    "error":
                        "Crucial RFP PDF not found."
                }
            ), 404

        # ----------------------------------------------------
        # Extract RFP page
        # ----------------------------------------------------

        rfp_page_text = extract_text_from_pdf_page(
            rfp_path,
            18
        )

        if rfp_page_text is None:

            return jsonify(
                {
                    "error":
                        "Unable to extract RFP page text."
                }
            ), 500

        # ----------------------------------------------------
        # Step 3:
        # Load/generate rubric
        # ----------------------------------------------------

        rubric_file_path = (
            "generated_rubric.json"
        )

        parameter_table = None

        if os.path.exists(
            rubric_file_path
        ):

            print(
                "Found existing rubric."
            )

            try:

                with open(
                    rubric_file_path,
                    "r",
                    encoding="utf-8"
                ) as file:

                    parameter_table = json.load(
                        file
                    )

            except Exception as e:

                print(
                    "Could not load rubric:",
                    e
                )

                parameter_table = None

        # ----------------------------------------------------
        # Generate rubric if missing
        # ----------------------------------------------------

        if not parameter_table:

            print(
                "Generating new rubric..."
            )

            gemini_table_response = (
                extract_table_from_gemini(
                    rfp_page_text
                )
            )

            if not gemini_table_response:

                return jsonify(
                    {
                        "error":
                            "AI failed to extract "
                            "table from RFP text."
                    }
                ), 500

            tables = extract_tables_from_response(
                gemini_table_response
            )

            if not tables:

                return jsonify(
                    {
                        "error":
                            "Could not parse criteria "
                            "table from AI response."
                    }
                ), 500

            parameter_table = normalize_parameter_table(
                tables[0]
            )

            if not parameter_table:

                return jsonify(
                    {
                        "error":
                            "Generated evaluation "
                            "rubric is empty."
                    }
                ), 500

            with open(
                rubric_file_path,
                "w",
                encoding="utf-8"
            ) as file:

                json.dump(
                    parameter_table,
                    file,
                    ensure_ascii=False,
                    indent=4
                )

            print(
                f"New rubric saved to "
                f"{rubric_file_path}"
            )

        # ----------------------------------------------------
        # Step 4:
        # Read proposal files
        # ----------------------------------------------------

        proposal_texts = []

        if not os.path.exists(
            UPLOAD_FOLDER
        ):

            return jsonify(
                {
                    "error":
                        "Upload folder does not exist."
                }
            ), 400

        for filename in sorted(
            os.listdir(
                UPLOAD_FOLDER
            )
        ):

            if not filename.startswith(
                "proposal_"
            ):

                continue

            file_path = os.path.join(
                UPLOAD_FOLDER,
                filename
            )

            # ------------------------------------------------
            # PDF proposals
            # ------------------------------------------------

            if filename.lower().endswith(
                ".pdf"
            ):

                try:

                    with fitz.open(
                        file_path
                    ) as doc:

                        pages = []

                        for (
                            page_index,
                            page
                        ) in enumerate(doc):

                            page_text = page.get_text()

                            pages.append(
                                f"\n[Page {page_index + 1}]\n"
                                f"{page_text}"
                            )

                        text = "\n".join(
                            pages
                        )

                except Exception as e:

                    print(
                        f"Error reading PDF "
                        f"{filename}: {e}"
                    )

                    text = ""

            else:

                text = read_text_file(
                    file_path
                ) or ""

            text = clean_text(
                text
            )

            proposal_name = filename.replace(
                "proposal_",
                "",
                1
            )

            proposal_texts.append(
                (
                    proposal_name,
                    text
                )
            )

        if not proposal_texts:

            return jsonify(
                {
                    "error":
                        "No proposal files found "
                        "to evaluate. "
                        "Please upload them first."
                }
            ), 400

        # ----------------------------------------------------
        # Step 5:
        # Generate technical evaluation prompt
        # ----------------------------------------------------

        evaluation_prompt = generate_evaluation_prompt(
            parameter_table,
            proposal_texts,
            clean_text(
                rfp_page_text
            ),
            human_eval_text
        )

        # ----------------------------------------------------
        # Step 6:
        # Call Gemini
        # ----------------------------------------------------

        gemini_output_text = call_gemini(
            evaluation_prompt,
            temperature=0.0
        )

        print(
            "\n========== RAW TECHNICAL GEMINI OUTPUT ==========\n"
        )

        print(
            gemini_output_text
        )

        print(
            "\n==================================================\n"
        )

        # ----------------------------------------------------
        # Step 7:
        # Parse markdown table
        # ----------------------------------------------------

        parsed_table_json = (
            parse_markdown_table_to_json(
                gemini_output_text
            )
        )

        cleaned_output = clean_evaluation_json(
            parsed_table_json
        )

        # FIXED: sanitize_nan is now defined above.
        evaluation_table = sanitize_nan(
            cleaned_output
        )

        print(
            "\n========== PARSED TECHNICAL RESULT ==========\n"
        )

        print(
            json.dumps(
                evaluation_table,
                indent=2,
                ensure_ascii=False
            )
        )

        print(
            "\n==============================================\n"
        )

        if not evaluation_table:

            return jsonify(
                {
                    "error":
                        "Parsing the AI evaluation "
                        "response failed.",

                    "raw_output":
                        gemini_output_text
                }
            ), 500

        # ----------------------------------------------------
        # Step 8:
        # Generate overall AI insights
        # ----------------------------------------------------

        proposal_names = [
            name
            for name, _ in proposal_texts
        ]

        print(
            "\n========== GENERATING "
            "TECHNICAL OVERALL INSIGHTS =========="
        )

        technical_overall_insights = (
            generate_technical_overall_insights(
                evaluation_table,
                proposal_names
            )
        )

        print(
            json.dumps(
                technical_overall_insights,
                indent=2,
                ensure_ascii=False
            )
        )

        print(
            "==========================================================\n"
        )

        # ----------------------------------------------------
        # Step 9:
        # Return technical evaluation
        # ----------------------------------------------------

        return Response(
            json.dumps(
                {
                    "evaluation_table":
                        evaluation_table,

                    "technical_overall_insights":
                        technical_overall_insights
                },
                ensure_ascii=False,
                sort_keys=False
            ),
            status=200,
            mimetype="application/json"
        )

    except Exception as e:

        print(
            "\nTECHNICAL EVALUATION ERROR:"
        )

        print(
            str(e)
        )

        return jsonify(
            {
                "message":
                    "Evaluation failed.",

                "error":
                    str(e)
            }
        ), 500


# ============================================================
# HEALTH CHECK
# ============================================================

@app.route(
    "/health",
    methods=["GET"]
)
def health_check():

    return jsonify(
        {
            "status":
                "ok",

            "service":
                "Proposal Evaluation API",

            "version":
                "V6"
        }
    ), 200


# ============================================================
# APPLICATION START
# ============================================================

if __name__ == "__main__":

    port = int(
        os.environ.get(
            "PORT",
            5000
        )
    )

    app.run(
        host="0.0.0.0",
        port=port,
        debug=False
    )