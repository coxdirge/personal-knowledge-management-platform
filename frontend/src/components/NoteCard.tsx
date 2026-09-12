import {
  useState,
} from "react"

import type {
  SubmitEventHandler
} from "react"

import type {
  MouseEvent
} from "react"

import type {
  Note
} from "../types/note"

import {
  updateNote,
  deleteNote,
} from "../api/notes"

interface Props {
  note: Note
  onUpdated: () => void
  onDeleted: () => void
  selected: boolean
  distance: number
  onSelect: () => void
}

export default function NoteCard({
  note,
  onUpdated,
  onDeleted,
  selected,
  distance,
  onSelect,
}: Props) {

  const [draftNote, setDraftNote] = useState<Note | null>(null)

  const [saving, setSaving] = useState(false)

  const [deleting, setDeleting] = useState(false)

  const [error, setError] = useState<string | null>(null)

  const [rotation, setRotation] = useState({
    x: 0,
    y: 0,
  })

  const scale = selected
    ? 1.03
    : Math.max(0.82, 0.96 - Math.abs(distance) * 0.06)

  const translateY = selected
    ? -10
    : 0

  const handleSubmit:
    SubmitEventHandler<HTMLFormElement> =
    async (event) => {

      event.preventDefault()

      if (draftNote === null) {
        return
      }

      try {

        setSaving(true)
        setError(null)

        await updateNote(
          note.id,
          {
            title: draftNote.title,
            content: draftNote.content,
          }
        )

        onUpdated()

        setDraftNote(null)

      } catch {

        setError(
          "Failed to update note"
        )

      } finally {

        setSaving(false)

      }
    }

  const handleDelete = async () => {
    try {

      setDeleting(true)
      setError(null)

      await deleteNote(note.id)

      onDeleted()

    } catch {

      setError(
        "Failed to delete note"
      )

    } finally {

      setDeleting(false)

    }
  }

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {

    if (draftNote !== null) {
      return
    }

    const rect =
      event.currentTarget.getBoundingClientRect()

    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotateX = (centerY - y) / centerY * 8
    const rotateY = (x - centerX) / centerX * 8

    setRotation({
      x: rotateX, y: rotateY
    })
  }

  const handleMouseLeave = () => {

    setRotation({
      x: 0, y: 0
    })

  }

  const handleEdit = (
    event: MouseEvent<HTMLButtonElement>
  ) => {

    event.stopPropagation()

    setDraftNote({
      ...note,
    })
  }

  const isEditing = draftNote !== null

  return (
    <div
      onClick={onSelect}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `
          translateX(${distance * 20}px)
          translateY(${translateY}px)
          scale(${scale})
        `,
        opacity: selected ? 1 : 0.65,
        zIndex: selected ? 10 : 1,
      }}
      className="
        relative
        w-full
        shrink-0
        cursor-pointer
        transition-[transform,opacity]
        duration-300
        ease-out
      "
    >

      {/* 3D tilt layer */}
      <div
        style={{
          transform: `
            perspective(1000px)
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
          `,
        }}
        className="
          min-h-full
          transition-transform
          duration-150
          ease-out
        "
      >

        {/* Flip layer */}
        <div
          style={{
            transform: isEditing
              ? "rotateY(180deg)"
              : "rotateY(0deg)",
          }}
          className="
            grid
            h-44
            transform-3d
            transition-transform
            duration-700
            ease-in-out
          "
        >

          {/* ================= FRONT ================= */}
          <div
            className={`
              [grid-area:1/1]
              backface-hidden

              h-full
              rounded-2xl
              border
              bg-white
              p-6

              ${
                selected
                  ? "shadow-xl"
                  : "shadow-sm"
              }

              ${
                isEditing
                  ? "pointer-events-none"
                  : "pointer-events-auto"
              }
            `}
          >

              <h2
                className="
                  text-xl
                  font-bold
                "
              >
                {note.title}
              </h2>

              <p
                className="
                  mt-2
                  text-gray-600
                "
              >
                {note.content}
              </p>

              {selected && (
                <button
                  type="button"
                  onClick={handleEdit}
                  className="
                    mt-4
                    rounded
                    border
                    px-3
                    py-1
                  "
                >
                  Edit
                </button>
              )}


          </div>


          {/* ================= BACK ================= */}
          <div
            className={`
              [grid-area:1/1]
              backface-hidden
              transform-[rotateY(180deg)]

              h-full
              rounded-2xl
              border
              bg-white
              p-6
              shadow-xl

              ${
                isEditing
                  ? "pointer-events-auto"
                  : "pointer-events-none"
              }
            `}
          >

            <form
              onSubmit={handleSubmit}
              onClick={event =>
                event.stopPropagation()
              }
              className="
                flex
                flex-col
                gap-3
              "
            >

              <input
                value={
                  draftNote?.title
                  ?? note.title
                }
                onChange={event =>
                  setDraftNote(current => ({
                    ...(current ?? note),
                    title: event.target.value,
                  }))
                }
                className="
                  w-full
                  rounded
                  border
                  p-2
                "
              />

              <textarea
                value={
                  draftNote?.content
                    ?? note.content
                }
                onChange={event =>
                  setDraftNote(current => ({
                    ...(current ?? note),
                    content: event.target.value,
                  }))
                }
                className="
                  h-14
                  w-full
                  resize-none
                  rounded
                  border
                  p-2
                "
              />

              <div
                className="
                  mt-3
                  flex
                  gap-2
                "
              >

                <div
                  className="
                    mt-auto
                    flex gap-2
                  "
                >

                  <button
                    type="submit"
                    disabled={saving}
                    className="
                      rounded
                      border
                      px-3
                      py-1
                    "
                  >
                    {saving
                      ? "Saving..."
                      : "Save"}
                  </button>

                  <button
                    type="button"
                    onClick={event => {
                      event.stopPropagation()
                      setDraftNote(null)
                    }}
                    className="
                      rounded
                      border
                      px-3
                      py-1
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={deleting}
                    onClick={event => {
                      event.stopPropagation()
                      handleDelete()
                    }}
                    className="
                      rounded
                      border
                      px-3
                      py-1
                    "
                  >
                    {deleting
                      ? "Deleting..."
                      : "Delete"}
                  </button>

                </div>

                {error && (
                  <p
                    className="
                      mt-2
                      text-red-600
                    "
                  >
                    {error}
                  </p>
                )}

                </div>

            </form>

          </div>

        </div>

      </div>

    </div>
  )
}
