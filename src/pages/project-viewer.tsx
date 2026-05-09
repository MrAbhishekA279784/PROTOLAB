import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProjectViewer() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { posts, loadProject, incrementViews, currentUser } = useStore();

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }

    const post = posts.find((p) => p.id === id);
    if (!post) {
      toast.error("Project not found or was deleted.");
      navigate("/");
      return;
    }

    // Check visibility
    if (post.visibility === "Private" && post.userId !== currentUser?.id) {
      toast.error("This project is private.");
      navigate("/");
      return;
    }

    // Record view
    incrementViews(post.id);

    // Load project globally and navigate to index to render the right mode
    loadProject(post.type, post.data, post.id);

    // Pass the target mode hash so Index knows what to mount if we want to explicitly route it,
    // but Index currently determines activeMode from loadProject via its own internal state tracking?
    // Wait, Index.tsx local state `activeMode` doesn't know about `loadedProject` automatically!
    // We should pass a state parameter:
    let targetMode = "sim";
    if (post.type === "Code") targetMode = "code";
    if (post.type === "PCB Design") targetMode = "pcb";

    navigate("/", { state: { targetMode } });
    toast.success(`Loaded project: ${post.title}`);

  }, [id, posts, navigate, loadProject, incrementViews, currentUser]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <h2 className="text-xl font-semibold">Loading Project...</h2>
      </div>
    </div>
  );
}
