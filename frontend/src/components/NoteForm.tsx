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

    onCreated()
  }

  return (
    <form
      onSubmit={handleSubmit}
    >

      <input
        value={title}
        onChange={
          e => setTitle(
            e.target.value
          )
        }
        placeholder="Title"
      />

      <textarea
        value={content}
        onChange={
          e => setContent(
            e.target.value
          )
        }
        placeholder="Content"
      />

      <button
        type="submit">
        Create
      </button>

    </form>
  )

}
