import type { Source, Message, Artifact, DataSource, ContactGroup, Draft } from '@/types'

// Use fixed dates to avoid hydration mismatches between server and client
const FIXED_NOW = new Date('2024-01-15T10:30:00Z')
const FIVE_MINS_AGO = new Date('2024-01-15T10:25:00Z')
const TWO_MINS_AGO = new Date('2024-01-15T10:28:00Z')
const TWO_DAYS_AGO = new Date('2024-01-13T10:30:00Z')
const FOUR_DAYS_AGO = new Date('2024-01-11T10:30:00Z')

// Sample Sources for Demo
export const sampleSources: Source[] = [
  {
    id: '1',
    name: 'Sarah',
    platform: 'whatsapp',
    previewText: 'Recent: "I feel like you never listen..."',
    messageCount: 847,
    lastUpdated: FIXED_NOW
  },
  {
    id: '2',
    name: 'Work',
    platform: 'email',
    previewText: 'Re: Project timeline and Q4 review',
    isSyncing: true,
    lastUpdated: FIXED_NOW
  },
  {
    id: '3',
    name: 'Journal',
    platform: 'journal',
    previewText: 'Entry: Feeling overwhelmed by changes',
    entryCount: 12,
    lastUpdated: FIXED_NOW
  },
  {
    id: '4',
    name: 'Mom',
    platform: 'imessage',
    previewText: 'Recent: "Call me when you get a chance"',
    messageCount: 234,
    lastUpdated: FIXED_NOW
  }
]

// Sample Messages for Demo
export const sampleMessages: Message[] = [
  {
    id: '1',
    role: 'assistant',
    content: 'Hello. I\'m Ginger. I see you\'ve connected your WhatsApp conversation with Sarah and your recent journal entries.\n\nThrough the Damasio lens, we can look at how your "somatic markers"—those gut feelings and body states—might be influencing your perception of these interactions. How are you feeling in your body right now when you think about that last message from her?',
    timestamp: FIVE_MINS_AGO,
    lens: 'damasio',
    highlightedTerms: ['somatic markers', 'Damasio lens']
  },
  {
    id: '2',
    role: 'user',
    content: '"I just feel really tight in my chest when I read her message about me not listening. It feels like I\'m being attacked."',
    timestamp: TWO_MINS_AGO,
    isVoiceTranscript: true
  },
  {
    id: '3',
    role: 'assistant',
    content: 'That tightness in your chest is a classic **somatic marker**. Your *protoself* is registering a threat to your social homeostasis.\n\nWhen Sarah\'s accusation triggers a defensive state. Let\'s sit with that sensation. Does it remind you of a younger version of yourself feeling unheard?',
    timestamp: FIXED_NOW,
    lens: 'damasio',
    highlightedTerms: ['somatic marker', 'protoself']
  }
]

// Sample Artifacts for Demo
export const sampleArtifacts: Artifact[] = [
  {
    id: '1',
    type: 'reflection',
    title: 'The "Listening" Trigger',
    description: 'Analysis of defensive somatic response when feeling unheard.',
    date: TWO_DAYS_AGO
  },
  {
    id: '2',
    type: 'pattern',
    title: 'Evening Anxiety Loop',
    description: 'Recurring pattern of anxious thoughts before bed.',
    date: FOUR_DAYS_AGO
  }
]

// ============================================
// Filter Bar Mock Data
// ============================================

// Data Sources for Filter Bar
export const mockDataSources: DataSource[] = [
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

// Contact Groups for Filter Bar
export const mockContactGroups: ContactGroup[] = [
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

// Drafts for Filter Bar Drafts Stack
export const mockDrafts: Draft[] = [
  {
    id: 'draft_1',
    type: 'pattern',
    title: 'Defensive Withdrawal Pattern',
    content: 'Defensive withdrawal often occurs when schedules are questioned. This triggers a protective response rooted in earlier experiences of feeling controlled.',
    createdAt: new Date(FIXED_NOW.getTime() - 86400000), // 1 day ago
    updatedAt: new Date(FIXED_NOW.getTime() - 86400000)
  },
  {
    id: 'draft_2',
    type: 'reply',
    title: 'Reply to Sarah',
    content: 'I hear that you feel ignored. I was focused on work, but I want to listen now.',
    relatedContactId: '+1234567890',
    relatedContactName: 'Sarah',
    createdAt: new Date(FIXED_NOW.getTime() - 3600000), // 1 hour ago
    updatedAt: new Date(FIXED_NOW.getTime() - 3600000)
  },
  {
    id: 'draft_3',
    type: 'insight',
    title: 'Communication Pattern',
    content: 'When feeling criticized, the instinct is to defend rather than listen. Consider pausing before responding.',
    createdAt: new Date(FIXED_NOW.getTime() - 7200000), // 2 hours ago
    updatedAt: new Date(FIXED_NOW.getTime() - 7200000)
  }
]

