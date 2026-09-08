import {
  useCallback,
  useEffect,
  useState
} from "react"

import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"
import NoteForm from "../components/NoteForm"
import NoteCard from "../components/NoteCard"
import Welcome from "../components/Welcome"

import {
  getNotes
} from "../api/notes"

import type {
  Note
} from "../types/note"


export default function NotesPage() {

  const [notes, setNotes] =
    useState<Note[]>([])

  const [selectNoteId, setSelectNoteId] =
    useState<number | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  const [showWelcome, setShowWelcome] =
    useState(true)


  const fetchNotes = useCallback(
    async () => {

      try {

        const data = await getNotes()

        setNotes(data)
        setSelectNoteId(
          current =>
            data.some(note => note.id === current)
              ? current
              : data[0]?.id ?? null
        )
        setError(null)

      } catch {

        setError(
          "Failed to load notes"
        )

      }
    },
    []
  )


  useEffect(() => {

    const loadNotes = async () => {

      try {

        setLoading(true)

        await fetchNotes()

      } finally {

        setLoading(false)

      }
    }

    loadNotes()

  }, [fetchNotes])

  const selectedNoteIndex = Math.max(
    notes.findIndex(
      note => note.id === selectNoteId
    ),
    0
  )


  const selectPrevNote = useCallback(() => {
    if (notes.length === 0) {
      return
    }

    const prevIndex = Math.max(
      selectedNoteIndex - 1,
      0
    )

    setSelectNoteId(notes[prevIndex].id)
  }, [notes, selectedNoteIndex])

  const selectNextNote = useCallback(() => {
    if (notes.length === 0) {
      return
    }

    const nextIndex = Math.min(
      selectedNoteIndex + 1,
      notes.length - 1
    )

    setSelectNoteId(notes[nextIndex].id)
  }, [notes, selectedNoteIndex])

  useEffect(() => {
    const handleKeyDown = (
      event: KeyboardEvent
    ) => {
      if (event.key === "ArrowLeft") {
        selectPrevNote()
      } else if (event.key === "ArrowRight") {
        selectNextNote()
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    )

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      )
    }
  }, [selectPrevNote, selectNextNote])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
      />
    )
  }

  const activeNoteId =
    selectNoteId ?? notes[0]?.id ?? null

  return (
    <>

      {showWelcome && (
        <Welcome
        onComplete={() =>
            setShowWelcome(false)
          }
        />
      )}

      <main
        className="
          min-h-screen
          w-full
          px-6
          py-12
        "
      >

        <header
          className="
            flex
            min-h-[35vh]
            flex-col
            items-center
            justify-center
            text-center
          "
        >

          <p
            className="
              mb-3
              text-sm
              font-medium
              uppercase
              tracking-[0.3em]
              text-gray-500
            "
          >
            Personal Knowledge
          </p>

          <h1
            className="
              text-5xl
              font-semibold
              tracking-tight
              sm:text-6xl
            "
          >
            Think. Connect. Remember.
          </h1>

        </header>


        <section
          className="
            flex
            flex-col
          "
        >

          <div
            className="
              flex
              items-center
              justify-between
              px-8
            "
          >

            <h2
              className="
                text-2xl
                font-semibold
                tracking-tight
              "
            >
              My Notes
            </h2>

            <NoteForm
              onCreated={fetchNotes}
            />

          </div>


          <div
            className="
              min-h-[60vh]
              w-full
              min-w-0
            "
          >

            <button
              type="button"
              onClick={selectPrevNote}
              disabled={
                notes.length === 0 ||
                selectedNoteIndex === 0
              }
            >
              Prev Note
            </button>

            <button
              type="button"
              onClick={selectNextNote}
              disabled={
                notes.length === 0 ||
                selectedNoteIndex === notes.length - 1
              }
            >
              Next Note
            </button>

            <div
              className="
                w-full
                max-w-full
                overflow-x-auto
                overflow-y-hidden
              "
            >

              <div
                className="
                  flex
                  min-h-[60vh]
                  w-max
                  min-w-full
                  items-center
                  justify-center
                  gap-6
                  py-20
                "
                style={{
                  paddingInline:
                    "max(2rem, calc(50% - 10rem))",
                }}
              >

                {
                  notes.map((note, index) => {

                    const distance =
                      index - selectedNoteIndex

                    return (
                      <NoteCard
                        key={note.id}
                        note={note}
                        onUpdated={fetchNotes}
                        onDeleted={fetchNotes}
                        selected={
                          activeNoteId === note.id
                        }
                        distance={distance}
                        onSelect={() =>
                          setSelectNoteId(note.id)
                        }
                      />
                    )
                  })
                }

              </div>

            </div>

          </div>

        </section>

      </main>
    </>
  )
}
