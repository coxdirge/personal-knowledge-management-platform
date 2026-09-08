import {
  useState,
  useRef,
  useEffect,
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
    ? 1.08
    : Math.max(0.82, 0.96 - Math.abs(distance) * 0.06)

  const translateY = selected
    ? -16
    : 0

  const cardRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    if (!selected) {
      return
    }

    cardRef.current?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    })
  }, [selected])

  return (
    <div
      ref={cardRef}
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
      className={`
        w-80
        shrink-0
        cursor-pointer
        transition-[transform,opacity]
        duration-300
        ease-out
      `}
    >

      <div
        style={{
          transform: `
            perspective(1000px)
            rotateX(${rotation.x}deg)
            rotateY(${rotation.y}deg)
          `,
        }}
        className={`
        min-h-full
        rounded-2xl
        border
        bg-white
        p-6
        transition-transform
        duration-150
        ease-out
        ${
          selected
            ? "shadow-xl"
            : "shadow-sm"
        }
      `}
      >

      {draftNote !== null ? (
        <form
          onSubmit={handleSubmit}
          onClick={event =>
            event.stopPropagation()
          }
          className="
          rounded-lg
          border
          p-4
          shadow-sm
          "
        >
          <input
            value={draftNote.title}
            onChange={
              e => setDraftNote({
                ...draftNote,
                title: e.target.value,
              })
            }
            className="
            w-full
            rounded
            border
            p-2
            "
          />

          <textarea
            value={draftNote.content}
            onChange={
              e => setDraftNote({
                ...draftNote,
                content: e.target.value,
              })
            }
            className="
            mt-2
            w-full
            rounded
            border
            p-2
            "
          />

          <div className="mt-3 flex gap-2">
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
              {saving ? "Saving..." : "Save"}
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
              onClick={event => {
                event.stopPropagation()
                handleDelete()
              }}
              disabled={deleting}
              className="
                rounded
                border
                px-3
                py-1
              "
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>

          </div>

          {error && (
            <p className="mt-2 text-red-600">
              {error}
            </p>
          )}

        </form>
      ) : (
        <div
          className="
            rounded-lg
            border
            p-4
            shadow-sm
          "
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
      )}

      </div>

    </div>
  )
}
