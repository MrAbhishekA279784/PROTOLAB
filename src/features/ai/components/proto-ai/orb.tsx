import React, { useRef, useEffect } from "react";
import { motion, useDragControls } from "framer-motion";
import { Sparkles, Zap, Bot } from "lucide-react";
import { cn } from "@/lib/utils";
import { useStore } from "@/store/useStore";

interface ProtoAIOrbProps {
  onClick: () => void;
  isOpen: boolean;
  isThinking?: boolean;
}

export default function ProtoAIOrb({ onClick, isOpen, isThinking }: ProtoAIOrbProps) {
  const { aiOrbPosition, setAiOrbPosition } = useStore();
  const constraintsRef = useRef(null);

  // Initial position if none saved
  const initialX = aiOrbPosition?.x ?? 0;
  const initialY = aiOrbPosition?.y ?? 0;

  const handleDragEnd = (_: any, info: any) => {
    // Save relative position
    setAiOrbPosition({ 
      x: initialX + info.offset.x, 
      y: initialY + info.offset.y 
    });
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-[100]" ref={constraintsRef}>
      <motion.div
        drag
        dragMomentum={false}
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        onDragEnd={handleDragEnd}
        initial={false}
        animate={{ 
          x: initialX, 
          y: initialY,
          scale: isOpen ? 0 : 1,
          opacity: isOpen ? 0 : 1
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9, cursor: "grabbing" }}
        className={cn(
          "fixed bottom-6 right-6 pointer-events-auto",
          isOpen && "pointer-events-none"
        )}
      >
        <button
          onClick={(e) => {
             // Prevent click if we were dragging (though framer-motion handles this mostly)
             onClick();
          }}
          className={cn(
            "relative w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-2xl shadow-primary/20",
            "bg-white dark:bg-slate-900 border border-primary/20 cursor-grab active:cursor-grabbing",
            "hover:shadow-primary/30"
          )}
        >
          {/* Modern Pulse Rings */}
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.3, 0, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 rounded-2xl border-2 border-primary/30"
          />
          
          {/* Central Core */}
          <div className="relative z-10">
            {isThinking ? (
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
                className="w-8 h-8 bg-primary rounded-full blur-md opacity-50"
              />
            ) : (
               <div className="flex items-center justify-center">
                  <Bot className="w-8 h-8 text-primary drop-shadow-[0_2px_8px_rgba(79,107,255,0.3)]" strokeWidth={1.5} />
               </div>
            )}
          </div>

          {/* Status Indicator */}
          <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900 shadow-lg shadow-emerald-500/20" />
        </button>

        {/* Floating Sparkles */}
        {!isOpen && !isThinking && (
          <motion.div
            animate={{
              y: [-8, 8, -8],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
            }}
            className="absolute -top-4 left-1/2 -translate-x-1/2"
          >
            <Sparkles className="w-4 h-4 text-primary/40" />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
