from typing import List

def _coverage(text: str, items: List[str]) -> float:
    if not items: return 1.0
    blob = (text or "").lower()
    return sum(1 for it in items if it and it.lower() in blob) / len(items)

def compute_score(cv: dict, jd: dict, sim: float) -> dict:
    text = (cv.get("summary","") + " " + " ".join(cv.get("tools",[]))).strip()
    must = _coverage(text, jd.get("mustHaves",[]))
    nice = _coverage(text, jd.get("niceToHaves",[]))

    years = 1.0   # keep simple for MVP; you can expand later
    domain = 1.0  # keep simple for MVP; you can expand later

    score = 100*(0.5*must + 0.2*nice + 0.1*years + 0.1*domain + 0.1*sim)
    if jd.get("mustHaves") and must < 1.0:
        score = min(score, 60)

    band = "Poor" if score < 50 else "OK" if score < 70 else "Good" if score < 85 else "Strong"
    return {
        "matchScore": round(score),
        "band": band,
        "explanations": {
            "mustHaveCoverage": round(must,2),
            "niceToHaveCoverage": round(nice,2),
            "yearsCoverage": round(years,2),
            "domainCoverage": round(domain,2),
            "embeddingsSim": round(sim,2),
        }
    }
