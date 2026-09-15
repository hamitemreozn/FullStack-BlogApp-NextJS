import { ImageResponse } from "next/og";

import { siteName } from "@/lib/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "linear-gradient(135deg, #211a35, #594064)",
        color: "#fffcf8",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        justifyContent: "center",
        padding: "96px",
        width: "100%",
      }}
    >
      <div style={{ color: "#e1b86b", fontSize: 28, letterSpacing: 10 }}>
        GÖKYÜZÜ GÜNLÜĞÜ
      </div>
      <div style={{ fontSize: 76, marginTop: 32, textAlign: "center" }}>
        {siteName}
      </div>
    </div>,
    size,
  );
}
