'use client'

import { create } from 'zustand'
import type { Contact, VoiceProfile } from '@/types'

interface ContactsState {
  // State
  contacts: Contact[]
  selectedContactId: string | null
  
  // Actions
  addContact: (contact: Omit<Contact, 'id' | 'firstInteraction' | 'lastInteraction'>) => void
  updateContact: (id: string, updates: Partial<Contact>) => void
  deleteContact: (id: string) => void
  selectContact: (id: string | null) => void
  updateVoiceProfile: (contactId: string, voiceProfile: Partial<VoiceProfile>) => void
  getContactById: (id: string) => Contact | undefined
}

// Mock data for development
const mockContacts: Contact[] = [
  {
    id: '+1234567890',
    name: 'Sarah',
    relationshipType: 'friend',
    voiceProfile: {
      description: 'Female voice in her 30s, warm timbre, conversational pacing, can be frustrated',
      gender: 'female',
      ageRange: '30s',
      accent: 'American',
      typicalEmotions: ['affectionate', 'frustrated', 'thoughtful'],
      speakingStyle: 'expressive, occasionally rapid when upset'
    },
    firstInteraction: new Date('2023-01-15'),
    lastInteraction: new Date(),
    totalMessages: 847,
    typicalValence: -0.2,
    typicalIntensity: 0.6
  },
  {
    id: '+0987654321',
    name: 'Mom',
    relationshipType: 'family',
    voiceProfile: {
      description: 'Female voice in her 60s, warm and caring tone, measured pacing',
      gender: 'female',
      ageRange: '60s',
      accent: 'American',
      typicalEmotions: ['caring', 'concerned', 'gentle'],
      speakingStyle: 'calm, supportive, occasionally worried'
    },
    firstInteraction: new Date('2022-06-01'),
    lastInteraction: new Date(),
    totalMessages: 234,
    typicalValence: 0.5,
    typicalIntensity: 0.4
  },
  {
    id: '+1122334455',
    name: 'Dad',
    relationshipType: 'family',
    voiceProfile: {
      description: 'Male voice in his 60s, deep and steady tone',
      gender: 'male',
      ageRange: '60s',
      accent: 'American',
      typicalEmotions: ['supportive', 'proud', 'calm'],
      speakingStyle: 'measured, thoughtful pauses'
    },
    firstInteraction: new Date('2022-06-01'),
    lastInteraction: new Date(),
    totalMessages: 156,
    typicalValence: 0.4,
    typicalIntensity: 0.3
  },
  {
    id: '+5566778899',
    name: 'Sister',
    relationshipType: 'family',
    voiceProfile: {
      description: 'Female voice in her late 20s, energetic and upbeat',
      gender: 'female',
      ageRange: '20s',
      accent: 'American',
      typicalEmotions: ['excited', 'supportive', 'playful'],
      speakingStyle: 'fast-paced, enthusiastic'
    },
    firstInteraction: new Date('2022-08-15'),
    lastInteraction: new Date(),
    totalMessages: 312,
    typicalValence: 0.6,
    typicalIntensity: 0.7
  },
  {
    id: '+9988776655',
    name: 'Brother',
    relationshipType: 'family',
    voiceProfile: {
      description: 'Male voice in his early 30s, casual and relaxed',
      gender: 'male',
      ageRange: '30s',
      accent: 'American',
      typicalEmotions: ['relaxed', 'humorous', 'caring'],
      speakingStyle: 'laid-back, occasional jokes'
    },
    firstInteraction: new Date('2022-07-01'),
    lastInteraction: new Date(),
    totalMessages: 189,
    typicalValence: 0.3,
    typicalIntensity: 0.4
  },
  {
    id: '+1111111111',
    name: 'Alex',
    relationshipType: 'colleague',
    voiceProfile: {
      description: 'Male voice in his 40s, professional and direct',
      gender: 'male',
      ageRange: '40s',
      accent: 'American',
      typicalEmotions: ['focused', 'professional', 'collaborative'],
      speakingStyle: 'clear, concise, business-like'
    },
    firstInteraction: new Date('2023-09-01'),
    lastInteraction: new Date(),
    totalMessages: 78,
    typicalValence: 0.1,
    typicalIntensity: 0.3
  },
  {
    id: '+2222222222',
    name: 'Jordan',
    relationshipType: 'colleague',
    voiceProfile: {
      description: 'Non-binary voice in their 30s, friendly and approachable',
      gender: 'non-binary',
      ageRange: '30s',
      accent: 'American',
      typicalEmotions: ['friendly', 'helpful', 'patient'],
      speakingStyle: 'warm, inclusive, encouraging'
    },
    firstInteraction: new Date('2023-10-15'),
    lastInteraction: new Date(),
    totalMessages: 45,
    typicalValence: 0.4,
    typicalIntensity: 0.4
  },
  {
    id: '+3333333333',
    name: 'Sam Miller',
    relationshipType: 'friend',
    voiceProfile: {
      description: 'Male voice in his 30s, thoughtful and empathetic',
      gender: 'male',
      ageRange: '30s',
      accent: 'British',
      typicalEmotions: ['thoughtful', 'empathetic', 'curious'],
      speakingStyle: 'reflective, good listener'
    },
    firstInteraction: new Date('2023-03-20'),
    lastInteraction: new Date(),
    totalMessages: 234,
    typicalValence: 0.3,
    typicalIntensity: 0.5
  }
]

export const useContactsStore = create<ContactsState>((set, get) => ({
  contacts: mockContacts,
  selectedContactId: null,
  
  addContact: (contact) => set((state) => ({
    contacts: [
      ...state.contacts,
      {
        ...contact,
        id: `contact_${Date.now()}`,
        firstInteraction: new Date(),
        lastInteraction: new Date()
      }
    ]
  })),
  
  updateContact: (id, updates) => set((state) => ({
    contacts: state.contacts.map(c => 
      c.id === id ? { ...c, ...updates, lastInteraction: new Date() } : c
    )
  })),
  
  deleteContact: (id) => set((state) => ({
    contacts: state.contacts.filter(c => c.id !== id),
    selectedContactId: state.selectedContactId === id ? null : state.selectedContactId
  })),
  
  selectContact: (id) => set({ selectedContactId: id }),
  
  updateVoiceProfile: (contactId, voiceProfile) => set((state) => ({
    contacts: state.contacts.map(c => 
      c.id === contactId 
        ? { ...c, voiceProfile: { ...c.voiceProfile, ...voiceProfile } }
        : c
    )
  })),
  
  getContactById: (id) => {
    return get().contacts.find(c => c.id === id)
  }
}))

