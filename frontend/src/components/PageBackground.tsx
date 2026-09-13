export default function PageBackground() {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        fixed
        inset-0
        -z-10
        overflow-hidden

        bg-white
        transition-colors
        duration-500

        dark:bg-[#090a0d]
      "
    >
      {/* ================= DOT GRID: LIGHT ================= */}
      <div
        className="
          absolute
          inset-0
          dark:hidden
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle,
              rgba(0,0,0,0.10) 1.4px,
              transparent 1.4px
            )
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* ================= DOT GRID: DARK ================= */}
      <div
        className="
          absolute
          inset-0
          hidden
          dark:block
        "
        style={{
          backgroundImage: `
            radial-gradient(
              circle,
              rgba(255,255,255,0.10) 1.4px,
              transparent 1.4px
            )
          `,
          backgroundSize: "42px 42px",
        }}
      />

      {/* ================= AMBIENT COLOR ================= */}
      <div
        className="
          absolute
          -left-32
          top-0
          h-136
          w-136
          rounded-full

          bg-blue-300/30
          blur-[120px]

          dark:bg-blue-500/12
        "
      />

      <div
        className="
          absolute
          -right-32
          top-[20%]
          h-144
          w-xl
          rounded-full

          bg-violet-300/30
          blur-[130px]

          dark:bg-violet-500/12
        "
      />

      <div
        className="
          absolute
          -bottom-40
          left-[30%]
          h-120
          w-120
          rounded-full

          bg-rose-200/26
          blur-[130px]

          dark:bg-fuchsia-500/8
        "
      />
    </div>
  )
}
