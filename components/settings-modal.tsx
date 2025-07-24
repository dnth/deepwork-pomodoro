"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-theme-card-bg border-theme-card-border text-theme-text-primary max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-theme-text-primary">Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-theme-task-text">Timer Durations</h3>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="pomodoro">
                Pomodoro (minutes)
              </Label>
              <Input
                id="pomodoro"
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroDuration}
                onChange={(e) => updateSettings({ pomodoroDuration: Number.parseInt(e.target.value) || 25 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="shortBreak">
                Short Break (minutes)
              </Label>
              <Input
                id="shortBreak"
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) => updateSettings({ shortBreakDuration: Number.parseInt(e.target.value) || 5 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-theme-text-secondary" htmlFor="longBreak">
                Long Break (minutes)
              </Label>
              <Input
                id="longBreak"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) => updateSettings({ longBreakDuration: Number.parseInt(e.target.value) || 15 })}
                className="border-theme-input-border text-theme-text-primary"
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-theme-task-text">Preferences</h3>

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
