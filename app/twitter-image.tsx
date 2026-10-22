import { ImageResponse } from "next/og"

export const alt = "Program Sekolah Aparatur — Sekolah Aparatur"
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          background: "#1f2c72",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            maxWidth: 980,
            fontSize: 52,
            fontWeight: 700,
            color: "#ffffff",
            lineHeight: 1.15,
            letterSpacing: -1,
          }}
        >
          Program Sekolah Aparatur
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 20,
            fontSize: 28,
            color: "#ffbe59",
          }}
        >
          Sekolah Aparatur
        </div>
      </div>
    ),
    { ...size },
  )
}
