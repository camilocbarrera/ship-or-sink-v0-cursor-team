import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Simple - Transforma Texto Complejo en Historias Visuales";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#1c1c1c",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "60px",
        }}
      >
        {/* Color dots decoration */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "40px",
          }}
        >
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#6e59fb" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#91cfee" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#e276b1" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#65b489" }} />
          <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#f0c453" }} />
        </div>

        {/* Logo */}
        <span
          style={{
            fontSize: "64px",
            fontWeight: "bold",
            color: "#f4efed",
            letterSpacing: "-0.02em",
            marginBottom: "24px",
          }}
        >
          simple
        </span>

        {/* Main text */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <span
            style={{
              fontSize: "36px",
              fontWeight: "500",
              color: "#a0a0a0",
              textAlign: "center",
            }}
          >
            Transforma texto complejo en
          </span>
          <span
            style={{
              fontSize: "42px",
              fontWeight: "600",
              color: "#6e59fb",
              textAlign: "center",
            }}
          >
            historias visuales
          </span>
        </div>

        {/* Subtitle */}
        <span
          style={{
            fontSize: "20px",
            color: "#6b6360",
            marginTop: "32px",
            textAlign: "center",
          }}
        >
          Visualización de Libros con IA
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
