import { ImageResponse } from "next/og"

import { SITE_NAME } from "@/lib/site"

export const alt = SITE_NAME
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = "image/png"

export default function OpenGraphImage() {
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
          background: "linear-gradient(145deg, #09090b 0%, #18181b 55%, #27272a 100%)",
          padding: 72,
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 64,
            fontWeight: 700,
            color: "#fafafa",
            letterSpacing: -1.5,
          }}
        >
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 28,
            color: "#a1a1aa",
          }}
        >
          Sekolah Aparatur
        </div>
      </div>
    ),
    { ...size }
  )
}
