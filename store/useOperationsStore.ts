import { create } from 'zustand';
import { AIRecommendation, ChatMessage, UserResponse } from '../types';

export interface AlertNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'info' | 'warning' | 'danger' | 'success';
}

interface OperationsState {
  theme: 'dark' | 'light';
  activeRecommendation: AIRecommendation | null;
  activeRecommendationId: number | null;
  isProcessing: boolean;
  activeAlert: string | null;
  chatMessages: ChatMessage[];
  
  // Authentication State
  currentUser: UserResponse | null;
  token: string | null;
  
  // Notification State
  notifications: AlertNotification[];

  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  setActiveRecommendation: (rec: AIRecommendation | null, id?: number | null) => void;
  setIsProcessing: (val: boolean) => void;
  setActiveAlert: (alert: string | null) => void;
  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  // Auth Actions
  setCurrentUser: (user: UserResponse | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;

  // Notification Actions
  addNotification: (title: string, message: string, type?: 'info' | 'warning' | 'danger' | 'success') => void;
  markNotificationsAsRead: () => void;
  clearNotifications: () => void;
}

export const useOperationsStore = create<OperationsState>((set) => {
  // Safe extraction of tokens on mount
  let initialToken: string | null = null;
  let initialUser: UserResponse | null = null;
  if (typeof window !== 'undefined') {
    initialToken = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        initialUser = JSON.parse(userStr);
      } catch (e) {
        localStorage.removeItem('user');
      }
    }
  }

  return {
    theme: 'dark',
    activeRecommendation: null,
    activeRecommendationId: null,
    isProcessing: false,
    activeAlert: null,
    chatMessages: [
      {
        id: 'welcome',
        sender: 'assistant',
        text: 'RailSaarthi Emergency AI Copilot active. How can I assist you with station operations or emergency protocols today?',
        timestamp: new Date().toLocaleTimeString(),
      },
    ],
    
    // Auth State Init
    currentUser: initialUser,
    token: initialToken,
    
    // Notification State Init
    notifications: [
      {
        id: 'init',
        title: 'System Initialized',
        message: 'RailSaarthi operational intelligence telemetry link established.',
        timestamp: 'Just now',
        read: false,
        type: 'success'
      }
    ],

    setTheme: (theme) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme', theme);
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      set({ theme });
    },
    toggleTheme: () => {
      set((state) => {
        const newTheme = state.theme === 'dark' ? 'light' : 'dark';
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme', newTheme);
          if (newTheme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
        return { theme: newTheme };
      });
    },
    setActiveRecommendation: (rec, id = null) => set({ activeRecommendation: rec, activeRecommendationId: id }),
    setIsProcessing: (val) => set({ isProcessing: val }),
    setActiveAlert: (alert) => {
      set({ activeAlert: alert });
      if (alert) {
        // Automatically inject an alert into our notification tray
        const newNotif: AlertNotification = {
          id: Date.now().toString(),
          title: 'Disruption Telemetry',
          message: alert,
          timestamp: new Date().toLocaleTimeString(),
          read: false,
          type: alert.toLowerCase().includes('block') || alert.toLowerCase().includes('emergency') ? 'danger' : 'warning'
        };
        set((state) => ({ notifications: [newNotif, ...state.notifications] }));
      }
    },
    addChatMessage: (msg) => set((state) => ({ chatMessages: [...state.chatMessages, msg] })),
    clearChat: () =>
      set({
        chatMessages: [
          {
            id: 'welcome',
            sender: 'assistant',
            text: 'RailSaarthi Emergency AI Copilot active. How can I assist you with station operations or emergency protocols today?',
            timestamp: new Date().toLocaleTimeString(),
          },
        ],
      }),

    // Auth Actions implementation
    setCurrentUser: (user) => {
      if (typeof window !== 'undefined') {
        if (user) {
          localStorage.setItem('user', JSON.stringify(user));
        } else {
          localStorage.removeItem('user');
        }
      }
      set({ currentUser: user });
    },
    setToken: (token) => {
      if (typeof window !== 'undefined') {
        if (token) {
          localStorage.setItem('token', token);
        } else {
          localStorage.removeItem('token');
        }
      }
      set({ token });
    },
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      set({ token: null, currentUser: null });
    },

    // Notification Actions implementation
    addNotification: (title, message, type = 'info') => {
      const newNotif: AlertNotification = {
        id: Date.now().toString(),
        title,
        message,
        timestamp: new Date().toLocaleTimeString(),
        read: false,
        type
      };
      set((state) => ({ notifications: [newNotif, ...state.notifications] }));
    },
    markNotificationsAsRead: () => {
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true }))
      }));
    },
    clearNotifications: () => set({ notifications: [] })
  };
});
