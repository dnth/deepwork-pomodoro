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
  quick: { label: "Quick", duration: 10, color: "bg-blue-500", textColor: "text-blue-400", symbol: "⚡" },
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

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodoTag,
    getProgress,
  }
}
