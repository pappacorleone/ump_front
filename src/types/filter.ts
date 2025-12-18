// Filter Bar Type Definitions

// Data Source Types
export type DataSourcePlatform = 'imessage' | 'whatsapp' | 'gmail' | 'voice_memos'

export interface DataSource {
  id: string
  platform: DataSourcePlatform
  name: string
  isConnected: boolean
  lastSyncedAt: Date | null
  messageCount: number
}

// Contact Group Types
export interface ContactGroup {
  id: string
  name: string
  memberIds: string[]
  createdAt: Date
}

// Time Range Types
export type TimeRangePreset = 'today' | 'yesterday' | 'last_7_days' | 'last_30_days' | 'all_time' | 'custom'

export interface TimeRange {
  preset: TimeRangePreset
  customStart?: Date
  customEnd?: Date
}

// Draft Types
export type DraftType = 'pattern' | 'reply' | 'insight'

export interface Draft {
  id: string
  type: DraftType
  title: string
  content: string
  relatedContactId?: string
  relatedContactName?: string
  createdAt: Date
  updatedAt: Date
}

// Filter State
export interface FilterState {
  selectedSourceIds: string[]
  timeRange: TimeRange
  selectedContactIds: string[]
  selectedGroupIds: string[]
}

// Popover State
export type ActivePopover = 'source' | 'time' | 'context' | 'drafts' | null

// Helper function to get start date from preset
export function getStartDateFromPreset(preset: TimeRangePreset): Date {
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (preset) {
    case 'today':
      return startOfDay
    case 'yesterday':
      return new Date(startOfDay.getTime() - 24 * 60 * 60 * 1000)
    case 'last_7_days':
      return new Date(startOfDay.getTime() - 7 * 24 * 60 * 60 * 1000)
    case 'last_30_days':
      return new Date(startOfDay.getTime() - 30 * 24 * 60 * 60 * 1000)
    case 'all_time':
      return new Date(0) // Beginning of time
    case 'custom':
      return startOfDay // Default to today, should use customStart
    default:
      return startOfDay
  }
}

// Helper function to format time range for display
export function formatTimeRangeLabel(timeRange: TimeRange): string {
  switch (timeRange.preset) {
    case 'today':
      return 'today'
    case 'yesterday':
      return 'yesterday'
    case 'last_7_days':
      return 'the last 7 days'
    case 'last_30_days':
      return 'the last 30 days'
    case 'all_time':
      return 'all time'
    case 'custom':
      if (timeRange.customStart && timeRange.customEnd) {
        const start = timeRange.customStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        const end = timeRange.customEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        return `${start} - ${end}`
      }
      return 'custom range'
    default:
      return 'the last 7 days'
  }
}

// Helper to format relative sync time
export function formatSyncTime(date: Date | null): string {
  if (!date) return 'Not synced'

  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}
