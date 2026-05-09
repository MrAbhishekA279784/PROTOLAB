import React from "react";
import { X } from "lucide-react";

interface CommentNoteProps {
  comment: any;
  setComments: React.Dispatch<React.SetStateAction<any[]>>;
}

export const CommentNote: React.FC<CommentNoteProps> = ({ comment, setComments }) => {
  return (
    <div className="absolute z-30 pointer-events-auto group" style={{ left: comment.x, top: comment.y }}>
      {comment.editing ? (
        <input
          autoFocus
          className="border-2 border-yellow-400 rounded bg-yellow-50 px-2 py-1 text-xs font-medium shadow-lg outline-none min-w-[120px]"
          defaultValue={comment.text}
          onBlur={(e) =>
            setComments((prev) =>
              prev.map((c) => (c.id === comment.id ? { ...c, text: e.target.value, editing: false } : c))
            )
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            if (e.key === "Escape") setComments((prev) => prev.filter((c) => c.id !== comment.id));
          }}
        />
      ) : (
        <div className="flex items-start gap-1">
          <div
            className="bg-yellow-100 border border-yellow-300 rounded px-2 py-1 text-xs font-medium text-yellow-800 shadow-sm cursor-pointer hover:bg-yellow-200 transition-colors max-w-[200px]"
            onDoubleClick={() =>
              setComments((prev) => prev.map((c) => (c.id === comment.id ? { ...c, editing: true } : c)))
            }
          >
            {comment.text || "Note"}
          </div>
          <button
            className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-all mt-0.5"
            onClick={() => setComments((prev) => prev.filter((c) => c.id !== comment.id))}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
};
