import json

STRUCTURE_SYS = "Extract structured hiring signals. Output STRICT JSON only."

def STRUCTURE_USER(doc_type: str, content: str) -> str:
    return f'''DocumentType: "{doc_type}"
Return JSON with:
{{"summary":"2–3 sentence summary",
 "skills":[{{"name":"C#","years":4}}],
 "tools":["Azure","Docker"],
 "languages":[{{"name":"English","level":"C1"}}],
 "education":[{{"degree":"MSc","institution":"..."}}],
 "certifications":[],
 "domains":[],
 "locations":[],
 "mustHaves":[],
 "niceToHaves":[],
 "requiredYears":{{}},
 "seniority":"Junior|Mid|Senior|Lead"}}
Text:
"""{content[:12000]}"""'''

PROSCONS_SYS = "You are a hiring evaluator. Output STRICT JSON only."

def PROSCONS_USER(cv_json: dict, jd_json: dict) -> str:
    return f'''Given:
CV_JSON: {json.dumps(cv_json, ensure_ascii=False)}
JD_JSON: {json.dumps(jd_json, ensure_ascii=False)}
Rules:
- Pros = concrete overlaps (skills, tools, domains).
- Cons = genuine gaps. Each bullet < 14 words.
Return: {{"pros":[],"cons":[],"missingSkills":[]}}'''
