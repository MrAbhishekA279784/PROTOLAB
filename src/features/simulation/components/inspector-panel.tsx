import React from "react";
import { X } from "lucide-react";
import { COMPONENT_DEFS } from "../constants/component-defs";

interface InspectorPanelProps {
  inspectTarget: any;
  setShowInspect: (val: boolean) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  inspectTarget,
  setShowInspect,
}) => {
  if (!inspectTarget) return null;

  return (
    <div className="absolute top-4 right-4 z-40 w-56 bg-popover border border-border rounded-xl shadow-xl p-4 pointer-events-auto animate-in slide-in-from-right-4 fade-in duration-200">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-foreground text-sm">Component Info</span>
        <button
          onClick={() => setShowInspect(false)}
          className="text-muted-foreground hover:text-destructive transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Type</span>
          <span className="font-semibold text-foreground capitalize">{inspectTarget.type}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Name</span>
          <span className="font-semibold text-foreground">
            {COMPONENT_DEFS[inspectTarget.type]?.name}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">X</span>
          <span className="font-mono text-foreground">{Math.round(inspectTarget.x)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Y</span>
          <span className="font-mono text-foreground">{Math.round(inspectTarget.y)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rotation</span>
          <span className="font-mono text-foreground">{inspectTarget.rotation || 0}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Pins</span>
          <span className="font-mono text-foreground">
            {COMPONENT_DEFS[inspectTarget.type]?.pins?.length || 0}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">ID</span>
          <span className="font-mono text-muted-foreground text-[10px] truncate max-w-[80px]">
            {inspectTarget.id.slice(0, 8)}…
          </span>
        </div>
      </div>
    </div>
  );
};
