import React, { useState, useEffect } from "react";
import ProtoAIOrb from "./orb";
import ChatWindow from "./chat-window";
import { useStore } from "@/store/useStore";

export default function ProtoAI() {
  const [isOpen, setIsOpen] = useState(false);
  const { aiTrigger } = useStore();

  useEffect(() => {
    if (aiTrigger) {
      setIsOpen(true);
    }
  }, [aiTrigger]);

  return (
    <>
      <ProtoAIOrb 
        onClick={() => setIsOpen(true)} 
        isOpen={isOpen} 
      />
      <ChatWindow 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)} 
      />
    </>
  );
}
