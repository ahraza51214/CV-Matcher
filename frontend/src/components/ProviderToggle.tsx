// ProviderToggle.tsx
import type { Provider } from "../api/match";

export function ProviderToggle({value, onChange}:{value:Provider; onChange:(p:Provider)=>void;}){
  return (
    <div className="segment" role="tablist" aria-label="Model Provider">
      <button role="tab" className={value==="OpenAI" ? "active":""} onClick={()=>onChange("OpenAI")}>OpenAI</button>
      <button role="tab" className={value==="Gemini" ? "active":""} onClick={()=>onChange("Gemini")}>Gemini</button>
    </div>
  );
}
