"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Play, Clock, Square } from "lucide-react"
import { useTodos, taskTagConfig, type TaskTag, type Todo } from "@/hooks/use-todos"
import { useState } from "react"
import { useTheme } from "@/hooks/use-theme"
import { usePomodoro } from "@/hooks/use-pomodoro"

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo } = useTodos()
  const { startTaskTimer, stopTaskTimer, currentTask, isRunning, currentMode } = usePomodoro()
  const [newTask, setNewTask] = useState("")
  const [selectedTag, setSelectedTag] = useState<TaskTag>("focus")
  const { theme } = useTheme()

  const getProgress = () => {
    if (todos.length === 0) return 0
    const completed = todos.filter((todo) => todo.completed).length
    return (completed / todos.length) * 100
  }

  const progress = getProgress()

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTodo(newTask.trim(), selectedTag)
      setNewTask("")
      setSelectedTag("focus")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const handleStartTask = (todo: Todo) => {
    startTaskTimer(todo)
  }

  const handleStopTask = () => {
    stopTaskTimer()
  }

  return (
    <div className={`${theme.cardBg} backdrop-blur-sm border ${theme.cardBorder} rounded-2xl p-8 shadow-2xl`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className={`text-2xl font-bold ${theme.textPrimary}`}>To Do</h2>
        <span className="text-green-400 font-semibold">{Math.round(progress)}%</span>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className={`w-full ${theme.progressBg} rounded-full h-2`}>
          <div
            className={`${theme.progress} h-2 rounded-full transition-all duration-300`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add Task Input */}
      <div className="space-y-3 mb-6">
        <div className="flex gap-3">
          <Input
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add new task..."
            className={`flex-1 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} placeholder-${theme.textMuted} rounded-xl`}
          />
          <Button
            onClick={handleAddTask}
            className={`${theme.accent} ${theme.accentHover} ${theme.textPrimary} rounded-xl px-4`}
          >
            <Plus className="w-5 h-5" />
          </Button>
        </div>

        {/* Tag Selection */}
        <div className="flex items-center gap-3">
          <span className={`text-sm ${theme.textSecondary}`}>Tag:</span>
          <Select value={selectedTag} onValueChange={(value: TaskTag) => setSelectedTag(value)}>
            <SelectTrigger className={`w-32 ${theme.inputBg} ${theme.inputBorder} ${theme.textPrimary} rounded-lg`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent className={`${theme.cardBg} ${theme.cardBorder} ${theme.textPrimary}`}>
              {Object.entries(taskTagConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className={`hover:${theme.cardHover}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${config.color}`} />
                    <span>{config.label}</span>
                    <span className={`text-xs ${theme.textMuted}`}>({config.duration}min)</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Task Counter */}
      <div className="text-gray-300 mb-6">
        <span className={`${theme.textPrimary} font-semibold`}>
          {todos.filter((t) => t.completed).length}/{todos.length}
        </span>
        <span className={`ml-2 ${theme.textSecondary}`}>completed</span>
      </div>

      {/* Task List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className={`text-center ${theme.textMuted} py-8`}>No tasks yet. Add one above!</div>
        ) : (
          todos.map((todo) => {
            const tagConfig = taskTagConfig[todo.tag]
            const isCurrentTask = currentTask?.id === todo.id
            const isActiveTask = isCurrentTask && currentMode === "task"

            return (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-3 ${theme.inputBg} rounded-xl hover:bg-gray-900/50 transition-colors group ${
                  isActiveTask ? "ring-2 ring-green-500/50 bg-green-500/10" : ""
                }`}
              >
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="border-gray-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`flex-1 transition-all ${
                        todo.completed ? theme.textMuted + " line-through" : theme.textPrimary
                      }`}
                    >
                      {todo.text}
                    </span>
                    {isActiveTask && isRunning && (
                      <div className="flex items-center gap-1 text-green-400">
                        <Clock className="w-3 h-3 animate-pulse" />
                        <span className="text-xs font-medium">Active</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${tagConfig.color}`} />
                    <span className={`text-xs ${tagConfig.textColor}`}>
                      {tagConfig.label} ({tagConfig.duration}min)
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!todo.completed && (
                    <>
                      {isActiveTask ? (
                        <Button
                          onClick={handleStopTask}
                          variant="ghost"
                          size="sm"
                          className={`opacity-100 text-red-400 hover:text-red-300 transition-all`}
                          title="Stop task timer"
                        >
                          <Square className="w-4 h-4" />
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleStartTask(todo)}
                          variant="ghost"
                          size="sm"
                          className={`opacity-0 group-hover:opacity-100 ${theme.textMuted} hover:text-green-400 transition-all`}
                          title={`Start ${taskTagConfig[todo.tag].label} timer (${taskTagConfig[todo.tag].duration}min)`}
                        >
                          <Play className="w-4 h-4" />
                        </Button>
                      )}
                    </>
                  )}
                  <Button
                    onClick={() => deleteTodo(todo.id)}
                    variant="ghost"
                    size="sm"
                    className={`opacity-0 group-hover:opacity-100 ${theme.textMuted} hover:text-red-400 transition-all`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
