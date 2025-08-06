"use client"

import { useCallback } from "react"
import { useLocalStorage } from "./use-local-storage"

export type TaskTag = "quick" | "focus" | "deep"

export interface Todo {
  id: string
  text: string
  completed: boolean
  createdAt: Date
  tag: TaskTag
}

export const taskTagConfig = {
  quick: { label: "Quick", duration: 5, color: "bg-blue-500", textColor: "text-blue-400", symbol: "⚡" },
  focus: { label: "Focus", duration: 25, color: "bg-green-500", textColor: "text-green-400", symbol: "🎯" },
  deep: { label: "Deep", duration: 50, color: "bg-purple-500", textColor: "text-purple-400", symbol: "🧠" },
}

export function useTodos() {
  const [todos, setTodos] = useLocalStorage<Todo[]>("pomodoro-todos", [])

  const addTodo = useCallback(
    (text: string, tag: TaskTag = "focus") => {
      const newTodo: Todo = {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: new Date(),
        tag,
      }
      setTodos((prev) => [newTodo, ...prev])
    },
    [setTodos],
  )

  const toggleTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
    },
    [setTodos],
  )

  const updateTodoText = useCallback(
    (id: string, text: string) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, text } : todo)))
    },
    [setTodos],
  )

  const deleteTodo = useCallback(
    (id: string) => {
      setTodos((prev) => prev.filter((todo) => todo.id !== id))
    },
    [setTodos],
  )

  const updateTodoTag = useCallback(
    (id: string, tag: TaskTag) => {
      setTodos((prev) => prev.map((todo) => (todo.id === id ? { ...todo, tag } : todo)))
    },
    [setTodos],
  )

  const getProgress = useCallback(() => {
    if (todos.length === 0) return 0
    const completed = todos.filter((todo) => todo.completed).length
    return (completed / todos.length) * 100
  }, [todos])

  const clearCompletedTodos = useCallback(() => {
    setTodos((prev) => prev.filter((todo) => !todo.completed))
  }, [setTodos])

  // Reorder within the same section (incomplete with incomplete, completed with completed)
  const reorderTodos = useCallback((sourceId: string, targetId: string) => {
    setTodos((prev) => {
      const sourceIndex = prev.findIndex((t) => t.id === sourceId)
      const targetIndex = prev.findIndex((t) => t.id === targetId)
      if (sourceIndex === -1 || targetIndex === -1) return prev

      const source = prev[sourceIndex]
      const target = prev[targetIndex]

      // Only allow reordering within same completion group to keep sections intact
      if (source.completed !== target.completed) return prev

      const next = [...prev]
      // Remove source
      next.splice(sourceIndex, 1)
      // Find new index of target after removal adjustment
      const adjustedTargetIndex = next.findIndex((t) => t.id === targetId)
      // Insert before target
      next.splice(adjustedTargetIndex, 0, source)
      return next
    })
  }, [setTodos])

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoTag,
    updateTodoText,
    getProgress,
    clearCompletedTodos,
    reorderTodos,
  }
}
