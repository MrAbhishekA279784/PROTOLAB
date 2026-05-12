import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  username: string;
  email: string;
  followers: number;
  badges: string[];
};

export type ProjectData = Record<string, unknown>;

export type ProjectVersion = {
  id: string;
  name: string;
  data: ProjectData;
  createdAt: string;
  modifiedBy: string;
};

export type PostType = 'Simulation' | 'Code' | 'PCB Design';
export type Complexity = 'Beginner' | 'Intermediate' | 'Advanced';
export type Visibility = 'Public' | 'Private';

export type Comment = {
  id: string;
  userId: string;
  text: string;
  createdAt: string;
  upvotes: number;
  replies: Comment[];
};

export type Post = {
  id: string;
  userId: string;
  type: PostType;
  title: string;
  data: ProjectData;
  preview: string;
  createdAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
  views: number;
  forks: number;
  versions: ProjectVersion[];
  visibility: Visibility;
  complexity: Complexity;
  tags: string[];
  componentsUsed: string[];
};

interface AppState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  
  // Workspace State for loading viewed/forked projects
  loadedProject: { type: PostType; data: ProjectData; id?: string } | null;
  
  // Theme state
  theme: "light" | "dark";
  setTheme: (theme: "light" | "dark") => void;

  hasSeenTour: boolean;
  setHasSeenTour: (v: boolean) => void;

  login: (username: string) => void;
  signup: (username: string, email: string) => void;
  logout: () => void;
  
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'likes' | 'likedBy' | 'comments' | 'views' | 'forks' | 'versions'>) => void;
  likePost: (postId: string) => void;
  addComment: (postId: string, text: string, replyToId?: string) => void;
  upvoteComment: (postId: string, commentId: string) => void;
  saveVersion: (postId: string, name: string, data: ProjectData) => void;
  incrementViews: (postId: string) => void;
  awardBadge: (userId: string, badge: string) => void;
  forkProject: (postId: string) => string | undefined;
  loadProject: (type: PostType, data: ProjectData, id?: string) => void;
  clearLoadedProject: () => void;
  followUser: (userId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { id: '1', username: 'protolab_admin', email: 'admin@protolab.com', followers: 10, badges: ['First Project'] },
      ],
      posts: [],
      loadedProject: null,
      theme: "light",
      setTheme: (theme) => set({ theme }),
      hasSeenTour: false,
      setHasSeenTour: (hasSeenTour) => set({ hasSeenTour }),

      login: (username) => {
        const user = get().users.find((u) => u.username === username);
        if (user) set({ currentUser: user });
        else throw new Error('User not found');
      },

      signup: (username, email) => {
        if (get().users.find((u) => u.username === username)) throw new Error('Username already exists');
        const newUser: User = { id: Date.now().toString(), username, email, followers: 0, badges: [] };
        set({ users: [...get().users, newUser], currentUser: newUser });
      },

      logout: () => set({ currentUser: null }),

      addPost: (postData) => {
        const newPost: Post = {
          ...postData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
          comments: [],
          views: 0,
          forks: 0,
          versions: [{ id: 'v1', name: 'Initial Commit', data: postData.data, createdAt: new Date().toISOString(), modifiedBy: get().currentUser?.id || '' }]
        };
        set({ posts: [newPost, ...get().posts] });
      },

      likePost: (postId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              const hasLiked = post.likedBy.includes(currentUser.id);
              return {
                ...post,
                likes: hasLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
                likedBy: hasLiked ? post.likedBy.filter((id) => id !== currentUser.id) : [...post.likedBy, currentUser.id],
              };
            }
            return post;
          }),
        }));
      },

      addComment: (postId, text, replyToId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        const newComment: Comment = {
          id: Date.now().toString(),
          userId: currentUser.id,
          text,
          createdAt: new Date().toISOString(),
          upvotes: 0,
          replies: []
        };

        set((state) => ({
          posts: state.posts.map((post) => {
            if (post.id === postId) {
              if (!replyToId) {
                return { ...post, comments: [...post.comments, newComment] };
              } else {
                // Nested reply (1 level deep)
                const addReply = (commentsList: Comment[]): Comment[] => {
                  return commentsList.map(c => {
                    if (c.id === replyToId) return { ...c, replies: [...(c.replies || []), newComment] };
                    return c;
                  });
                };
                return { ...post, comments: addReply(post.comments) };
              }
            }
            return post;
          }),
        }));
      },

      upvoteComment: (postId, commentId) => {
        set(state => ({
           posts: state.posts.map(p => {
             if (p.id !== postId) return p;
             const deepUpdate = (comments: Comment[]): Comment[] => comments.map(c => {
                 if (c.id === commentId) return { ...c, upvotes: (c.upvotes || 0) + 1 };
                 if (c.replies?.length) return { ...c, replies: deepUpdate(c.replies) };
                 return c;
             });
             return { ...p, comments: deepUpdate(p.comments) };
           })
        }));
      },

      saveVersion: (postId, name, data) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        set(state => ({
          posts: state.posts.map(p => p.id === postId ? {
            ...p,
            versions: [...(p.versions || []), {
               id: `v${(p.versions?.length || 0) + 1}`,
               name, data, createdAt: new Date().toISOString(), modifiedBy: currentUser.id
            }],
            data
          } : p)
        }));
      },

      incrementViews: (postId) => {
        set((state) => ({
          posts: state.posts.map((post) => post.id === postId ? { ...post, views: post.views + 1 } : post)
        }));
      },

      awardBadge: (userId, badge) => {
        set(state => ({
          users: state.users.map(u => u.id === userId && !u.badges?.includes(badge) ? { ...u, badges: [...(u.badges || []), badge] } : u)
        }));
      },

      forkProject: (postId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const post = get().posts.find(p => p.id === postId);
        if (!post) return;

        const newId = Date.now().toString();
        const forkedPost: Post = {
          ...post,
          id: newId,
          userId: currentUser.id,
          title: `Fork of ${post.title}`,
          createdAt: new Date().toISOString(),
          likes: 0,
          likedBy: [],
          comments: [],
          views: 0,
          forks: 0,
          versions: [{ id: 'v1', name: 'Forked', data: post.data, createdAt: new Date().toISOString(), modifiedBy: currentUser.id }],
          visibility: 'Private',
        };
        // increment parent forks and add new post
        set(state => ({ posts: [forkedPost, ...state.posts.map(p => p.id === postId ? { ...p, forks: (p.forks || 0) + 1 } : p)] }));
        return newId;
      },

      loadProject: (type, data, id) => set({ loadedProject: { type, data, id } }),
      clearLoadedProject: () => set({ loadedProject: null }),

      followUser: (targetUserId) => {
        const currentUser = get().currentUser;
        if (!currentUser || currentUser.id === targetUserId) return;
        set((state) => ({
          users: state.users.map((user) => user.id === targetUserId ? { ...user, followers: user.followers + 1 } : user),
        }));
      },
    }),
    { name: 'protolab-storage' }
  )
);
