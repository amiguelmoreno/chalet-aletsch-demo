import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
  Svg,
  Path,
  Circle,
} from "@react-pdf/renderer";
import { formatIban, formatQrAmount } from "@/lib/swiss-qr";

type Locale = "de" | "en" | "fr" | "it";

export type BookingInvoiceData = {
  reference: string;
  guestName: string;
  guestEmail: string;
  guestStreet?: string | null;
  guestZipCity?: string | null;
  guestCountry?: string | null;
  locale: Locale;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  items: Array<{
    roomName: string;
    nights: number;
    unitPriceRappen: number;
    lineTotalRappen: number;
  }>;
  extras: Array<{
    name: string;
    quantity: number;
    unitPriceRappen: number;
    lineTotalRappen: number;
  }>;
  subtotalRappen: number;
  totalRappen: number;
  depositRappen: number;
  issueDate: Date;
  business: {
    name: string;
    street: string;
    zip: string;
    city: string;
    country: string;
    email: string;
    phone: string;
    iban: string;
    bank: string;
    accountHolder: string;
  };
  /** Pre-rendered QR data URL (PNG base64). Generated server-side. */
  qrDataUrl: string | null;
};

const T = {
  de: {
    title: "Rechnung",
    subtitle: "Anzahlung 30 %",
    invoiceNo: "Rechnung-Nr.",
    issueDate: "Datum",
    billTo: "AN",
    stay: "Aufenthalt",
    arrival: "Anreise",
    departure: "Abreise",
    guests: "Gäste",
    nights: "Nächte",
    description: "Bezeichnung",
    qty: "Menge",
    unitPrice: "Preis",
    lineTotal: "Total",
    rooms: "Stuben",
    extras: "Erweiterungen",
    subtotal: "Zwischensumme",
    deposit: "Anzahlung 30 %",
    total: "Gesamt CHF",
    payment: "ZAHLUNGSANGABEN",
    payDeposit: "Bitte überweisen Sie die Anzahlung von CHF",
    qrHint: "Bezahlen Sie bequem mit dem Swiss QR-Code:",
    receiptStub: "EMPFANGSSCHEIN",
    paymentPart: "ZAHLTEIL",
    accountPayableTo: "Konto / Zahlbar an",
    referenceLabel: "Referenz",
    payableBy: "Zahlbar durch",
    currency: "Währung",
    amount: "Betrag",
    additionalInfo: "Zusätzliche Informationen",
    footer: "Vielen Dank, wir freuen uns auf Sie.",
  },
  en: {
    title: "Invoice",
    subtitle: "Deposit 30%",
    invoiceNo: "Invoice no.",
    issueDate: "Date",
    billTo: "TO",
    stay: "Stay",
    arrival: "Arrival",
    departure: "Departure",
    guests: "Guests",
    nights: "nights",
    description: "Description",
    qty: "Qty",
    unitPrice: "Price",
    lineTotal: "Total",
    rooms: "Rooms",
    extras: "Extras",
    subtotal: "Subtotal",
    deposit: "Deposit 30%",
    total: "Total CHF",
    payment: "PAYMENT DETAILS",
    payDeposit: "Please transfer the deposit of CHF",
    qrHint: "Pay easily with the Swiss QR code:",
    receiptStub: "RECEIPT",
    paymentPart: "PAYMENT PART",
    accountPayableTo: "Account / Payable to",
    referenceLabel: "Reference",
    payableBy: "Payable by",
    currency: "Currency",
    amount: "Amount",
    additionalInfo: "Additional information",
    footer: "Thank you — we look forward to your arrival.",
  },
  fr: {
    title: "Facture",
    subtitle: "Acompte 30 %",
    invoiceNo: "N° de facture",
    issueDate: "Date",
    billTo: "À",
    stay: "Séjour",
    arrival: "Arrivée",
    departure: "Départ",
    guests: "Hôtes",
    nights: "nuits",
    description: "Désignation",
    qty: "Qté",
    unitPrice: "Prix",
    lineTotal: "Total",
    rooms: "Chambres",
    extras: "Extras",
    subtotal: "Sous-total",
    deposit: "Acompte 30 %",
    total: "Total CHF",
    payment: "INFORMATIONS DE PAIEMENT",
    payDeposit: "Veuillez verser l'acompte de CHF",
    qrHint: "Payez facilement avec le QR-code suisse :",
    receiptStub: "RÉCÉPISSÉ",
    paymentPart: "SECTION PAIEMENT",
    accountPayableTo: "Compte / Payable à",
    referenceLabel: "Référence",
    payableBy: "Payable par",
    currency: "Monnaie",
    amount: "Montant",
    additionalInfo: "Informations supplémentaires",
    footer: "Merci, nous nous réjouissons de votre venue.",
  },
  it: {
    title: "Fattura",
    subtitle: "Acconto 30%",
    invoiceNo: "N. fattura",
    issueDate: "Data",
    billTo: "A",
    stay: "Soggiorno",
    arrival: "Arrivo",
    departure: "Partenza",
    guests: "Ospiti",
    nights: "notti",
    description: "Descrizione",
    qty: "Q.tà",
    unitPrice: "Prezzo",
    lineTotal: "Totale",
    rooms: "Camere",
    extras: "Extra",
    subtotal: "Subtotale",
    deposit: "Acconto 30%",
    total: "Totale CHF",
    payment: "DATI DI PAGAMENTO",
    payDeposit: "Si prega di versare l'acconto di CHF",
    qrHint: "Pagare comodamente con il QR-code svizzero:",
    receiptStub: "RICEVUTA",
    paymentPart: "SEZIONE DI PAGAMENTO",
    accountPayableTo: "Conto / Pagabile a",
    referenceLabel: "Riferimento",
    payableBy: "Pagabile da",
    currency: "Valuta",
    amount: "Importo",
    additionalInfo: "Informazioni supplementari",
    footer: "Grazie, attendiamo con piacere il vostro arrivo.",
  },
} as const;

// Editorial palette
const PARCH = "#FBF8F1";
const INK = "#1F1E18";
const FOREST = "#2A3F2C";
const RULE = "#A99F8A";
const MUTED = "#5C5749";
const SEAL = "#A82A1F";

const s = StyleSheet.create({
  page: {
    paddingTop: 56,
    paddingBottom: 64,
    paddingHorizontal: 56,
    backgroundColor: PARCH,
    color: INK,
    fontSize: 10,
    fontFamily: "Times-Roman",
    lineHeight: 1.45,
  },
  pageQr: {
    paddingTop: 0,
    paddingBottom: 0,
    paddingHorizontal: 0,
    backgroundColor: PARCH,
    color: INK,
    fontSize: 9,
    fontFamily: "Helvetica",
  },
  // top hairline strip
  topStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 6,
    borderBottom: `0.5pt solid ${RULE}`,
    fontSize: 8,
    color: FOREST,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  hero: { flexDirection: "row", justifyContent: "space-between", marginTop: 24 },
  heroLeft: { flex: 1 },
  heroRight: { alignItems: "flex-end" },
  eyebrow: {
    fontSize: 8,
    color: FOREST,
    letterSpacing: 1.6,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: { fontSize: 28, fontFamily: "Times-Italic", color: INK, marginBottom: 4 },
  ref: { fontSize: 18, fontFamily: "Times-Italic", color: FOREST },
  rule: { borderBottom: `0.5pt solid ${RULE}`, marginVertical: 18 },
  ruleThick: { borderBottom: `1pt solid ${INK}`, marginVertical: 14 },
  twoCol: { flexDirection: "row", marginTop: 4, columnGap: 32 },
  col: { flex: 1 },
  label: {
    fontSize: 7.5,
    color: FOREST,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 3,
  },
  value: { fontSize: 11, color: INK },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 6,
    borderTop: `0.5pt solid ${RULE}`,
    borderBottom: `0.5pt solid ${RULE}`,
    fontSize: 7.5,
    color: FOREST,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottom: `0.3pt solid ${RULE}`,
  },
  c1: { flex: 4 },
  c2: { flex: 1, textAlign: "right" },
  c3: { flex: 1.4, textAlign: "right" },
  c4: { flex: 1.6, textAlign: "right", fontFamily: "Times-Italic" },
  totals: { marginTop: 12, alignItems: "flex-end" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
    paddingVertical: 4,
  },
  totalLabel: {
    fontSize: 7.5,
    color: FOREST,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  totalValue: { fontSize: 11, fontFamily: "Times-Italic" },
  grandRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: 280,
    paddingTop: 8,
    marginTop: 4,
    borderTop: `0.5pt solid ${INK}`,
  },
  grandLabel: {
    fontSize: 9,
    color: FOREST,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  grandValue: { fontSize: 22, fontFamily: "Times-Italic" },
  footer: {
    marginTop: 32,
    paddingTop: 14,
    borderTop: `0.5pt solid ${RULE}`,
    fontSize: 9,
    color: MUTED,
    fontFamily: "Times-Italic",
    textAlign: "center",
  },
  // QR-bill page (perforated payment slip — Swiss standard)
  qrSheet: {
    width: 595, // A4 width in pt
    height: 297, // QR-bill takes the bottom 105mm = 297pt
    flexDirection: "row",
    borderTop: `0.5pt dashed ${INK}`,
  },
  receiptStub: {
    width: 175, // 62mm
    padding: 14,
    borderRight: `0.5pt dashed ${INK}`,
  },
  paymentPart: { width: 420, padding: 14, flexDirection: "row" },
  paymentLeft: { width: 200 },
  paymentRight: { width: 200, paddingLeft: 12 },
  qrTitle: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 8 },
  qrSection: { marginBottom: 8 },
  qrLabel: { fontSize: 6, fontFamily: "Helvetica-Bold", marginBottom: 1 },
  qrText: { fontSize: 8, fontFamily: "Helvetica" },
  qrAmount: { fontSize: 9, fontFamily: "Helvetica" },
  qrImage: { width: 130, height: 130, marginVertical: 8 },
});

function fmt(d: Date, locale: Locale): string {
  return d.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BookingInvoicePdf({ data }: { data: BookingInvoiceData }) {
  const t = T[data.locale];
  const nights = data.items.reduce((sum, i) => sum + i.nights, 0);

  return (
    <Document
      title={`${t.title} ${data.reference}`}
      author={data.business.name}
    >
      <Page size="A4" style={s.page}>
        {/* Top strip */}
        <View style={s.topStrip}>
          <Text>{data.business.name}</Text>
          <Text>
            {data.business.street} · {data.business.zip} {data.business.city}
          </Text>
        </View>

        {/* Hero */}
        <View style={s.hero}>
          <View style={s.heroLeft}>
            <Text style={s.eyebrow}>{t.subtitle}</Text>
            <Text style={s.h1}>{t.title}</Text>
          </View>
          <View style={s.heroRight}>
            <Text style={s.eyebrow}>{t.invoiceNo}</Text>
            <Text style={s.ref}>{data.reference}</Text>
            <Text style={[s.eyebrow, { marginTop: 8 }]}>{t.issueDate}</Text>
            <Text>{fmt(data.issueDate, data.locale)}</Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* Stay + bill-to */}
        <View style={s.twoCol}>
          <View style={s.col}>
            <Text style={s.label}>{t.billTo}</Text>
            <Text style={s.value}>{data.guestName}</Text>
            {data.guestStreet && <Text>{data.guestStreet}</Text>}
            {data.guestZipCity && <Text>{data.guestZipCity}</Text>}
            {data.guestCountry && <Text>{data.guestCountry}</Text>}
            <Text style={{ fontStyle: "italic", color: MUTED, marginTop: 4 }}>
              {data.guestEmail}
            </Text>
          </View>
          <View style={s.col}>
            <Text style={s.label}>{t.stay}</Text>
            <Text>
              {fmt(data.checkIn, data.locale)} → {fmt(data.checkOut, data.locale)}
            </Text>
            <Text style={{ marginTop: 6, color: MUTED }}>
              {nights} {t.nights} · {data.adults}
              {data.children ? ` + ${data.children}` : ""} {t.guests.toLowerCase()}
            </Text>
          </View>
        </View>

        <View style={s.rule} />

        {/* Line items */}
        <View style={s.tableHeader}>
          <Text style={s.c1}>{t.description}</Text>
          <Text style={s.c2}>{t.qty}</Text>
          <Text style={s.c3}>{t.unitPrice}</Text>
          <Text style={s.c4}>{t.lineTotal}</Text>
        </View>

        {/* Rooms */}
        <Text
          style={{
            ...s.label,
            marginTop: 12,
            marginBottom: 4,
            paddingTop: 4,
          }}
        >
          {t.rooms}
        </Text>
        {data.items.map((it, i) => (
          <View key={i} style={s.row}>
            <Text style={s.c1}>{it.roomName}</Text>
            <Text style={s.c2}>{it.nights}</Text>
            <Text style={s.c3}>CHF {formatQrAmount(it.unitPriceRappen)}</Text>
            <Text style={s.c4}>CHF {formatQrAmount(it.lineTotalRappen)}</Text>
          </View>
        ))}

        {/* Extras */}
        {data.extras.length > 0 && (
          <>
            <Text
              style={{
                ...s.label,
                marginTop: 12,
                marginBottom: 4,
              }}
            >
              {t.extras}
            </Text>
            {data.extras.map((ex, i) => (
              <View key={i} style={s.row}>
                <Text style={s.c1}>{ex.name}</Text>
                <Text style={s.c2}>{ex.quantity}</Text>
                <Text style={s.c3}>CHF {formatQrAmount(ex.unitPriceRappen)}</Text>
                <Text style={s.c4}>CHF {formatQrAmount(ex.lineTotalRappen)}</Text>
              </View>
            ))}
          </>
        )}

        {/* Totals */}
        <View style={s.totals}>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>{t.subtotal}</Text>
            <Text style={s.totalValue}>
              CHF {formatQrAmount(data.subtotalRappen)}
            </Text>
          </View>
          <View style={s.totalRow}>
            <Text style={s.totalLabel}>{t.deposit}</Text>
            <Text style={s.totalValue}>
              CHF {formatQrAmount(data.depositRappen)}
            </Text>
          </View>
          <View style={s.grandRow}>
            <Text style={s.grandLabel}>{t.total}</Text>
            <Text style={s.grandValue}>{formatQrAmount(data.totalRappen)}</Text>
          </View>
        </View>

        <Text style={s.footer}>{t.footer}</Text>
      </Page>

      {/* QR-bill page */}
      {data.qrDataUrl && (
        <Page size="A4" style={s.pageQr}>
          {/* spacer top */}
          <View style={{ height: 595 - 297, padding: 24 }}>
            <Text style={s.qrTitle}>
              {t.payment}
            </Text>
            <Text style={{ fontSize: 9, marginTop: 4 }}>
              {t.payDeposit} {formatQrAmount(data.depositRappen)} —{" "}
              {t.qrHint}
            </Text>
          </View>

          <View style={s.qrSheet}>
            {/* RECEIPT STUB (left, 62mm) */}
            <View style={s.receiptStub}>
              <Text style={s.qrTitle}>{t.receiptStub}</Text>

              <View style={s.qrSection}>
                <Text style={s.qrLabel}>{t.accountPayableTo}</Text>
                <Text style={s.qrText}>{formatIban(data.business.iban)}</Text>
                <Text style={s.qrText}>{data.business.accountHolder}</Text>
                <Text style={s.qrText}>{data.business.street}</Text>
                <Text style={s.qrText}>
                  {data.business.zip} {data.business.city}
                </Text>
              </View>

              <View style={s.qrSection}>
                <Text style={s.qrLabel}>{t.payableBy}</Text>
                <Text style={s.qrText}>{data.guestName}</Text>
                {data.guestStreet && <Text style={s.qrText}>{data.guestStreet}</Text>}
                {data.guestZipCity && <Text style={s.qrText}>{data.guestZipCity}</Text>}
              </View>

              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View>
                  <Text style={s.qrLabel}>{t.currency}</Text>
                  <Text style={s.qrAmount}>CHF</Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={s.qrLabel}>{t.amount}</Text>
                  <Text style={s.qrAmount}>{formatQrAmount(data.depositRappen)}</Text>
                </View>
              </View>
            </View>

            {/* PAYMENT PART (right, 148mm) */}
            <View style={s.paymentPart}>
              <View style={s.paymentLeft}>
                <Text style={s.qrTitle}>{t.paymentPart}</Text>
                {data.qrDataUrl && (
                  <Image src={data.qrDataUrl} style={s.qrImage} />
                )}
                <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                  <View>
                    <Text style={s.qrLabel}>{t.currency}</Text>
                    <Text style={s.qrAmount}>CHF</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={s.qrLabel}>{t.amount}</Text>
                    <Text style={s.qrAmount}>{formatQrAmount(data.depositRappen)}</Text>
                  </View>
                </View>
              </View>

              <View style={s.paymentRight}>
                <View style={s.qrSection}>
                  <Text style={s.qrLabel}>{t.accountPayableTo}</Text>
                  <Text style={s.qrText}>{formatIban(data.business.iban)}</Text>
                  <Text style={s.qrText}>{data.business.accountHolder}</Text>
                  <Text style={s.qrText}>{data.business.street}</Text>
                  <Text style={s.qrText}>
                    {data.business.zip} {data.business.city}
                  </Text>
                </View>

                <View style={s.qrSection}>
                  <Text style={s.qrLabel}>{t.additionalInfo}</Text>
                  <Text style={s.qrText}>{data.reference}</Text>
                </View>

                <View style={s.qrSection}>
                  <Text style={s.qrLabel}>{t.payableBy}</Text>
                  <Text style={s.qrText}>{data.guestName}</Text>
                  {data.guestStreet && <Text style={s.qrText}>{data.guestStreet}</Text>}
                  {data.guestZipCity && <Text style={s.qrText}>{data.guestZipCity}</Text>}
                </View>
              </View>
            </View>
          </View>
        </Page>
      )}
    </Document>
  );
}
