"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useSettings } from "@/hooks/use-settings"
import { useTheme } from "@/hooks/use-theme"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, resetSettings } = useSettings()
  const { theme, currentTheme } = useTheme()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${theme.cardBg} ${theme.cardBorder} ${theme.textPrimary} max-w-md`}>
        <DialogHeader>
          <DialogTitle className={`text-xl font-bold ${theme.textPrimary}`}>Timer Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Timer Durations */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Timer Durations</h3>

            <div className="space-y-2">
              <Label className={theme.textSecondary} htmlFor="pomodoro">
                Pomodoro (minutes)
              </Label>
              <Input
                id="pomodoro"
                type="number"
                min="1"
                max="60"
                value={settings.pomodoroDuration}
                onChange={(e) => updateSettings({ pomodoroDuration: Number.parseInt(e.target.value) || 25 })}
                style={{backgroundColor: currentTheme === 'forest' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(30, 58, 138, 0.5)'}}
                className={`${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>

            <div className="space-y-2">
              <Label className={theme.textSecondary} htmlFor="shortBreak">
                Short Break (minutes)
              </Label>
              <Input
                id="shortBreak"
                type="number"
                min="1"
                max="30"
                value={settings.shortBreakDuration}
                onChange={(e) => updateSettings({ shortBreakDuration: Number.parseInt(e.target.value) || 5 })}
                style={{backgroundColor: currentTheme === 'forest' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(30, 58, 138, 0.5)'}}
                className={`${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>

            <div className="space-y-2">
              <Label className={theme.textSecondary} htmlFor="longBreak">
                Long Break (minutes)
              </Label>
              <Input
                id="longBreak"
                type="number"
                min="1"
                max="60"
                value={settings.longBreakDuration}
                onChange={(e) => updateSettings({ longBreakDuration: Number.parseInt(e.target.value) || 15 })}
                style={{backgroundColor: currentTheme === 'forest' ? 'rgba(51, 65, 85, 0.5)' : 'rgba(30, 58, 138, 0.5)'}}
                className={`${theme.inputBorder} ${theme.textPrimary}`}
              />
            </div>
          </div>

          {/* Preferences */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400">Preferences</h3>

            <div className="flex items-center justify-between">
              <Label className={theme.textSecondary} htmlFor="autoStart">
                Auto-start breaks
              </Label>
              <Switch
                id="autoStart"
                checked={settings.autoStartBreaks}
                onCheckedChange={(checked) => updateSettings({ autoStartBreaks: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className={theme.textSecondary} htmlFor="notifications">
                Browser notifications
              </Label>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={(checked) => updateSettings({ notifications: checked })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label className={theme.textSecondary} htmlFor="sounds">
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
              className={`flex-1 ${theme.inputBorder} ${theme.textSecondary} hover:${theme.textPrimary} ${theme.cardHover} bg-transparent`}
            >
              Reset to Default
            </Button>
            <Button onClick={onClose} className={`flex-1 ${theme.accent} ${theme.accentHover} ${theme.textPrimary}`}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
