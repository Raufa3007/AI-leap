import os
import json
import sys

# Ensure evaluator_ai directory is in Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import gemini_service
import cache_service

print("=== STARTING MULTI-KEY & CACHE TEST SUITE ===")

# Test 1: Gemini Service Config & Key Separation
print("\n--- Test 1: Key & Model Mapping ---")
rfp_key, rfp_model, rfp_disp = gemini_service.get_use_case_config("rfp")
tech_key, tech_model, tech_disp = gemini_service.get_use_case_config("technical")
comm_key, comm_model, comm_disp = gemini_service.get_use_case_config("commercial")

print(f"RFP        -> Model: {rfp_model}, Display: {rfp_disp}")
print(f"Technical  -> Model: {tech_model}, Display: {tech_disp}")
print(f"Commercial -> Model: {comm_model}, Display: {comm_disp}")

assert rfp_model == "gemini-3.6-flash", f"Expected gemini-3.6-flash, got {rfp_model}"
assert tech_model == "gemini-2.5-pro", f"Expected gemini-2.5-pro, got {tech_model}"
assert comm_model == "gemini-3.1-flash-lite", f"Expected gemini-3.1-flash-lite, got {comm_model}"
print("Test 1 PASSED: Model names match specification.")

# Test 2: Persistent Document Cache (SHA-256, HIT, MISS, Re-evaluate)
print("\n--- Test 2: Cache Service Identity & Behavior ---")
test_doc = "Proposal content for Vendor A: $10,000 USD."
doc_hash = cache_service.calculate_document_hash(test_doc)
cache_key = cache_service.build_cache_key(doc_hash, "technical_evaluation", tech_model, "v1")

print(f"Calculated Document Hash: {doc_hash}")
print(f"Calculated Cache Key:      {cache_key}")

# Clean initial state
cache_service.invalidate_cached_result(cache_key)
assert cache_service.get_cached_result(cache_key) is None, "Cache should be empty initially"
print("Cache MISS verified on empty state.")

# Save test result
sample_data = {"vendors": [{"name": "Vendor A", "score": 95}]}
saved = cache_service.save_cached_result(cache_key, doc_hash, "technical_evaluation", tech_model, "v1", sample_data)
assert saved is True, "Saving cache should return True"
print("Cached sample data successfully saved to SQLite.")

# Cache HIT check
hit_data = cache_service.get_cached_result(cache_key)
assert hit_data == sample_data, "Cached HIT data should match saved sample data"
print("Cache HIT verified successfully!")

# Refusal to cache empty/invalid data
empty_saved = cache_service.save_cached_result("bad_key", "hash", "tech", "model", "v1", {})
assert empty_saved is False, "Cache service must reject empty dict/list"
print("Refusal to cache empty payload verified.")

# Test 3: Missing Key Error Formatting
print("\n--- Test 3: Error Message Formatting ---")
# Simulate missing technical key
os.environ["TECHNICAL_GEMINI_API_KEY"] = ""
client, model, err_msg = gemini_service.get_gemini_client("technical")
print(f"Missing Technical Key Error: '{err_msg}'")
assert err_msg == "Technical Gemini API key is not configured.", f"Unexpected error msg: {err_msg}"
print("Test 3 PASSED: Clean user-facing error message generated without stack trace.")

print("\n=== ALL TEST SUITE CHECKS PASSED SUCCESSFULLY ===")
