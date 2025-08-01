"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"
import { useTodos, taskTagConfig, type TaskTag, type Todo } from "@/hooks/use-todos"
import { useState } from "react"
export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompletedTodos } = useTodos()
  const [newTask, setNewTask] = useState("")
  const [selectedTag, setSelectedTag] = useState<TaskTag>("focus")

  const getProgress = () => {
    if (todos.length === 0) return 0
    const completed = todos.filter((todo) => todo.completed).length
    return (completed / todos.length) * 100
  }

  const progress = getProgress()
  
  // Separate completed and incomplete tasks
  const completedTasks = todos.filter((todo) => todo.completed)
  const incompleteTasks = todos.filter((todo) => !todo.completed)

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


  return (
    <div className="w-full bg-theme-card-bg/30 backdrop-blur-sm border border-theme-card-border/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-theme-text-primary">To Do</h2>
        <div className="flex items-center gap-3">
          <div className="text-theme-text-secondary">
            <span className="text-theme-text-primary font-semibold text-sm sm:text-base">
              {todos.filter((t) => t.completed).length}/{todos.length}
            </span>
            <span className="ml-1 text-theme-text-secondary text-xs sm:text-sm">completed</span>
          </div>
          <span className="text-theme-task-text font-semibold text-sm sm:text-base">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4 sm:mb-6">
        <div className="w-full bg-theme-progress-bg rounded-full h-2">
          <div
            className="bg-theme-progress h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add Task Input */}
      <div className="flex gap-2 sm:gap-3 mb-4 sm:mb-6">
        <Input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="What would you like to focus on?"
          className="flex-1 bg-theme-input-bg border-theme-input-border text-theme-text-primary placeholder:text-slate-400 rounded-xl text-sm sm:text-base p-2 sm:p-3"
        />
        <Select value={selectedTag} onValueChange={(value: TaskTag) => setSelectedTag(value)}>
          <SelectTrigger 
              className="w-36 sm:w-44 bg-theme-input-bg border-theme-input-border text-theme-text-primary rounded-xl text-sm p-2 sm:p-3">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-theme-card-bg border-theme-card-border text-theme-text-primary min-w-[12rem]">
            {Object.entries(taskTagConfig).map(([key, config]) => (
              <SelectItem 
                key={key} 
                value={key} 
                className="hover:bg-theme-accent/20 hover:text-theme-text-primary hover:font-medium focus:bg-theme-accent/20 focus:text-theme-text-primary data-[highlighted]:bg-theme-accent/20 data-[highlighted]:text-theme-text-primary p-2 sm:p-3 text-left justify-start"
              >
                {config.symbol}  {config.label} ({config.duration}min)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleAddTask}
          className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary rounded-xl px-3 sm:px-4"
        >
          <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        </Button>
      </div>

      {/* Task Lists */}
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {todos.length === 0 ? (
          <div className="text-center text-theme-text-muted py-8">No tasks yet. Add one above!</div>
        ) : (
          <>
            {/* Incomplete Tasks Section */}
            {incompleteTasks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-theme-text-secondary flex items-center gap-2">
                  📋 To Do ({incompleteTasks.length})
                </h3>
                {incompleteTasks.map((todo) => {
                  const tagConfig = taskTagConfig[todo.tag]

                  return (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 p-2 bg-theme-input-bg/50 rounded-lg hover:bg-theme-card-bg/40 transition-colors group"
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-theme-input-border data-[state=checked]:bg-theme-progress data-[state=checked]:border-theme-progress"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex-1 transition-all text-theme-text-primary text-sm break-words">
                            {todo.text}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-sm">{tagConfig.symbol}</span>
                            <span className={`text-xs ${tagConfig.textColor} whitespace-nowrap`}>
                              {tagConfig.label} ({tagConfig.duration}min)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-400 transition-all p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-theme-text-secondary flex items-center gap-2">
                    ✅ Completed ({completedTasks.length})
                  </h3>
                  <Button
                    onClick={clearCompletedTodos}
                    variant="ghost"
                    size="sm"
                    className="text-theme-text-muted hover:text-red-400 transition-all text-xs"
                  >
                    Clear All
                  </Button>
                </div>
                {completedTasks.map((todo) => {
                  const tagConfig = taskTagConfig[todo.tag]

                  return (
                    <div
                      key={todo.id}
                      className="flex items-center gap-2 p-2 bg-theme-input-bg/30 rounded-lg hover:bg-theme-card-bg/30 transition-colors group"
                    >
                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-theme-input-border data-[state=checked]:bg-theme-progress data-[state=checked]:border-theme-progress"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="flex-1 transition-all text-theme-text-muted line-through text-sm break-words">
                            {todo.text}
                          </span>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <span className="text-sm">{tagConfig.symbol}</span>
                            <span className={`text-xs ${tagConfig.textColor} opacity-70 whitespace-nowrap`}>
                              {tagConfig.label} ({tagConfig.duration}min)
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => deleteTodo(todo.id)}
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-400 transition-all p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
