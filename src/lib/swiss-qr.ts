import QRCode from "qrcode";
import sharp from "sharp";

/**
 * SPS 2.0 Swiss QR-bill payload + image generator.
 * Ported from Ginda — see ../../Ginda App/src/lib/swiss-qr.ts.
 */

export interface SwissQrParams {
  iban: string;
  creditorName: string;
  creditorStreet: string;
  creditorZipCity: string; // "3987 Riederalp"
  creditorCountry: string; // "CH"
  amountRappen: number;
  currency: "CHF" | "EUR";
  debtorName?: string;
  debtorStreet?: string;
  debtorZipCity?: string;
  debtorCountry?: string;
  message?: string;
}

export function buildSwissQrPayload(p: SwissQrParams): string {
  const iban = p.iban.replace(/\s/g, "");
  const amount = (p.amountRappen / 100).toFixed(2);
  const hasDebtor = !!(p.debtorName && p.debtorCountry);

  return [
    "SPC",
    "0200",
    "1",
    iban,
    "K",                                             // address type: combined
    p.creditorName,
    p.creditorStreet,
    p.creditorZipCity,
    "",
    "",
    p.creditorCountry,
    "", "", "", "", "", "", "",                      // ultimate creditor (7 reserved)
    amount,
    p.currency,
    hasDebtor ? "K" : "",
    hasDebtor ? p.debtorName! : "",
    hasDebtor && p.debtorStreet ? p.debtorStreet : "",
    hasDebtor && p.debtorZipCity ? p.debtorZipCity : "",
    "",
    "",
    hasDebtor ? p.debtorCountry! : "",
    "NON",                                           // reference type
    "",                                              // reference value
    p.message ?? "",
    "EPD",
    "",                                              // bill information
  ].join("\n");
}

/** Swiss federal cross — black square, white cross, classical proportions. */
function swissCrossSvg(size: number): Buffer {
  return Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 22 22">
      <rect width="22" height="22" fill="white"/>
      <rect x="1" y="1" width="20" height="20" fill="black"/>
      <rect x="9" y="4" width="4" height="14" fill="white"/>
      <rect x="4" y="9" width="14" height="4" fill="white"/>
    </svg>`,
  );
}

export async function generateSwissQrDataUrl(payload: string): Promise<string> {
  const qrBuffer = await QRCode.toBuffer(payload, {
    errorCorrectionLevel: "M",
    type: "png",
    margin: 0,
    width: 256,
  });

  const crossPng = await sharp(swissCrossSvg(42)).png().toBuffer();

  const result = await sharp(qrBuffer)
    .composite([{ input: crossPng, gravity: "center" }])
    .png()
    .toBuffer();

  return `data:image/png;base64,${result.toString("base64")}`;
}

export function formatIban(iban: string): string {
  const clean = iban.replace(/\s/g, "");
  return clean.replace(/(.{4})/g, "$1 ").trim();
}

export function formatQrAmount(rappen: number): string {
  const [int, dec] = (rappen / 100).toFixed(2).split(".");
  const formatted = int.replace(/\B(?=(\d{3})+(?!\d))/g, "’");
  return `${formatted}.${dec}`;
}
