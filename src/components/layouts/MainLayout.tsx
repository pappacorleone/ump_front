'use client'

import { type FC, type ReactNode, useState, useEffect } from 'react'
import { SourcesPanel, ChatPanel, ModesPanel, AddSourceModal } from '@/components/features'
import { GingerLogo, Settings, Moon, Sun } from '@/components/ui/Icons'
import { useGingerStore } from '@/stores/useGingerStore'

interface MainLayoutProps {
  children?: ReactNode
}

export const MainLayout: FC<MainLayoutProps> = () => {
  const { sources, selectedSourceIds, isDarkMode, toggleDarkMode } = useGingerStore()
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Apply dark mode class to html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  const selectedSources = sources.filter(s => selectedSourceIds.includes(s.id))
  const sourceLabel = selectedSources.length > 0
    ? selectedSources.map(s => s.name).join(' + ')
    : 'No sources selected'

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">
      {/* Global Top Header */}
      <div className="h-14 border-b border-border-light bg-background flex items-center justify-between px-4 flex-shrink-0">
        {/* Left side - Logo and Brand */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-hover-surface transition-colors"
            aria-label="Ginger Home"
            onClick={() => window.location.reload()}
          >
            <GingerLogo size={24} className="text-voice-accent" />
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-serif font-semibold text-text-primary">Ginger</h1>
            <span className="text-text-secondary">|</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary">Analyzing {sourceLabel}</span>
              <span className="px-2 py-0.5 rounded-full text-xs bg-surface text-text-secondary border border-border-light">
                Public
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Actions and Profile */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-hover-surface text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          <span className="text-xs text-text-secondary px-2">PRO</span>
          
          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-8 h-8 rounded-full bg-surface border border-border-light overflow-hidden hover:border-border-medium transition-colors"
              aria-label="User profile and settings"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-surface border border-border-light rounded-lg shadow-lg z-50 py-1">
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-hover-surface transition-colors flex items-center gap-2"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings size={16} className="text-text-secondary" />
                    Settings
                  </button>
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-text-primary hover:bg-hover-surface transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Help
                  </button>
                  <div className="h-px bg-border-light my-1" />
                  <button
                    className="w-full px-4 py-2 text-left text-sm text-text-secondary hover:text-text-primary hover:bg-hover-surface transition-colors"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    Sign out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Sources */}
        <SourcesPanel />

        {/* Center Panel - Chat */}
        <div className="flex-1">
          <ChatPanel />
        </div>

        {/* Right Panel - Modes */}
        <ModesPanel />
      </div>

      {/* Global Modals */}
      <AddSourceModal />
    </div>
  )
}
