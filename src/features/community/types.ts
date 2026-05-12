// ─────────────────────────────────────────────────────────────────────────────
// Community Feature Types
// ─────────────────────────────────────────────────────────────────────────────

export type CommunityTab =
  | "feed"
  | "repositories"
  | "discussions"
  | "issues"
  | "pull-requests"
  | "developers";

export interface Issue {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  status: "open" | "closed";
  labels: string[];
  assignee?: string;
  assigneeAvatar?: string;
  comments: number;
  createdAt: string;
  repoName: string;
}

export interface PullRequest {
  id: string;
  title: string;
  author: string;
  authorAvatar: string;
  status: "open" | "merged" | "closed";
  baseBranch: string;
  headBranch: string;
  comments: number;
  createdAt: string;
  repoName: string;
  checksStatus: "passing" | "failing" | "pending";
}

export interface Developer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  languages: string[];
  followers: number;
  following: number;
  projectsCount: number;
  isFollowing?: boolean;
}

export interface Repository {
  id: string;
  name: string;
  description: string;
  language: string;
  languageColor: string;
  stars: number;
  forks: number;
  updatedAt: string;
  owner: string;
  ownerAvatar: string;
  visibility: "public" | "private";
  topics: string[];
}

export interface Discussion {
  id: string;
  title: string;
  body: string;
  author: string;
  authorAvatar: string;
  category: DiscussionCategory;
  createdAt: string;
  replies: number;
  upvotes: number;
  isPinned: boolean;
  isAnswered: boolean;
  labels: string[];
}

export type DiscussionCategory =
  | "general"
  | "ideas"
  | "q-and-a"
  | "show-and-tell"
  | "announcements";

export interface FeedItem {
  id: string;
  type: "project" | "star" | "fork" | "discussion" | "follow";
  actor: string;
  actorAvatar: string;
  target: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, string>;
}
