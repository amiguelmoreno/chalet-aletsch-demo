import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Chalet Aletsch — Berghaus seit 1923";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const PARCHMENT = "#FBF8F1";
const FOREST = "#2A3F2C";
const FOREST_LIGHT = "#4E6E50";
const INK = "#1F1E18";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isEn = locale === "en";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: PARCHMENT,
          padding: "72px 96px",
          fontFamily: "Georgia, serif",
          color: INK,
          position: "relative",
        }}
      >
        {/* Hairline corner brackets */}
        <CornerBracket x={48} y={48} corner="tl" />
        <CornerBracket x={1152} y={48} corner="tr" />
        <CornerBracket x={48} y={582} corner="bl" />
        <CornerBracket x={1152} y={582} corner="br" />

        {/* Top label */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: FOREST,
            letterSpacing: "0.32em",
            fontSize: 18,
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: 56, height: 1, background: FOREST_LIGHT, opacity: 0.6 }} />
          <span>Riederalp · Wallis · Schweiz</span>
        </div>

        {/* Main heading */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: 40,
            flex: 1,
          }}
        >
          <div
            style={{
              fontStyle: "italic",
              fontSize: 60,
              lineHeight: 1.05,
              color: FOREST,
              fontWeight: 400,
              letterSpacing: "-0.01em",
            }}
          >
            {isEn ? "In the shadow of" : "Im Schatten des"}
          </div>
          <div
            style={{
              fontSize: 86,
              lineHeight: 1.0,
              color: INK,
              fontWeight: 400,
              letterSpacing: "-0.015em",
              marginTop: 6,
            }}
          >
            {isEn ? "the Aletsch glacier," : "Aletschgletschers,"}
          </div>
          <div
            style={{
              fontSize: 86,
              lineHeight: 1.0,
              color: INK,
              fontWeight: 400,
              letterSpacing: "-0.015em",
              marginTop: 4,
            }}
          >
            {isEn ? "a mountain house since MCMXXIII." : "ein Berghaus seit MCMXXIII."}
          </div>
        </div>

        {/* Bottom rule with name */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 28,
            borderTop: `1px solid ${INK}30`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
            {/* Tiny crest — Satori does not support <text> in SVG, use stacked rings + a plain div */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 64,
                height: 64,
                borderRadius: 32,
                border: `0.8px solid ${FOREST}`,
                position: "relative",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  border: `1.4px solid ${FOREST}`,
                  fontStyle: "italic",
                  fontSize: 26,
                  color: FOREST,
                }}
              >
                CA
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 28, fontStyle: "italic", color: INK }}>
                Chalet Aletsch
              </div>
              <div
                style={{
                  fontSize: 14,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: FOREST,
                  marginTop: 4,
                }}
              >
                {isEn ? "Family-run since 1923" : "Berghaus seit MCMXXIII"}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 14,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: FOREST,
            }}
          >
            chalet-aletsch.ch
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function CornerBracket({
  x,
  y,
  corner,
}: {
  x: number;
  y: number;
  corner: "tl" | "tr" | "bl" | "br";
}) {
  const len = 24;
  const t: Record<typeof corner, React.CSSProperties> = {
    tl: { left: x, top: y, borderTop: `1px solid ${FOREST}80`, borderLeft: `1px solid ${FOREST}80` },
    tr: { left: x - len, top: y, borderTop: `1px solid ${FOREST}80`, borderRight: `1px solid ${FOREST}80` },
    bl: { left: x, top: y - len, borderBottom: `1px solid ${FOREST}80`, borderLeft: `1px solid ${FOREST}80` },
    br: { left: x - len, top: y - len, borderBottom: `1px solid ${FOREST}80`, borderRight: `1px solid ${FOREST}80` },
  };
  return (
    <div
      style={{
        position: "absolute",
        width: len,
        height: len,
        ...t[corner],
      }}
    />
  );
}
