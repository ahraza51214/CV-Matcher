import { motion } from "framer-motion";

export function Thinking(){
  return (
    <div className="thinking-wrap" style={{ minHeight: 180 }}>
      <div className="thinking-orb">
        <motion.span className="thinking-dot" animate={{ y:[0,-6,0], opacity:[.6,1,.6] }} transition={{ duration:.9, repeat:Infinity, ease:"easeInOut" }}/>
        <motion.span className="thinking-dot" animate={{ y:[0,-10,0],opacity:[.6,1,.6] }} transition={{ duration:1.1, repeat:Infinity, ease:"easeInOut", delay:.1 }}/>
        <motion.span className="thinking-dot" animate={{ y:[0,-8,0], opacity:[.6,1,.6] }} transition={{ duration:1.0, repeat:Infinity, ease:"easeInOut", delay:.2 }}/>
      </div>
      <div className="thinking-text">Evaluating…</div>
    </div>
  );
}
