"use client"

export function ImageFileButton({
  label,
  disabled,
  onFile,
}: {
  label: string
  disabled?: boolean
  onFile: (file: File) => void
}) {
  return (
    <label
      className={
        disabled
          ? "relative inline-flex h-8 cursor-not-allowed overflow-hidden"
          : "relative inline-flex h-8 cursor-pointer overflow-hidden"
      }
    >
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        className="absolute inset-0 z-10 size-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
        onChange={(event) => {
          const file = event.target.files?.[0]
          event.target.value = ""
          if (file) onFile(file)
        }}
      />
      <span className="inline-flex h-8 items-center rounded-lg border border-border px-2.5 text-sm">{label}</span>
    </label>
  )
}
