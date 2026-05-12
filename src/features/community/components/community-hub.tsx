import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CommunitySidebar from "./community-sidebar";
import FeedTab from "./feed-tab";
import RepositoriesTab from "./repositories-tab";
import DiscussionsTab from "./discussions-tab";
import IssuesTab from "./issues-tab";
import PullRequestsTab from "./pull-requests-tab";
import DevelopersTab from "./developers-tab";
import type { CommunityTab } from "../types";

const tabVariants = {
  enter: { opacity: 0, x: 20 },
  center: { opacity: 1, x: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.15, ease: "easeIn" } },
};

export default function CommunityHub() {
  const [activeTab, setActiveTab] = useState<CommunityTab>("feed");

  return (
    <div className="h-full flex bg-background overflow-hidden">
      {/* Sidebar — hidden on mobile, visible on md+ */}
      <div className="hidden md:flex">
        <CommunitySidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Mobile Tab Bar — visible only on mobile */}
      <MobileTabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile top padding to account for mobile tab bar */}
        <div className="h-12 md:h-0 shrink-0" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={tabVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 overflow-hidden"
          >
            {activeTab === "feed" && <FeedTab />}
            {activeTab === "repositories" && <RepositoriesTab />}
            {activeTab === "discussions" && <DiscussionsTab />}
            {activeTab === "issues" && <IssuesTab />}
            {activeTab === "pull-requests" && <PullRequestsTab />}
            {activeTab === "developers" && <DevelopersTab />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ──────────────────────────── Mobile Tab Bar ──────────────────────────── */

import { Newspaper, FolderGit2, MessageCircle, CircleDot, GitPullRequest, Users2, type LucideIcon } from "lucide-react";

const MOBILE_TABS: { id: CommunityTab; label: string; icon: LucideIcon }[] = [
  { id: "feed", label: "Feed", icon: Newspaper },
  { id: "repositories", label: "Repos", icon: FolderGit2 },
  { id: "discussions", label: "Discuss", icon: MessageCircle },
  { id: "issues", label: "Issues", icon: CircleDot },
  { id: "pull-requests", label: "PRs", icon: GitPullRequest },
  { id: "developers", label: "Devs", icon: Users2 },
];

function MobileTabBar({
  activeTab,
  onTabChange,
}: {
  activeTab: CommunityTab;
  onTabChange: (tab: CommunityTab) => void;
}) {
  return (
    <div className="fixed top-12 left-0 right-0 z-30 md:hidden bg-card/90 backdrop-blur-md border-b border-border">
      <div className="flex items-center justify-around h-12">
        {MOBILE_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition-all duration-200 ${
                isActive
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
