import { motion } from "framer-motion";
import { TrendingUp, Star, Users, Zap, ArrowRight, Activity } from "lucide-react";
import { LiveActivityFeed } from "./activity-feed";

export default function CommunityTrending() {
  return (
    <div className="w-80 shrink-0 border-l border-border/50 bg-card/10 overflow-y-auto custom-scrollbar hidden xl:flex flex-col p-6">
      <LiveActivityFeed />
    </div>
  );
}
