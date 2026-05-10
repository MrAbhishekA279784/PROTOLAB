import React from "react";
import { List, ChevronDown, Search } from "lucide-react";
import { COMPONENT_DEFS } from "../constants/component-defs";

interface ComponentLibraryProps {
  activeCategory: string;
  setActiveCategory: (val: string) => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({
  activeCategory,
  setActiveCategory,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="w-[300px] bg-card/95 backdrop-blur-sm border-l border-border flex flex-col shrink-0 z-20 shadow-[-4px_0_20px_-5px_rgba(0,0,0,0.05)] animate-in slide-in-from-right-8 fade-in duration-500">
      <div className="p-4 border-b border-border bg-background/50">
        <div className="flex items-center justify-between mb-4">
          <span className="font-bold text-foreground">Components</span>
          <button className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:scale-110 active:scale-95 transition-all">
            <List className="w-4 h-4" />
          </button>
        </div>
        <div className="relative mb-3 group">
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full appearance-none bg-card border border-border text-foreground py-2 pl-3 pr-8 rounded font-semibold text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-300 group-hover:border-primary"
          >
            {["Basic", "Sensors", "Power", "Output", "Microcontrollers", "All"].map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-muted-foreground pointer-events-none group-hover:text-primary transition-colors" />
        </div>
        <div className="relative group">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-border pl-9 pr-3 py-2 rounded text-sm bg-card focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all duration-300 group-hover:border-primary"
          />
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5 group-focus-within:text-primary transition-colors" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 content-start grid grid-cols-2 gap-3 pb-24">
        {Object.keys(COMPONENT_DEFS)
          .filter(
            (key) =>
              (activeCategory === "All" || COMPONENT_DEFS[key].type === activeCategory) &&
              (searchTerm === "" ||
                COMPONENT_DEFS[key].name.toLowerCase().includes(searchTerm.toLowerCase()))
          )
          .map((key) => {
            const def = COMPONENT_DEFS[key];
            return (
              <div
                key={key}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("new_component", key)}
                className="flex flex-col items-center bg-card p-3 border border-border rounded-lg cursor-grab active:cursor-grabbing hover:border-primary shadow-sm hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300 h-[110px] group transform z-10 hover:z-20"
              >
                <div className="flex-1 w-full flex items-center justify-center transform scale-[0.5] group-hover:scale-[0.55] group-hover:-translate-y-1 transition-transform duration-300 origin-center pointer-events-none">
                  {def.render({ isRunning: false })}
                </div>
                <span className="text-[11px] font-bold text-muted-foreground mt-auto text-center leading-tight group-hover:text-primary transition-colors">
                  {def.name}
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
};
