"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Plus, Trash2, GripVertical, Pencil } from "lucide-react"
import { useTodos, taskTagConfig, type TaskTag, type Todo } from "@/hooks/use-todos"
import { useState, useRef, useCallback } from "react"

type DragState = {
  draggedId: string | null
  overId: string | null
}

export function TodoList() {
  const { todos, addTodo, toggleTodo, deleteTodo, clearCompletedTodos, reorderTodos, updateTodoText, updateTodoTag } = useTodos()
  const [newTask, setNewTask] = useState("")
  const [selectedTag, setSelectedTag] = useState<TaskTag>("focus")
  const [drag, setDrag] = useState<DragState>({ draggedId: null, overId: null })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string>("")
  const [editingTag, setEditingTag] = useState<TaskTag>("focus")

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
      // Map unsupported UI values to supported tags:
      // - "break" (5m) -> "quick"
      // - "custom" removed (no longer selectable)
      const normalizedTag = (selectedTag as any) === "break" ? "quick" : selectedTag
      console.log("[TodoList] handleAddTask", { text: newTask.trim(), selectedTag, normalizedTag })
      addTodo(newTask.trim(), normalizedTag as TaskTag)
      setNewTask("")
      setSelectedTag("focus")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAddTask()
    }
  }

  const onDragStart = useCallback((id: string, e: React.DragEvent) => {
    setDrag({ draggedId: id, overId: null })
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", id)
  }, [])

  const onDragEnter = useCallback((id: string) => {
    setDrag((d) => ({ ...d, overId: id }))
  }, [])

  const onDragEnd = useCallback(() => {
    setDrag({ draggedId: null, overId: null })
  }, [])

  const onDropOnItem = useCallback((targetId: string, e: React.DragEvent) => {
    e.preventDefault()
    const sourceId = e.dataTransfer.getData("text/plain") || drag.draggedId
    if (!sourceId || sourceId === targetId) {
      onDragEnd()
      return
    }
    reorderTodos(sourceId, targetId)
    onDragEnd()
  }, [drag.draggedId, onDragEnd, reorderTodos])

  const draggableItemClasses = (id: string, base: string) =>
    `${base} ${drag.overId === id ? "ring-2 ring-theme-accent/60" : ""}`

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
    setEditingTag(todo.tag)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditingText("")
  }

  const saveEditing = () => {
    if (!editingId) return
    const trimmed = editingText.trim()
    if (trimmed.length === 0) {
      // If text becomes empty, do not save; simply cancel
      cancelEditing()
      return
    }
    updateTodoText(editingId, trimmed)
    if (editingTag) {
      updateTodoTag(editingId, editingTag)
    }
    cancelEditing()
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

      {/* Add Task Composer (Single-row, responsive) */}
      <div className="mb-4 sm:mb-6">
        <div
          className="w-full flex items-center gap-2 sm:gap-3 bg-theme-input-bg/70 border border-theme-input-border/70 rounded-xl px-2.5 py-2 flex-wrap"
          role="group"
          aria-label="Add new task"
        >
          {/* Task type selector */}
          <div className="flex-shrink-0">
            <ToggleGroup
              type="single"
              value={selectedTag}
              onValueChange={(v) => v && setSelectedTag(v as TaskTag)}
              className="flex flex-row gap-1"
              aria-label="Task type"
            >
              <ToggleGroupItem
                value="focus"
                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-[11px] sm:text-xs rounded-md px-2 py-0.5"
                aria-label="Focus 25 minutes"
              >
                {taskTagConfig["focus"].symbol}&nbsp;25m
              </ToggleGroupItem>

              {"deep" in taskTagConfig ? (
                <ToggleGroupItem
                  value="deep"
                  className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-[11px] sm:text-xs rounded-md px-2 py-0.5"
                  aria-label="Deep Work 50 minutes"
                >
                  {taskTagConfig["deep"].symbol}&nbsp;50m
                </ToggleGroupItem>
              ) : null}

              {/* 5m option maps to "quick" tag */}
              <ToggleGroupItem
                value={"quick" as unknown as TaskTag}
                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-[11px] sm:text-xs rounded-md px-2 py-0.5"
                aria-label="Quick 5 minutes"
              >
                {(taskTagConfig as any)["quick"]?.symbol ?? "⚡"}&nbsp;5m
              </ToggleGroupItem>
            </ToggleGroup>
          </div>

          {/* Input field */}
          <div className="min-w-0 flex-1">
            <label htmlFor="new-task-input" className="sr-only">
              New task
            </label>
            <Input
              id="new-task-input"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddTask()
                }
              }}
              placeholder="What would you like to focus on?"
              className="w-full bg-theme-input-bg border-theme-input-border text-theme-text-primary placeholder:text-slate-400 rounded-lg text-sm sm:text-base h-9 sm:h-10 px-3"
              aria-label="Task description"
            />
          </div>

          {/* Add button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleAddTask}
              aria-label="Add task"
              className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary rounded-md px-2.5 sm:px-3 h-9 sm:h-10"
            >
              <Plus className="w-4 h-4" />
              <span className="sr-only">Add</span>
            </Button>
          </div>
        </div>
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
                  const tagConfig = (taskTagConfig as any)[todo.tag]
                  if (!tagConfig) {
                    console.warn("[TodoList] Missing tag config for todo", { id: todo.id, tag: todo.tag, text: todo.text })
                  }

                  return (
                    <div
                      key={todo.id}
                      draggable
                      onDragStart={(e) => onDragStart(todo.id, e)}
                      onDragEnter={() => onDragEnter(todo.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDropOnItem(todo.id, e)}
                      onDragEnd={onDragEnd}
                      className={draggableItemClasses(
                        todo.id,
                        "flex items-center gap-2 p-2 bg-theme-input-bg/50 rounded-lg hover:bg-theme-card-bg/40 transition-colors group cursor-grab active:cursor-grabbing"
                      )}
                    >
                      <div className="text-theme-text-muted opacity-60 group-hover:opacity-100 flex items-center">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-theme-input-border data-[state=checked]:bg-theme-progress data-[state=checked]:border-theme-progress"
                      />

                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Input
                              autoFocus
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditing()
                                if (e.key === "Escape") cancelEditing()
                              }}
                              className="flex-1 bg-theme-input-bg border-theme-input-border text-theme-text-primary rounded-xl text-sm p-2"
                            />
                            {/* Segmented control while editing */}
                            <ToggleGroup
                              type="single"
                              value={editingTag}
                              onValueChange={(v) => v && setEditingTag(v as TaskTag)}
                              className="bg-theme-input-bg border border-theme-input-border rounded-xl p-1"
                            >
                              <ToggleGroupItem
                                value="focus"
                                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                              >
                                {taskTagConfig["focus"].symbol}&nbsp;25m
                              </ToggleGroupItem>
                              {"deep" in taskTagConfig ? (
                                <ToggleGroupItem
                                  value="deep"
                                  className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                                >
                                  {taskTagConfig["deep"].symbol}&nbsp;50m
                                </ToggleGroupItem>
                              ) : null}
                              {/* 5m option maps to "quick" tag */}
                              <ToggleGroupItem
                                value={"quick" as unknown as TaskTag}
                                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                              >
                                {(taskTagConfig as any)["quick"]?.symbol ?? "⚡"}&nbsp;5m
                              </ToggleGroupItem>
                            </ToggleGroup>
                            <div className="flex gap-2">
                              <Button onClick={saveEditing} size="sm" className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary rounded-xl px-3">
                                Save
                              </Button>
                              <Button onClick={cancelEditing} size="sm" variant="ghost" className="text-theme-text-muted">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex-1 transition-all text-theme-text-primary text-sm break-words">
                              {todo.text}
                            </span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-sm">
                                {(taskTagConfig as any)[todo.tag]?.symbol ?? "🎯"}
                              </span>
                              <span className={`text-xs ${((taskTagConfig as any)[todo.tag]?.textColor ?? "text-theme-text-secondary")} whitespace-nowrap`}>
                                {(taskTagConfig as any)[todo.tag]?.label ?? "Focus"} ({(taskTagConfig as any)[todo.tag]?.duration ?? 25}m)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {editingId === todo.id ? null : (
                          <Button
                            onClick={() => startEditing(todo)}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-theme-text-primary transition-all p-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
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
                  const tagConfig = (taskTagConfig as any)[todo.tag]
                  if (!tagConfig) {
                    console.warn("[TodoList] Missing tag config (completed) for todo", { id: todo.id, tag: todo.tag, text: todo.text })
                  }

                  return (
                    <div
                      key={todo.id}
                      draggable
                      onDragStart={(e) => onDragStart(todo.id, e)}
                      onDragEnter={() => onDragEnter(todo.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDropOnItem(todo.id, e)}
                      onDragEnd={onDragEnd}
                      className={draggableItemClasses(
                        todo.id,
                        "flex items-center gap-2 p-2 bg-theme-input-bg/30 rounded-lg hover:bg-theme-card-bg/30 transition-colors group cursor-grab active:cursor-grabbing"
                      )}
                    >
                      <div className="text-theme-text-muted opacity-60 group-hover:opacity-100 flex items-center">
                        <GripVertical className="w-4 h-4" />
                      </div>

                      <Checkbox
                        checked={todo.completed}
                        onCheckedChange={() => toggleTodo(todo.id)}
                        className="border-theme-input-border data-[state=checked]:bg-theme-progress data-[state=checked]:border-theme-progress"
                      />

                      <div className="flex-1 min-w-0">
                        {editingId === todo.id ? (
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                            <Input
                              autoFocus
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEditing()
                                if (e.key === "Escape") cancelEditing()
                              }}
                              className="flex-1 bg-theme-input-bg border-theme-input-border text-theme-text-primary rounded-xl text-sm p-2"
                            />
                            {/* Segmented control while editing (keep available to change tag) */}
                            <ToggleGroup
                              type="single"
                              value={editingTag}
                              onValueChange={(v) => v && setEditingTag(v as TaskTag)}
                              className="bg-theme-input-bg border border-theme-input-border rounded-xl p-1"
                            >
                              <ToggleGroupItem
                                value="focus"
                                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                              >
                                {taskTagConfig["focus"].symbol}&nbsp;25m
                              </ToggleGroupItem>
                              {"deep" in taskTagConfig ? (
                                <ToggleGroupItem
                                  value="deep"
                                  className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                                >
                                  {taskTagConfig["deep"].symbol}&nbsp;50m
                                </ToggleGroupItem>
                              ) : null}
                              {/* 5m option maps to "quick" tag */}
                              <ToggleGroupItem
                                value={"quick" as unknown as TaskTag}
                                className="data-[state=on]:bg-theme-accent/20 data-[state=on]:text-theme-text-primary text-xs rounded-lg px-2 py-1"
                              >
                                {(taskTagConfig as any)["quick"]?.symbol ?? "⚡"}&nbsp;5m
                              </ToggleGroupItem>
                            </ToggleGroup>
                            <div className="flex gap-2">
                              <Button onClick={saveEditing} size="sm" className="bg-theme-accent hover:bg-theme-accent-hover text-theme-text-primary rounded-xl px-3">
                                Save
                              </Button>
                              <Button onClick={cancelEditing} size="sm" variant="ghost" className="text-theme-text-muted">
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="flex-1 transition-all text-theme-text-muted line-through text-sm break-words">
                              {todo.text}
                            </span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              <span className="text-sm">
                                {(taskTagConfig as any)[todo.tag]?.symbol ?? "🎯"}
                              </span>
                              <span className={`text-xs ${((taskTagConfig as any)[todo.tag]?.textColor ?? "text-theme-text-secondary")} opacity-70 whitespace-nowrap`}>
                                {((taskTagConfig as any)[todo.tag]?.label ?? "Focus")} ({((taskTagConfig as any)[todo.tag]?.duration ?? 25)}m)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {editingId === todo.id ? null : (
                          <Button
                            onClick={() => startEditing(todo)}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-theme-text-primary transition-all p-1"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        )}
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
