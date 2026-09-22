import type { ApiResponse } from "../types/api"
import type { Note, CreateNoteRequest, UpdateNoteRequest } from "../types/note"

const API_BASE_URL = "/api"

export async function getNotes(query = ""): Promise<Note[]> {
  const params = new URLSearchParams()

  if (query.trim()) {
    params.set("q", query.trim())
  }

  const url = params.size
    ? `${API_BASE_URL}/notes?${params.toString()}`
    : `${API_BASE_URL}/notes`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error("failed to fetch notes")
  }

  const result: ApiResponse<Note[]> = await response.json()

  return result.data
}

export async function createNote(data: CreateNoteRequest) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("failed to create note")
  }

  const result: ApiResponse<Note> = await response.json()

  return result.data
}

export async function updateNote(
  id: number,
  data: UpdateNoteRequest,
): Promise<Note> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("failed to update note")
  }

  const result: ApiResponse<Note> = await response.json()

  return result.data
}

export async function deleteNote(id: number): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error("failed to delete note")
  }
}
