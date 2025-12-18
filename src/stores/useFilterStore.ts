'use client'

import { create } from 'zustand'
import type {
  DataSource,
  DataSourcePlatform,
  ContactGroup,
  TimeRange,
  TimeRangePreset,
  Draft,
  DraftType,
  ActivePopover
} from '@/types'

// Mock data - will be moved to mockData.ts
const FIXED_NOW = new Date('2024-01-15T10:30:00Z')

const initialDataSources: DataSource[] = [
  {
    id: 'ds_imessage',
    platform: 'imessage',
    name: 'iMessage',
    isConnected: true,
    lastSyncedAt: new Date(FIXED_NOW.getTime() - 120000), // 2 mins ago
    messageCount: 142
  },
  {
    id: 'ds_whatsapp',
    platform: 'whatsapp',
    name: 'WhatsApp',
    isConnected: true,
    lastSyncedAt: new Date(FIXED_NOW.getTime() - 3600000), // 1 hour ago
    messageCount: 89
  },
  {
    id: 'ds_gmail',
    platform: 'gmail',
    name: 'Gmail',
    isConnected: true,
    lastSyncedAt: new Date(FIXED_NOW.getTime() - 300000), // 5 mins ago
    messageCount: 0
  },
  {
    id: 'ds_voice',
    platform: 'voice_memos',
    name: 'Voice Memos',
    isConnected: false,
    lastSyncedAt: null,
    messageCount: 0
  }
]

const initialContactGroups: ContactGroup[] = [
  {
    id: 'grp_family',
    name: 'Family Group',
    memberIds: ['+0987654321', '+1122334455', '+5566778899', '+9988776655'],
    createdAt: new Date('2023-06-01')
  },
  {
    id: 'grp_work',
    name: 'Work Team',
    memberIds: ['+1111111111', '+2222222222'],
    createdAt: new Date('2024-01-15')
  }
]

const initialDrafts: Draft[] = [
  {
    id: 'draft_1',
    type: 'pattern',
    title: 'Defensive Withdrawal Pattern',
    content: 'Defensive withdrawal often occurs when schedules are questioned. This triggers a protective response...',
    createdAt: new Date(FIXED_NOW.getTime() - 86400000),
    updatedAt: new Date(FIXED_NOW.getTime() - 86400000)
  },
  {
    id: 'draft_2',
    type: 'reply',
    title: 'Reply to Sarah',
    content: 'I hear that you feel ignored. I was focused on work, but I want to listen now.',
    relatedContactId: '+1234567890',
    relatedContactName: 'Sarah',
    createdAt: new Date(FIXED_NOW.getTime() - 3600000),
    updatedAt: new Date(FIXED_NOW.getTime() - 3600000)
  },
  {
    id: 'draft_3',
    type: 'insight',
    title: 'Communication Pattern',
    content: 'When feeling criticized, the instinct is to defend rather than listen. Consider pausing before responding.',
    createdAt: new Date(FIXED_NOW.getTime() - 7200000),
    updatedAt: new Date(FIXED_NOW.getTime() - 7200000)
  }
]

interface FilterState {
  // Data Sources
  dataSources: DataSource[]
  selectedSourceIds: string[]

  // Time Range
  timeRange: TimeRange

  // Contacts & Groups
  selectedContactIds: string[]
  selectedGroupIds: string[]
  contactGroups: ContactGroup[]
  contactSearchQuery: string

  // Drafts
  drafts: Draft[]

  // Popover State
  activePopover: ActivePopover

  // Source Actions
  toggleSource: (id: string) => void
  selectAllSources: () => void
  deselectAllSources: () => void

  // Time Actions
  setTimeRange: (range: TimeRange) => void
  setTimeRangePreset: (preset: TimeRangePreset) => void
  setCustomDateRange: (start: Date, end: Date) => void

  // Contact Actions
  toggleContact: (id: string) => void
  toggleGroup: (id: string) => void
  clearContactSelection: () => void
  setContactSearchQuery: (query: string) => void

  // Popover Actions
  setActivePopover: (popover: ActivePopover) => void
  closeAllPopovers: () => void

  // Draft Actions
  addDraft: (draft: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => void
  removeDraft: (id: string) => void
  updateDraft: (id: string, updates: Partial<Draft>) => void
  clearDrafts: () => void

  // Computed helpers
  getSelectedSourceCount: () => number
  getSelectedContactCount: () => number
  getAllSourcesSelected: () => boolean
  getDraftCount: () => number
}

export const useFilterStore = create<FilterState>((set, get) => ({
  // Initial State
  dataSources: initialDataSources,
  selectedSourceIds: ['ds_imessage', 'ds_whatsapp'], // Default: iMessage and WhatsApp selected

  timeRange: {
    preset: 'last_7_days',
    customStart: undefined,
    customEnd: undefined
  },

  selectedContactIds: [],
  selectedGroupIds: [],
  contactGroups: initialContactGroups,
  contactSearchQuery: '',

  drafts: initialDrafts,

  activePopover: null,

  // Source Actions
  toggleSource: (id) => set((state) => ({
    selectedSourceIds: state.selectedSourceIds.includes(id)
      ? state.selectedSourceIds.filter((sid) => sid !== id)
      : [...state.selectedSourceIds, id]
  })),

  selectAllSources: () => set((state) => ({
    selectedSourceIds: state.dataSources
      .filter(s => s.isConnected)
      .map(s => s.id)
  })),

  deselectAllSources: () => set({ selectedSourceIds: [] }),

  // Time Actions
  setTimeRange: (range) => set({ timeRange: range }),

  setTimeRangePreset: (preset) => set({
    timeRange: {
      preset,
      customStart: undefined,
      customEnd: undefined
    }
  }),

  setCustomDateRange: (start, end) => set({
    timeRange: {
      preset: 'custom',
      customStart: start,
      customEnd: end
    }
  }),

  // Contact Actions
  toggleContact: (id) => set((state) => ({
    selectedContactIds: state.selectedContactIds.includes(id)
      ? state.selectedContactIds.filter((cid) => cid !== id)
      : [...state.selectedContactIds, id]
  })),

  toggleGroup: (id) => set((state) => ({
    selectedGroupIds: state.selectedGroupIds.includes(id)
      ? state.selectedGroupIds.filter((gid) => gid !== id)
      : [...state.selectedGroupIds, id]
  })),

  clearContactSelection: () => set({
    selectedContactIds: [],
    selectedGroupIds: []
  }),

  setContactSearchQuery: (query) => set({ contactSearchQuery: query }),

  // Popover Actions
  setActivePopover: (popover) => set({ activePopover: popover }),

  closeAllPopovers: () => set({ activePopover: null }),

  // Draft Actions
  addDraft: (draft) => set((state) => ({
    drafts: [
      ...state.drafts,
      {
        ...draft,
        id: `draft_${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]
  })),

  removeDraft: (id) => set((state) => ({
    drafts: state.drafts.filter((d) => d.id !== id)
  })),

  updateDraft: (id, updates) => set((state) => ({
    drafts: state.drafts.map((d) =>
      d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
    )
  })),

  clearDrafts: () => set({ drafts: [] }),

  // Computed helpers
  getSelectedSourceCount: () => get().selectedSourceIds.length,

  getSelectedContactCount: () =>
    get().selectedContactIds.length + get().selectedGroupIds.length,

  getAllSourcesSelected: () => {
    const state = get()
    const connectedSources = state.dataSources.filter(s => s.isConnected)
    return connectedSources.every(s => state.selectedSourceIds.includes(s.id))
  },

  getDraftCount: () => get().drafts.length
}))
