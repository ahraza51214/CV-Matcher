import { motion } from "framer-motion";

export function ScoreBubble({ bg, border, text, score, band }:{
  bg:string; border:string; text:string; score:number; band:string;
}) {
  return (
    <motion.div
      className="score-bubble"
      initial={{ top:"50%", left:"50%", x:"-50%", y:"-50%", opacity:0, scale:1 }}
      animate={{ top:8, left:8, x:0, y:0, opacity:1, scale:1 }}
      transition={{ type:"spring", stiffness:240, damping:24 }}
      style={{ background:bg, borderColor:border, color:text }}
    >
      <div className="score-number">
        {score}<span className="score-denom">/100</span>
      </div>
      <div className="score-label">{band}</div>
    </motion.div>
  );
}
