"use client"

import React, { useEffect, useRef } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Plus, Trash2, GripVertical, Pencil } from "lucide-react"
import { useTodos, taskTagConfig, type TaskTag, type Todo } from "@/hooks/use-todos"
import { useState, useCallback } from "react"


const ACCENT_COLOR = 'hsl(var(--theme-accent))'

const TASK_TYPE_ORDER = ["deep", "focus", "quick"] as const
const TASK_TYPE_PRIORITY: Record<string, number> = { deep: 0, focus: 1, quick: 2 }
function compareTaskTags(a: string, b: string) {
  return (TASK_TYPE_PRIORITY[a] ?? 999) - (TASK_TYPE_PRIORITY[b] ?? 999)
}

type DragState = {
  draggedId: string | null
  overId: string | null
}

const isValidUrl = (string: string): boolean => {
  try {
    const url = new URL(string);
    // Must have a valid hostname with at least one dot or be localhost
    return url.hostname.length > 0 && (url.hostname.includes('.') || url.hostname === 'localhost');
  } catch (_) {
    // Check for URLs without protocol
    try {
      const url = new URL(`http://${string}`);
      // Must have a valid hostname with at least one dot or be localhost
      return url.hostname.length > 0 && (url.hostname.includes('.') || url.hostname === 'localhost');
    } catch (_) {
      return false;
    }
  }
};

const ClickableText: React.FC<{ text: string }> = ({ text }) => {
  if (isValidUrl(text)) {
    const url = text.startsWith('http') ? text : `http://${text}`;
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-theme-accent hover:underline break-words cursor-pointer"
      >
        {text}
      </a>
    );
  }
  return <span className="break-words cursor-text">{text}</span>;
};

const TodoItem: React.FC<{
  todo: Todo;
  isCompleted: boolean;
  editingId: string | null;
  editingText: string;
  editingTag: TaskTag;
  onStartEditing: (todo: Todo) => void;
  onSaveEditing: () => void;
  onCancelEditing: () => void;
  onSetEditingText: (text: string) => void;
  onSetEditingTag: (tag: TaskTag) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onDragStart: (id: string, e: React.DragEvent) => void;
  onDragEnter: (id: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (id: string, e: React.DragEvent) => void;
  onDragEnd: () => void;
  dragOverId: string | null;
}> = ({
  todo,
  isCompleted,
  editingId,
  editingText,
  editingTag,
  onStartEditing,
  onSaveEditing,
  onCancelEditing,
  onSetEditingText,
  onSetEditingTag,
  onToggle,
  onDelete,
  onDragStart,
  onDragEnter,
  onDragOver,
  onDrop,
  onDragEnd,
  dragOverId,
}) => {
  const tagConfig = taskTagConfig[todo.tag];
  const baseClasses = isCompleted
    ? "flex items-center gap-2 p-2 bg-theme-input-bg/30 rounded-lg hover:bg-theme-card-bg/30 transition-colors group"
    : "flex items-center gap-3 p-3 bg-theme-input-bg/50 rounded-lg hover:bg-theme-card-bg/40 transition-colors group";
  const draggableClasses = `${baseClasses} ${dragOverId === todo.id ? "ring-2 ring-theme-accent/60" : ""}`;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(todo.id, e)}
      onDragEnter={() => onDragEnter(todo.id)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => onDrop(todo.id, e)}
      onDragEnd={onDragEnd}
      className={draggableClasses}
    >
      <div className="text-theme-text-muted opacity-60 group-hover:opacity-100 flex items-center">
        <GripVertical className="w-4 h-4" />
      </div>

      <Checkbox
        checked={todo.completed}
        onCheckedChange={() => onToggle(todo.id)}
        className="border-theme-input-border data-[state=checked]:bg-theme-progress data-[state=checked]:border-theme-progress"
      />

      <div className="flex-1 min-w-0">
        {editingId === todo.id ? (
          <div
            className="flex items-center gap-2 sm:gap-3 flex-wrap [>*]:shrink-0"
            role="group"
            aria-label="Edit task"
          >
            <Input
              autoFocus
              value={editingText}
              onChange={(e) => onSetEditingText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSaveEditing()
                if (e.key === "Escape") onCancelEditing()
              }}
              className={`min-w-0 flex-1 bg-theme-input-bg border-theme-input-border text-theme-text-primary rounded-${isCompleted ? 'xl' : 'lg'} text-caption p-${isCompleted ? '2' : '3'}`}
            />

            <ToggleGroup
              type="single"
              value={editingTag}
              onValueChange={(v) => v && onSetEditingTag(v as TaskTag)}
              className={`bg-theme-input-bg border border-theme-input-border rounded-${isCompleted ? 'xl' : 'lg'} p-1`}
              aria-label="Task type"
            >
              {"deep" in taskTagConfig ? (
                <ToggleGroupItem
                  value="deep"
                  className="data-[state=on]:text-theme-text-primary text-label rounded-lg px-2 py-1"
                  style={editingTag === 'deep' ? { backgroundColor: ACCENT_COLOR } : undefined}
                  aria-label="Deep Work 50 minutes"
                >
                  {taskTagConfig.deep.symbol}&nbsp;50m
                </ToggleGroupItem>
              ) : null}
              <ToggleGroupItem
                value="focus"
                className="data-[state=on]:text-theme-text-primary text-label rounded-lg px-2 py-1"
                style={editingTag === 'focus' ? { backgroundColor: ACCENT_COLOR } : undefined}
                aria-label="Focus 25 minutes"
              >
                {taskTagConfig.focus.symbol}&nbsp;25m
              </ToggleGroupItem>
              <ToggleGroupItem
                value="quick"
                className="data-[state=on]:text-theme-text-primary text-label rounded-lg px-2 py-1"
                style={editingTag === 'quick' ? { backgroundColor: ACCENT_COLOR } : undefined}
                aria-label="Quick 5 minutes"
              >
                {taskTagConfig.quick.symbol}&nbsp;5m
              </ToggleGroupItem>
            </ToggleGroup>

            <div className="flex items-center gap-2 sm:gap-2">
              <Button
                onClick={onSaveEditing}
                size="sm"
                className="text-theme-text-primary rounded-lg px-3"
                style={{ backgroundColor: ACCENT_COLOR }}
              >
                Save
              </Button>
              <Button
                onClick={onCancelEditing}
                size="sm"
                variant="ghost"
                className="text-theme-text-muted"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <span className={`flex-1 transition-all ${isCompleted ? 'text-theme-text-muted line-through' : 'text-theme-text-primary'} text-sm break-words`}>
            <ClickableText text={todo.text} />
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {editingId === todo.id ? null : (
          <Button
            onClick={() => onStartEditing(todo)}
            variant="ghost"
            size="sm"
            className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-theme-text-primary transition-all p-1"
          >
            <Pencil className="w-4 h-4" />
          </Button>
        )}
        <Button
          onClick={() => onDelete(todo.id)}
          variant="ghost"
          size="sm"
          className="opacity-0 group-hover:opacity-100 text-theme-text-muted hover:text-red-400 transition-all p-1"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
        <div className="flex items-center gap-1 min-w-0 flex-shrink pl-2 mr-2">
          <span className="text-xs">
            {tagConfig?.symbol ?? "🎯"}
          </span>
          <span className={`text-xs ${tagConfig?.textColor ?? "text-theme-text-secondary"} ${isCompleted ? 'opacity-70' : ''} whitespace-nowrap`}>
            {tagConfig?.label ?? "Focus"} ({tagConfig?.duration ?? 25}m)
          </span>
        </div>
      </div>
    </div>
  );
};

export function TodoList() {
  const {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
    reorderTodos,
    updateTodoText,
    updateTodoTag,
    // consume persisted selection from hook
    selectedTag,
    setSelectedTag,
  } = useTodos()
  const [newTask, setNewTask] = useState("")
  // remove local selectedTag state; use the hook's persisted value instead
  const [drag, setDrag] = useState<DragState>({ draggedId: null, overId: null })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState<string>("")
  const [editingTag, setEditingTag] = useState<TaskTag>("focus")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isShortcutAnimating, setIsShortcutAnimating] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const taskTypeSelectorRef = useRef<HTMLDivElement>(null)
  const [indicatorStyle, setIndicatorStyle] = useState<{ left: string; width: string }>({ left: '0px', width: '0px' })

  const getProgress = () => {
    if (todos.length === 0) return 0
    const completed = todos.filter((todo) => todo.completed).length
    return (completed / todos.length) * 100
  }

  const progress = getProgress()
  
  // Separate completed and incomplete tasks
  const completedTasks = todos.filter((todo) => todo.completed)
  const incompleteTasks = todos.filter((todo) => !todo.completed)

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
    return () => {
      setIsMounted(false);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Try different ways to detect the key combination
      if (e.ctrlKey && e.shiftKey) {
        if (e.key === '1' || e.code === 'Digit1') {
          e.preventDefault()
          setSelectedTag('deep')
          triggerShortcutAnimation()
        } else if (e.key === '2' || e.code === 'Digit2') {
          e.preventDefault()
          setSelectedTag('focus')
          triggerShortcutAnimation()
        } else if (e.key === '3' || e.code === 'Digit3') {
          e.preventDefault()
          setSelectedTag('quick')
          triggerShortcutAnimation()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown, true); // Use capture phase
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
    }
  }, [setSelectedTag, isMounted])

  // Update sliding indicator position when selectedTag changes
  useEffect(() => {
    if (!taskTypeSelectorRef.current) return
    
    const container = taskTypeSelectorRef.current
    const activeButton = container.querySelector(`[data-state="on"]`) as HTMLElement
    
    if (activeButton) {
      const containerRect = container.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      const left = buttonRect.left - containerRect.left
      const width = buttonRect.width
      
      setIndicatorStyle({
        left: `${left}px`,
        width: `${width}px`
      })
    }
  }, [selectedTag, isMounted])

  const triggerAnimation = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 300) // Match CSS animation duration
  }

  const triggerShortcutAnimation = useCallback(() => {
    setIsShortcutAnimating(true)
    setTimeout(() => setIsShortcutAnimating(false), 600) // Match CSS animation duration
  }, [])

  const handleAddTask = () => {
    if (newTask.trim()) {
      addTodo(newTask.trim(), selectedTag)
      setNewTask("")
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
    <div className="w-full card-premium-glass rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base sm:text-lg lg:text-xl font-bold text-theme-text-primary">To Do</h2>
        <div className="flex items-center gap-3">
          <div className="text-theme-text-secondary">
            <span className="text-theme-text-primary font-semibold text-base sm:text-lg">
              {todos.filter((t) => t.completed).length}/{todos.length}
            </span>
            <span className="ml-1 text-theme-text-secondary text-xs sm:text-sm">completed</span>
          </div>
          <span className="text-theme-task-text font-semibold text-base sm:text-lg">{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-theme-progress-bg rounded-full h-2">
          <div
            className="bg-theme-progress h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Add Task Composer (Single-row, responsive) */}
      <div className="mb-6">
        <div
          className="w-full flex items-center gap-3 bg-theme-input-bg/70 border border-theme-input-border/70 rounded-lg px-3 py-2 flex-wrap"
          role="group"
          aria-label="Add new task"
        >
          {/* Task type selector */}
          <div
            ref={taskTypeSelectorRef}
            className="flex-shrink-0 relative"
          >
            {/* Sliding indicator */}
            <div
              className={`absolute top-0 rounded-md transition-all duration-300 ease-in-out z-0 shadow-lg ${
                isShortcutAnimating ? 'animate-slide-indicator animate-pulse-indicator' : ''
              }`}
              style={{
                backgroundColor: ACCENT_COLOR,
                left: indicatorStyle.left,
                width: indicatorStyle.width,
                height: '100%'
              }}
            />
            <ToggleGroup
              type="single"
              value={selectedTag}
              onValueChange={(v) => v && setSelectedTag(v as TaskTag)}
              className="flex flex-row gap-1 relative z-10"
              aria-label="Task type"
            >
              {"deep" in taskTagConfig ? (
                <ToggleGroupItem
                  value="deep"
                  className="data-[state=on]:text-theme-text-primary text-caption rounded-md px-2 py-1 relative z-10"
                  style={selectedTag === 'deep' ? { backgroundColor: ACCENT_COLOR } : undefined}
                  aria-label="Deep Work 50 minutes"
                >
                  {taskTagConfig["deep"].symbol}&nbsp;50m
                </ToggleGroupItem>
              ) : null}

              <ToggleGroupItem
                value="focus"
                className="data-[state=on]:text-theme-text-primary text-caption rounded-md px-2 py-1 relative z-10"
                style={selectedTag === 'focus' ? { backgroundColor: ACCENT_COLOR } : undefined}
                aria-label="Focus 25 minutes"
              >
                {taskTagConfig["focus"].symbol}&nbsp;25m
              </ToggleGroupItem>

              <ToggleGroupItem
                value="quick"
                className="data-[state=on]:text-theme-text-primary text-caption rounded-md px-2 py-1 relative z-10"
                style={selectedTag === 'quick' ? { backgroundColor: ACCENT_COLOR } : undefined}
                aria-label="Quick 5 minutes"
              >
                {taskTagConfig.quick.symbol}&nbsp;5m
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
              className="w-full bg-theme-input-bg border-theme-input-border text-theme-text-primary placeholder:text-slate-400 rounded-md h-10 px-3"
              aria-label="Task description"
            />
          </div>

          {/* Add button */}
          <div className="flex-shrink-0">
            <Button
              onClick={handleAddTask}
              aria-label="Add task"
              className="text-theme-text-primary rounded-md px-3 h-10"
              style={{ backgroundColor: ACCENT_COLOR }}
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
                <h3 className="text-xs font-medium text-theme-text-secondary flex items-center gap-2">
                  📋 To Do ({incompleteTasks.length})
                </h3>
                {incompleteTasks.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    isCompleted={false}
                    editingId={editingId}
                    editingText={editingText}
                    editingTag={editingTag}
                    onStartEditing={startEditing}
                    onSaveEditing={saveEditing}
                    onCancelEditing={cancelEditing}
                    onSetEditingText={setEditingText}
                    onSetEditingTag={setEditingTag}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDropOnItem}
                    onDragEnd={onDragEnd}
                    dragOverId={drag.overId}
                  />
                ))}
              </div>
            )}

            {/* Completed Tasks Section */}
            {completedTasks.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-medium text-theme-text-secondary flex items-center gap-2">
                    ✅ Completed ({completedTasks.length})
                  </h3>
                  <Button
                    onClick={clearCompletedTodos}
                    variant="ghost"
                    size="sm"
                    className="text-theme-text-muted hover:text-red-400 transition-all text-label"
                  >
                    Clear All
                  </Button>
                </div>
                {completedTasks.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    isCompleted={true}
                    editingId={editingId}
                    editingText={editingText}
                    editingTag={editingTag}
                    onStartEditing={startEditing}
                    onSaveEditing={saveEditing}
                    onCancelEditing={cancelEditing}
                    onSetEditingText={setEditingText}
                    onSetEditingTag={setEditingTag}
                    onToggle={toggleTodo}
                    onDelete={deleteTodo}
                    onDragStart={onDragStart}
                    onDragEnter={onDragEnter}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={onDropOnItem}
                    onDragEnd={onDragEnd}
                    dragOverId={drag.overId}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <div className="divider-gradient-secondary"></div>
    </div>
  )
}
