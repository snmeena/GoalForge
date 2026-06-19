import { create } from 'zustand'
import { Goal, ViewState, SettingsTab, EngineType } from '@/components/dashboard/types'

interface UserProfile {
  id: string
  name: string
  username: string
  email: string
  avatarUrl: string
  bio: string
  twitterUrl: string
  githubUrl: string
  hasPassword: boolean
  canChangeUsername: boolean
}

interface NotificationSettings {
  reminderTime: string
  emailAlerts: boolean
  paceWarnings: boolean
  pushNotifications: boolean
  weeklyDigest: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

interface DashboardState {
  // Navigation
  activeView: ViewState
  activeSettingsTab: SettingsTab
  storedPreviousView: ViewState
  isMobileMenuOpen: boolean
  isProfileMenuOpen: boolean
  
  // Data
  activeGoals: Goal[]
  checkedInGoals: string[]
  searchQuery: string
  
  // User & Settings
  userProfile: UserProfile
  notifications: NotificationSettings
  
  // UI State
  isLoggingOut: boolean
  isUploading: boolean
  
  // Actions
  setActiveView: (view: ViewState) => void
  setActiveSettingsTab: (tab: SettingsTab) => void
  setStoredPreviousView: (view: ViewState) => void
  setIsMobileMenuOpen: (open: boolean) => void
  setIsProfileMenuOpen: (open: boolean) => void
  setActiveGoals: (goals: Goal[] | ((prev: Goal[]) => Goal[])) => void
  setCheckedInGoals: (ids: string[] | ((prev: string[]) => string[])) => void
  setSearchQuery: (query: string) => void
  setUserProfile: (profile: Partial<UserProfile>) => void
  setNotifications: (notifications: Partial<NotificationSettings>) => void
  setIsLoggingOut: (loggingOut: boolean) => void
  setIsUploading: (uploading: boolean) => void
}

export const useDashboardStore = create<DashboardState>((set) => ({
  // Navigation
  activeView: 'dashboard',
  activeSettingsTab: 'account',
  storedPreviousView: 'dashboard',
  isMobileMenuOpen: false,
  isProfileMenuOpen: false,
  
  // Data
  activeGoals: [],
  checkedInGoals: [],
  searchQuery: '',
  
  // User & Settings
  userProfile: {
    id: '',
    name: '',
    username: '',
    email: '',
    avatarUrl: '',
    bio: '',
    twitterUrl: '',
    githubUrl: '',
    hasPassword: true,
    canChangeUsername: false,
  },
  notifications: {
    reminderTime: '20:00',
    emailAlerts: true,
    paceWarnings: true,
    pushNotifications: false,
    weeklyDigest: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  },
  
  // UI State
  isLoggingOut: false,
  isUploading: false,
  
  // Actions
  setActiveView: (view) => set({ activeView: view }),
  setActiveSettingsTab: (tab) => set({ activeSettingsTab: tab }),
  setStoredPreviousView: (view) => set({ storedPreviousView: view }),
  setIsMobileMenuOpen: (open) => set({ isMobileMenuOpen: open }),
  setIsProfileMenuOpen: (open) => set({ isProfileMenuOpen: open }),
  setActiveGoals: (goals) => set((state) => ({ 
    activeGoals: typeof goals === 'function' ? goals(state.activeGoals) : goals 
  })),
  setCheckedInGoals: (ids) => set((state) => ({ 
    checkedInGoals: typeof ids === 'function' ? ids(state.checkedInGoals) : ids 
  })),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setUserProfile: (profile) => set((state) => ({ 
    userProfile: { ...state.userProfile, ...profile } 
  })),
  setNotifications: (notifications) => set((state) => ({ 
    notifications: { ...state.notifications, ...notifications } 
  })),
  setIsLoggingOut: (loggingOut) => set({ isLoggingOut: loggingOut }),
  setIsUploading: (uploading) => set({ isUploading: uploading }),
}))
