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

  const [searchInput, setSearchInput] = useState("")

  const [searchQuery, setSearchQuery] = useState("")

  const [searching, setSearching] = useState(false)

  const [searchError, setSearchError] = useState<string | null>(null)

  const fetchNotes = useCallback(async (query: string) => {
    try {
      const data = await getNotes(query)

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

  const refreshNotes = useCallback(async () => {
    await fetchNotes(searchQuery)
  }, [fetchNotes, searchQuery])

  const handleNoteCreated = useCallback(
    async (note: Note) => {
      await refreshNotes()

      setSelectNoteId(note.id)
    },
    [refreshNotes],
  )

  const handleSearch = useCallback(async () => {
    const query = searchInput.trim()

    try {
      setSearching(true)
      setSearchError(null)

      await fetchNotes(query)

      setSearchQuery(query)
    } catch {
      setSearchError("Failed to search notes")
    } finally {
      setSearching(false)
    }
  }, [fetchNotes, searchInput])

  const handleClearSearch = useCallback(async () => {
    try {
      setSearching(true)
      setSearchError(null)

      await fetchNotes("")

      setSearchInput("")
      setSearchQuery("")
    } catch {
      setSearchError("Failed to load notes")
    } finally {
      setSearching(false)
    }
  }, [fetchNotes])

  useEffect(() => {
    const loadNotes = async () => {
      try {
        setLoading(true)

        await fetchNotes("")
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
                gap-4
                px-2
                sm:px-8
              "
            >
              <h2
                className="
                  shrink-0
                  text-2xl
                  font-semibold
                  tracking-tight

                  dark:text-zinc-100
                "
              >
                My Notes
              </h2>

              {/* ================= SEARCH ================= */}
              <div
                className="
                  flex
                  w-full
                  max-w-md
                  items-center
                  gap-2
                "
              >
                <input
                  type="search"
                  value={searchInput}
                  disabled={searching}
                  onChange={event => setSearchInput(event.target.value)}
                  onKeyDown={event => {
                    if (event.key === "Enter") {
                      handleSearch()
                    }
                  }}
                  placeholder="Search notes..."
                  className="
                    w-full
                    rounded-xl
                    border
                    bg-white/70
                    px-3
                    py-2
                    text-sm
                    outline-none
                    backdrop-blur

                    focus:ring-2
                    focus:ring-black/10

                    dark:bg-[#14161c]/80
                    dark:text-zinc-100
                    dark:border-white/15
                    dark:placeholder:text-zinc-400
                    dark:focus:ring-white/15
                  "
                />

                {searchInput && (
                  <button
                    type="button"
                    disabled={searching}
                    onClick={handleClearSearch}
                    className="
                      rounded-xl
                      border
                      bg-white/70
                      px-3
                      py-2
                      text-sm

                      dark:bg-[#14161c]/80
                      dark:text-zinc-300
                      dark:border-white/15
                      dark:hover:bg-white/10
                    "
                  >
                    {searching ? "..." : "Clear"}
                  </button>
                )}
              </div>

              <NoteForm onCreated={handleNoteCreated} />
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
              {notes.length === 0 ? (
                <div
                  className="
                    flex
                    min-h-[clamp(20rem,38svh,26rem)]
                    items-center
                    justify-center
                  "
                >
                  <div
                    className="
                      text-center
                    "
                  >
                    <h3
                      className="
                        text-lg
                        font-medium

                        dark:text-zinc-100
                      "
                    >
                      {searchQuery ? "No notes found." : "No notes yet."}
                    </h3>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-gray-500

                        dark:text-zinc-400
                      "
                    >
                      {searchQuery
                        ? "Try a different search."
                        : "Create your first note to get started."}
                    </p>

                    {searchError && (
                      <p
                        className="
                          mt-2
                          text-sm
                          text-red-600
                          dark:text-red-400
                        "
                      >
                        {searchError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  {/* ================= PREVIOUS NOTE ================= */}
                  <button
                    type="button"
                    onClick={selectPrevNote}
                    disabled={selectedNoteIndex === 0}
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
                    {"<-"}
                  </button>

                  {/* ================= NOTES CAROUSEL ================= */}
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
                              onUpdated={refreshNotes}
                              onDeleted={refreshNotes}
                              selected={activeNoteId === note.id}
                              distance={distance}
                              onSelect={() => setSelectNoteId(note.id)}
                            />
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* ================= NEXT NOTE ================= */}
                  <button
                    type="button"
                    onClick={selectNextNote}
                    disabled={selectedNoteIndex === notes.length - 1}
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
                    {"->"}
                  </button>
                </>
              )}
            </div>
          </section>
        </Hero>
      </main>
    </>
  )
}
