"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"
import { useState, useEffect } from "react"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glassmorphism-modal text-theme-text-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-title-sm font-bold text-theme-text-primary">Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-body-lg font-semibold text-theme-task-text">Timer Durations</h3>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="deep">
                Deep Focus (minutes)
              </Label>
              <Input
                id="deep"
                type="number"
                min="1"
                max="60"
                value={settings.deepDuration}
                onChange={(e) => updateSettings({ deepDuration: Number.parseInt(e.target.value) || 50 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="focus">
                Focus (minutes)
              </Label>
              <Input
                id="focus"
                type="number"
                min="1"
                max="30"
                value={settings.focusDuration}
                onChange={(e) => updateSettings({ focusDuration: Number.parseInt(e.target.value) || 25 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="quick">
                Quick Break (minutes)
              </Label>
              <Input
                id="quick"
                type="number"
                min="1"
                max="60"
                value={settings.quickDuration}
                onChange={(e) => updateSettings({ quickDuration: Number.parseInt(e.target.value) || 5 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-body-lg font-semibold text-theme-task-text">Preferences</h3>

            <div className="flex items-center justify-between">
              <Label className="text-theme-text-secondary" htmlFor="autoStart">
                Auto-start breaks
              </Label>
              <Switch
                id="autoStart"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-theme-text-secondary" htmlFor="notifications">
                Browser notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-theme-text-secondary" htmlFor="sounds">
                Sound alerts
              </Label>
              <Switch
                id="sounds"
                checked={settings.soundAlerts}
                onCheckedChange={(checked) => updateSettings({ soundAlerts: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-theme-text-secondary" htmlFor="enhancedVisualization">
                Enhanced Focus Ring
              </Label>
              <Switch
                id="enhancedVisualization"
                checked={settings.enhancedVisualization}
                onCheckedChange={(checked) => updateSettings({ enhancedVisualization: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className="text-theme-text-secondary">
                Theme
              </Label>
              <Button
                onClick={toggleTheme}
                variant="outline"
                size="sm"
                className="border-theme-input-border text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40 bg-transparent"
              >
                {mounted && (theme === 'dark' ? (
                  <Sun className="w-4 h-4 mr-2" />
                ) : (
                  <Moon className="w-4 h-4 mr-2" />
                ))}
                {mounted ? (theme === 'dark' ? 'Light' : 'Dark') : 'Theme'}
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={resetSettings}
              variant="outline"
              className="flex-1 border-theme-input-border text-theme-text-secondary hover:text-theme-text-primary hover:bg-theme-card-bg/40 bg-transparent"
            >
              Reset to Default
            </Button>
            <Button onClick={onClose} className="flex-1 bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary">
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
