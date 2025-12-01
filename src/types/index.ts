// Source Types
export type SourcePlatform = 'whatsapp' | 'email' | 'journal' | 'imessage' | 'file' | 'link' | 'paste'

export interface Source {
  id: string
  name: string
  platform: SourcePlatform
  previewText: string
  messageCount?: number
  entryCount?: number
  isSyncing?: boolean
  lastUpdated: Date
}

// Lens Types
export type LensType = 'damasio' | 'cbt' | 'act' | 'ifs' | 'stoic'

export interface Lens {
  id: LensType
  name: string
  fullName: string
  description: string
  color: string
}

// Message Types
export type MessageRole = 'user' | 'assistant'

export interface Message {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  lens?: LensType
  isVoiceTranscript?: boolean
  highlightedTerms?: string[]
}

// Mode Types
export type ModeType = 'reflect' | 'roleplay' | 'patterns' | 'somatic'

export interface Mode {
  id: ModeType
  name: string
  subtitle: string
  description: string
  icon: string
}

// Artifact Types
export type ArtifactType = 'reflection' | 'pattern' | 'voice-note' | 'insight' | 'export'

export interface Artifact {
  id: string
  type: ArtifactType
  title: string
  description: string
  date: Date
}

// Voice Input States
export type VoiceState = 'idle' | 'listening' | 'processing' | 'text'

// Panel States
export interface PanelState {
  sourcesExpanded: boolean
  modesOpen: boolean
}
