import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type User = {
  id: string;
  username: string;
  email: string;
  followers: number;
  following: number;
  badges: string[];
  bio?: string;
  banner?: string;
  avatar?: string;
  socialLinks?: { github?: string; twitter?: string; linkedin?: string; website?: string };
  skills?: { name: string; level: number }[];
  achievements?: { id: string; name: string; date: string; icon: string }[];
  pinnedProjects?: string[];
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
  collaborators?: Collaborator[];
  lastOpened?: number;
  starredBy?: string[];
  description?: string;
};

export type CollaboratorRole = 'Owner' | 'Editor' | 'Viewer';

export type Collaborator = {
  userId: string;
  role: CollaboratorRole;
  addedAt: string;
};

export type Presence = {
  userId: string;
  username: string;
  cursor?: { x: number; y: number };
  activeFile?: string;
  isTyping?: boolean;
  lastSeen: number;
};

export type CollaborationSession = {
  projectId: string;
  activeUsers: Presence[];
};

export type NotificationType = 
  | 'CollaboratorJoined' 
  | 'ProjectShared' 
  | 'InviteAccepted' 
  | 'Follow' 
  | 'Star' 
  | 'Comment' 
  | 'Reply'
  | 'ProjectUpdate'
  | 'Mention'
  | 'AISuggestion'
  | 'System';

export type AppNotification = {
  id: string;
  type: NotificationType;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  senderId?: string;
  projectId?: string;
};

interface AppState {
  currentUser: User | null;
  users: User[];
  posts: Post[];
  
  // Workspace State for loading viewed/forked projects
  loadedProject: { type: PostType; data: ProjectData; id?: string } | null;
  
  // Collaboration State
  activeSessions: Record<string, CollaborationSession>;
  currentSessionId: string | null;
  notifications: AppNotification[];
  
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
  
  // Project Management
  renameProject: (projectId: string, newTitle: string) => void;
  deleteProject: (projectId: string) => void;
  duplicateProject: (projectId: string) => string | undefined;
  toggleStarProject: (projectId: string) => void;

  incrementViews: (postId: string) => void;
  awardBadge: (userId: string, badge: string) => void;
  forkProject: (postId: string) => string | undefined;
  loadProject: (type: PostType, data: ProjectData, id?: string) => void;
  clearLoadedProject: () => void;
  followUser: (userId: string) => void;
  unfollowUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => void;
  togglePinProject: (projectId: string) => void;

  // Collaboration Actions
  joinSession: (projectId: string) => void;
  leaveSession: () => void;
  updatePresence: (presence: Partial<Presence>) => void;
  addCollaborator: (postId: string, userId: string, role: CollaboratorRole) => void;
  removeCollaborator: (postId: string, userId: string) => void;
  addNotification: (type: NotificationType, message: string, link?: string) => void;
  // Notification Actions
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;

  // AI Trigger State
  aiTrigger: { prompt: string; timestamp: number } | null;
  triggerAI: (prompt: string) => void;
  clearAITrigger: () => void;
  
  // AI UI State
  aiOrbPosition: { x: number; y: number } | null;
  setAiOrbPosition: (pos: { x: number; y: number } | null) => void;

  // Store State
  wishlist: string[];
  cart: string[];
  toggleWishlist: (productId: string) => void;
  addToCart: (productId: string) => void;
  removeFromCart: (productId: string) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      users: [
        { 
          id: '1', 
          username: 'protolab_admin', 
          email: 'admin@protolab.com', 
          followers: 1250, 
          following: 420,
          badges: ['Master Engineer', 'Open Source Contributor'],
          bio: 'Lead Engineer at ProtoLab. Passionate about hardware-software co-design, IoT architecture, and high-performance PCB design. Building the future of rapid engineering prototyping.',
          skills: [
            { name: 'Embedded Systems', level: 95 },
            { name: 'PCB Design', level: 90 },
            { name: 'IoT Architecture', level: 85 },
            { name: 'Robotics', level: 80 }
          ],
          achievements: [
            { id: 'a1', name: 'Master Engineer', date: '2025-01-10', icon: 'Shield' },
            { id: 'a2', name: 'Open Source Contributor', date: '2024-12-01', icon: 'Code' }
          ],
          socialLinks: {
            github: 'https://github.com/protolab',
            linkedin: 'https://linkedin.com/in/protolab',
            twitter: 'https://twitter.com/protolab'
          },
          pinnedProjects: ['p1', 'p3']
        },
      ],
      posts: [
        {
          id: 'p1',
          userId: '1',
          type: 'Simulation',
          title: 'Advanced Robotics Arm Controller',
          description: 'A precise 6-DOF robotic arm simulation with inverse kinematics and smooth motion planning. Optimized for real-time performance.',
          data: {},
          preview: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=60',
          createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
          likes: 24,
          likedBy: [],
          starredBy: ['1'],
          comments: [],
          views: 1205,
          forks: 12,
          versions: [],
          visibility: 'Public',
          complexity: 'Advanced',
          tags: ['Robotics', 'Control', 'Arduino'],
          componentsUsed: ['Servo Motor', 'Potentiometer', 'Arduino Uno'],
          lastOpened: Date.now()
        },
        {
          id: 'p2',
          userId: '1',
          type: 'Code',
          title: 'ESP32 Smart Home Gateway',
          description: 'IoT gateway for managing multiple Zigbee and BLE devices. Features an elegant web dashboard and MQTT integration.',
          data: {},
          preview: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=800&auto=format&fit=crop&q=60',
          createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
          likes: 45,
          likedBy: [],
          starredBy: [],
          comments: [],
          views: 890,
          forks: 5,
          versions: [],
          visibility: 'Public',
          complexity: 'Intermediate',
          tags: ['IoT', 'ESP32', 'Automation'],
          componentsUsed: ['ESP32', 'DHT11 Sensor', 'OLED Display']
        },
        {
          id: 'p3',
          userId: '1',
          type: 'PCB Design',
          title: 'Compact Drone ESC v2.0',
          description: 'High-power Electronic Speed Controller for racing drones. Optimized for minimal noise and maximum current throughput.',
          data: {},
          preview: 'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=60',
          createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
          likes: 89,
          likedBy: [],
          starredBy: ['1'],
          comments: [],
          views: 3400,
          forks: 28,
          versions: [],
          visibility: 'Public',
          complexity: 'Advanced',
          tags: ['PCB', 'Drone', 'Power'],
          componentsUsed: ['MOSFET', 'Shunt Resistor', 'STM32']
        }
      ],
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

      renameProject: (projectId, newTitle) => {
        set(state => ({
          posts: state.posts.map(p => p.id === projectId ? { ...p, title: newTitle } : p)
        }));
      },

      deleteProject: (projectId) => {
        set(state => ({
          posts: state.posts.filter(p => p.id !== projectId)
        }));
      },

      duplicateProject: (projectId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const project = get().posts.find(p => p.id === projectId);
        if (!project) return;

        const newId = Date.now().toString();
        const duplicated: Post = {
          ...project,
          id: newId,
          userId: currentUser.id,
          title: `${project.title} (Copy)`,
          createdAt: new Date().toISOString(),
          lastOpened: Date.now(),
          likes: 0,
          likedBy: [],
          starredBy: [],
          comments: [],
          views: 0,
          forks: 0,
        };
        set(state => ({ posts: [duplicated, ...state.posts] }));
        return newId;
      },

      toggleStarProject: (projectId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        set(state => ({
          posts: state.posts.map(p => {
            if (p.id !== projectId) return p;
            const starredBy = p.starredBy || [];
            const isStarred = starredBy.includes(currentUser.id);
            return {
              ...p,
              starredBy: isStarred 
                ? starredBy.filter(id => id !== currentUser.id) 
                : [...starredBy, currentUser.id]
            };
          })
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
          lastOpened: Date.now(),
          likes: 0,
          likedBy: [],
          starredBy: [],
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

      loadProject: (type, data, id) => {
        if (id) {
          set(state => ({
            posts: state.posts.map(p => p.id === id ? { ...p, lastOpened: Date.now() } : p)
          }));
        }
        set({ loadedProject: { type, data, id } });
      },
      clearLoadedProject: () => set({ loadedProject: null }),

      followUser: (targetUserId) => {
        const currentUser = get().currentUser;
        if (!currentUser || currentUser.id === targetUserId) return;
        set((state) => ({
          users: state.users.map((user) => user.id === targetUserId ? { ...user, followers: user.followers + 1 } : user),
          currentUser: state.currentUser ? { ...state.currentUser, following: state.currentUser.following + 1 } : null
        }));
      },

      unfollowUser: (targetUserId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        set((state) => ({
          users: state.users.map((user) => user.id === targetUserId ? { ...user, followers: Math.max(0, user.followers - 1) } : user),
          currentUser: state.currentUser ? { ...state.currentUser, following: Math.max(0, state.currentUser.following - 1) } : null
        }));
      },

      updateProfile: (data) => {
        set(state => ({
          currentUser: state.currentUser ? { ...state.currentUser, ...data } : null,
          users: state.users.map(u => u.id === state.currentUser?.id ? { ...u, ...data } : u)
        }));
      },

      togglePinProject: (projectId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        const pins = currentUser.pinnedProjects || [];
        const newPins = pins.includes(projectId) 
          ? pins.filter(id => id !== projectId) 
          : [...pins, projectId].slice(0, 6);
        
        get().updateProfile({ pinnedProjects: newPins });
      },

      aiTrigger: null,
      triggerAI: (prompt) => set({ aiTrigger: { prompt, timestamp: Date.now() } }),
      clearAITrigger: () => set({ aiTrigger: null }),

      activeSessions: {},
      currentSessionId: null,
      notifications: [
        {
          id: 'n1',
          type: 'Follow',
          message: 'Sarah Chen started following your engineering portfolio.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          senderId: '2'
        },
        {
          id: 'n2',
          type: 'Star',
          message: 'Your project "Advanced Robotics Arm" was starred by 5 engineers.',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          projectId: 'p1'
        },
        {
          id: 'n3',
          type: 'AISuggestion',
          message: 'Proto AI: Your "ESP32 Gateway" code could be optimized for low-power mode. Click to view suggestions.',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          read: true,
          projectId: 'p2'
        },
        {
          id: 'n4',
          type: 'CollaboratorJoined',
          message: 'Alex Riviera joined the "Drone ESC" workspace.',
          timestamp: new Date(Date.now() - 172800000).toISOString(),
          read: true,
          projectId: 'p3'
        }
      ],

      joinSession: (projectId) => {
        const currentUser = get().currentUser;
        if (!currentUser) return;
        
        const sessions = { ...get().activeSessions };
        if (!sessions[projectId]) {
          sessions[projectId] = { projectId, activeUsers: [] };
        }

        const currentPresence: Presence = {
          userId: currentUser.id,
          username: currentUser.username,
          lastSeen: Date.now()
        };

        sessions[projectId].activeUsers = [
          ...sessions[projectId].activeUsers.filter(u => u.userId !== currentUser.id),
          currentPresence
        ];

        set({ activeSessions: sessions, currentSessionId: projectId });
        get().addNotification('CollaboratorJoined', `You joined workspace ${projectId}`);
      },

      leaveSession: () => {
        const currentUser = get().currentUser;
        const sessionId = get().currentSessionId;
        if (!currentUser || !sessionId) return;

        const sessions = { ...get().activeSessions };
        if (sessions[sessionId]) {
          sessions[sessionId].activeUsers = sessions[sessionId].activeUsers.filter(u => u.userId !== currentUser.id);
        }

        set({ activeSessions: sessions, currentSessionId: null });
      },

      updatePresence: (presence) => {
        const currentUser = get().currentUser;
        const sessionId = get().currentSessionId;
        if (!currentUser || !sessionId) return;

        set(state => {
          const sessions = { ...state.activeSessions };
          if (sessions[sessionId]) {
            sessions[sessionId].activeUsers = sessions[sessionId].activeUsers.map(u => 
              u.userId === currentUser.id ? { ...u, ...presence, lastSeen: Date.now() } : u
            );
          }
          return { activeSessions: sessions };
        });
      },

      addCollaborator: (postId, userId, role) => {
        set(state => ({
          posts: state.posts.map(p => p.id === postId ? {
            ...p,
            collaborators: [
              ...(p.collaborators || []),
              { userId, role, addedAt: new Date().toISOString() }
            ]
          } : p)
        }));
        const user = get().users.find(u => u.id === userId);
        if (user) get().addNotification('ProjectShared', `Shared project with ${user.username}`);
      },

      removeCollaborator: (postId, userId) => {
        set(state => ({
          posts: state.posts.map(p => p.id === postId ? {
            ...p,
            collaborators: (p.collaborators || []).filter(c => c.userId !== userId)
          } : p)
        }));
      },

      addNotification: (notif) => {
        const newNotif: AppNotification = {
          ...notif,
          id: Math.random().toString(36).substring(7),
          timestamp: new Date().toISOString(),
          read: false
        };
        set(state => ({ notifications: [newNotif, ...state.notifications].slice(0, 100) }));
      },

      markNotificationRead: (id) => {
        set(state => ({
          notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
        }));
      },

      markAllNotificationsRead: () => {
        set(state => ({
          notifications: state.notifications.map(n => ({ ...n, read: true }))
        }));
      },

      deleteNotification: (id) => {
        set(state => ({
          notifications: state.notifications.filter(n => n.id !== id)
        }));
      },

      aiOrbPosition: null,
      setAiOrbPosition: (aiOrbPosition) => set({ aiOrbPosition }),

      wishlist: [],
      cart: [],
      toggleWishlist: (productId) => set(state => ({
        wishlist: state.wishlist.includes(productId) 
          ? state.wishlist.filter(id => id !== productId) 
          : [...state.wishlist, productId]
      })),
      addToCart: (productId) => set(state => ({
        cart: [...state.cart, productId]
      })),
      removeFromCart: (productId) => set(state => ({
        cart: state.cart.filter(id => id !== productId)
      })),
    }),
    { name: 'protolab-storage' }
  )
);
