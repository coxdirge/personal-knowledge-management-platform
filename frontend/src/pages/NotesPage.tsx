import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  useRef,
} from "react"

import Loading from "../components/Loading"
import ErrorMessage from "../components/ErrorMessage"
import NoteForm from "../components/NoteForm"
import NoteCard from "../components/NoteCard"
import Welcome from "../components/Welcome"
import Hero from "../components/Hero"
import PageBackground from "../components/PageBackground"
import Navbar from "../components/Navbar"

import { getNotes } from "../api/notes"

import type { Note } from "../types/note"

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([])

  const [selectNoteId, setSelectNoteId] = useState<number | null>(null)

  const [loading, setLoading] = useState(true)

  const [error, setError] = useState<string | null>(null)

  const [showWelcome, setShowWelcome] = useState(true)

  const carouselRef = useRef<HTMLDivElement>(null)

  const fetchNotes = useCallback(async () => {
    try {
      const data = await getNotes()

      setNotes(data)
      setSelectNoteId(current =>
        data.some(note => note.id === current)
          ? current
          : (data[0]?.id ?? null),
      )
      setError(null)
    } catch {
      setError("Failed to load notes")
    }
  }, [])

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
    notes.findIndex(note => note.id === selectNoteId),
    0,
  )

  const selectPrevNote = useCallback(() => {
    if (notes.length === 0) {
      return
    }

    const prevIndex = Math.max(selectedNoteIndex - 1, 0)

    setSelectNoteId(notes[prevIndex].id)
  }, [notes, selectedNoteIndex])

  const selectNextNote = useCallback(() => {
    if (notes.length === 0) {
      return
    }

    const nextIndex = Math.min(selectedNoteIndex + 1, notes.length - 1)

    setSelectNoteId(notes[nextIndex].id)
  }, [notes, selectedNoteIndex])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return
      }

      if (event.key === "ArrowLeft") {
        selectPrevNote()
      } else if (event.key === "ArrowRight") {
        selectNextNote()
      }
    }

    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [selectPrevNote, selectNextNote])

  useLayoutEffect(() => {
    const carousel = carouselRef.current
    const selectedSlot = carousel?.querySelector<HTMLElement>(
      `[data-note-id="${selectNoteId}"]`,
    )

    if (!carousel || !selectedSlot) {
      return
    }

    // Measure layout, not the card's animated 3D transform.
    const centerSelectedNote = () => {
      carousel.scrollTo({
        left:
          selectedSlot.offsetLeft +
          selectedSlot.offsetWidth / 2 -
          carousel.clientWidth / 2,
        behavior: "smooth",
      })
    }

    let frame = 0
    const scheduleCenter = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(centerSelectedNote)
    }

    scheduleCenter()

    // Editing can change the track's height without changing selection.
    const observer = new ResizeObserver(scheduleCenter)

    observer.observe(carousel)
    observer.observe(selectedSlot)

    if (selectedSlot.parentElement) {
      observer.observe(selectedSlot.parentElement)
    }

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [selectNoteId, selectedNoteIndex, notes, loading, error])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const activeNoteId = selectNoteId ?? notes[0]?.id ?? null

  return (
    <>
      <PageBackground />

      {/* ================= GLOBAL NAVIGATION ================= */}
      <Navbar />

      {showWelcome && <Welcome onComplete={() => setShowWelcome(false)} />}

      <main
        className="
          relative
          min-h-screen
          w-full
        "
      >
        {/* Finite Hero → compact header + carousel → normal page exit. */}
        <Hero>
          {/* ================= NOTES WORKSPACE ================= */}
          <section
            className="
              relative
              z-10
              flex
              min-h-screen
              flex-col
              bg-transparent
              px-6
              pt-6
              pb-12
            "
          >
            {/* ================= WORKSPACE HEADER ================= */}
            <div
              className="
                flex
                items-center
                justify-between
                px-2
                sm:px-8
              "
            >
              <h2
                className="
                  text-2xl
                  font-semibold
                  tracking-tight
                  dark:text-zinc-100
                "
              >
                My Notes
              </h2>

              <NoteForm onCreated={fetchNotes} />
            </div>

            {/* Bounded vertical spacing keeps cards close to the heading on tall screens. */}
            <div
              className="
                relative
                min-h-[clamp(20rem,38svh,26rem)]
                w-full
                min-w-0
              "
            >
              <button
                type="button"
                onClick={selectPrevNote}
                disabled={notes.length === 0 || selectedNoteIndex === 0}
                className="
                  absolute
                  left-4
                  top-1/2
                  z-20
                  -translate-y-1/2
                  rounded-full
                  border
                  bg-white/80
                  dark:bg-[#14161c]/80
                  dark:text-zinc-100
                  dark:border-white/15
                  dark:shadow-black/30
                  dark:hover:bg-white/10
                  dark:focus-visible:outline-2
                  dark:focus-visible:outline-white/40
                  px-4
                  py-3
                  text-xl
                  shadow-md
                  backdrop-blur
                  transition
                  hover:scale-105
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                {/*&lt;-*/}
                {"<-"}
              </button>

              <div
                ref={carouselRef}
                style={{ overflowAnchor: "none" }}
                className="
                  w-full
                  max-w-full
                  overflow-x-auto
                  overflow-y-hidden
                "
              >
                <div
                  className="
                    relative
                    flex
                    min-h-[clamp(20rem,38svh,26rem)]
                    w-max
                    min-w-full
                    items-center
                    justify-center
                    gap-6
                    py-16
                  "
                  style={{
                    paddingInline: "max(2rem, calc(50% - 10rem))",
                  }}
                >
                  {notes.map((note, index) => {
                    const distance = index - selectedNoteIndex

                    return (
                      // 20rem slot owns card width; track end padding uses its 10rem half-width.
                      <div
                        key={note.id}
                        data-note-id={note.id}
                        className="
                          w-80
                          shrink-0
                        "
                      >
                        <NoteCard
                          note={note}
                          onUpdated={fetchNotes}
                          onDeleted={fetchNotes}
                          selected={activeNoteId === note.id}
                          distance={distance}
                          onSelect={() => setSelectNoteId(note.id)}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>

              <button
                type="button"
                onClick={selectNextNote}
                disabled={
                  notes.length === 0 || selectedNoteIndex === notes.length - 1
                }
                className="
                  absolute
                  right-4
                  top-1/2
                  z-20
                  -translate-y-1/2
                  rounded-full
                  border
                  bg-white/80
                  dark:bg-[#14161c]/80
                  dark:text-zinc-100
                  dark:border-white/15
                  dark:shadow-black/30
                  dark:hover:bg-white/10
                  dark:focus-visible:outline-2
                  dark:focus-visible:outline-white/40
                  px-4
                  py-3
                  text-xl
                  shadow-md
                  backdrop-blur
                  transition
                  hover:scale-105
                  disabled:cursor-not-allowed
                  disabled:opacity-30
                "
              >
                {/*-&gt;*/}
                {"->"}
              </button>
            </div>
          </section>
        </Hero>
      </main>
    </>
  )
}
