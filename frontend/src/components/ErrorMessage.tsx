interface Props {
  message: string
}

export default function ErrorMessage({ message }: Props) {
  return (
    <div
      className="
      p-6
      text-red-500
      "
    >
      {message}
    </div>
  )
}
