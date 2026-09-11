import {
  useState
} from "react"

import type {
  SubmitEventHandler
} from "react"

import {
  createNote
} from "../api/notes"

interface Props {
  onCreated: () => void
}

export default function NoteFrom({
  onCreated,
}: Props) {

  const [title, setTitle] = useState("")

  const [content, setContent] = useState("")

  const [isOpen, setIsOpen] = useState(false)

  const handleSubmit:
    SubmitEventHandler<HTMLFormElement> =
    async (event) => {

    event.preventDefault()

    await createNote({
      title,
      content,
    })

    setTitle("")
    setContent("")
    setIsOpen(false)

    onCreated()
    }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() =>
          setIsOpen(true)
        }
        className="
          rounded-full
          border
          bg-white
          px-4
          py-2
          text-sm
          font-medium
          shadow-sm
          transition
          hover:scale-105
          hover:shadow-md
        "
      >
        + New Note
      </button>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="
        flex
        w-80
        flex-col
        gap-3
        rounded-2xl
        border
        bg-white
        p-4
        shadow-lg
      "
    >

      <input
        value={title}
        onChange={event =>
          setTitle(event.target.value)
        }
        placeholder="Title"
        className="
          rounded-lg
          border
          px-3
          py-2
          outline-none
          focus:ring-2
          focus:ring-black/10
        "
      />

      <textarea
        value={content}
        onChange={event =>
          setContent(event.target.value)
        }
        placeholder="Content"
        className="
          h-20
          resize-none
          rounded-lg
          border
          px-3
          py-2
          outline-none
          focus:ring-2
          focus:ring-black/10
        "
      />

      <div
        className="
          flex
          justify-end
          gap-2
        "
      >

        <button
          type="button"
          onClick={() => {
            setTitle("")
            setContent("")
            setIsOpen(false)
          }}
          className="
            rounded-lg
            px-3
            py-2
            text-sm
            text-gray-500
            transition
            hover:bg-gray-100
          "
        >
          Cancel
        </button>

        <button
          type="submit"
          className="
            rounded-lg
            bg-black
            px-4
            py-2
            text-sm
            font-medium
            text-white
            transition
            hover:bg-gray-800
          "
        >
          Create
        </button>

      </div>

    </form>
  )

}
