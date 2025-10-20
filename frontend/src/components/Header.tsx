// Header.tsx
import { ProviderToggle } from "./ProviderToggle";
import { motion } from "framer-motion";
import type { Provider } from "../api/match";

export function Header({provider, onChangeProvider}:{provider:Provider; onChangeProvider:(p:Provider)=>void;}){
  return (
    <header className="header">
      <motion.div className="brand" initial={{opacity:0, y:-6}} animate={{opacity:1, y:0}}>
        <div className="brand-bubble" />
        <div>
          <div style={{fontSize:16, opacity:.8}}>AI Job Match</div>
          <div className="muted" style={{fontSize:12}}>Score CV ↔ JD with OpenAI & Gemini</div>
        </div>
      </motion.div>
      <ProviderToggle value={provider} onChange={onChangeProvider}/>
    </header>
  );
}
