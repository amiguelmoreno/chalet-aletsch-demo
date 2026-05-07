import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Text,
  Heading,
  Hr,
  Row,
  Column,
  Preview,
} from "@react-email/components";
import { format } from "date-fns";
import { de as deLocale } from "date-fns/locale";

type BookingForEmail = {
  reference: string;
  guestName: string;
  locale: string;
  checkIn: Date;
  checkOut: Date;
  adults: number;
  children: number;
  total: number | { toString(): string };
  depositAmount: number | { toString(): string };
  items: Array<{
    nights: number;
    lineTotal: number | { toString(): string };
    room: { roomType: { nameDe: string; nameEn: string } };
  }>;
  extras: Array<{
    quantity: number;
    lineTotal: number | { toString(): string };
    experience: { nameDe: string; nameEn: string };
  }>;
};

const colors = {
  parchment: "#FBF8F1",
  ink: "#1F1E18",
  forest: "#2A3F2C",
  rule: "rgba(169, 159, 138, 0.55)",
  muted: "#5C5749",
};

export function BookingConfirmationEmail({ booking }: { booking: BookingForEmail }) {
  const isEN = booking.locale === "en";
  const t = isEN
    ? {
        preview: `Your reservation at Chalet Aletsch — ${booking.reference}`,
        eyebrow: "Reservation confirmed",
        title: `A letter to ${booking.guestName}`,
        intro:
          "Many thanks for your reservation. We have noted everything below. The deposit details will follow in a separate letter; until then, no payment is required.",
        ref: "Reference",
        stay: "Stay",
        guests: "Guests",
        room: "Room",
        nights: "nights",
        extras: "Extras",
        deposit: "Deposit (30%)",
        total: "Total",
        signoff: "We look forward to your arrival.",
        signature: "Annelies Imboden-Truffer",
        houseLine: "Chalet Aletsch · Furkastrasse 14 · 3987 Riederalp · Wallis",
      }
    : {
        preview: `Ihre Reservation im Chalet Aletsch — ${booking.reference}`,
        eyebrow: "Reservation bestätigt",
        title: `Ein Brief an ${booking.guestName}`,
        intro:
          "Vielen Dank für Ihre Reservation. Wir haben alles unten festgehalten. Die Angaben zur Anzahlung folgen in einem separaten Brief; bis dahin ist keine Zahlung notwendig.",
        ref: "Referenz",
        stay: "Aufenthalt",
        guests: "Gäste",
        room: "Stube",
        nights: "Nächte",
        extras: "Erweiterungen",
        deposit: "Anzahlung (30%)",
        total: "Gesamt",
        signoff: "Wir freuen uns auf Sie.",
        signature: "Annelies Imboden-Truffer",
        houseLine: "Chalet Aletsch · Furkastrasse 14 · 3987 Riederalp · Wallis",
      };

  const dateLocale = isEN ? undefined : deLocale;
  const fmtDate = (d: Date) => format(d, "EEEE, d. MMMM yyyy", { locale: dateLocale });

  return (
    <Html>
      <Head />
      <Preview>{t.preview}</Preview>
      <Body style={{ backgroundColor: colors.parchment, color: colors.ink, fontFamily: "Georgia, 'EB Garamond', serif", margin: 0 }}>
        <Container style={{ maxWidth: 580, margin: "0 auto", padding: "40px 28px" }}>
          <Section style={{ textAlign: "center", paddingBottom: 32 }}>
            <Text style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.forest, margin: 0 }}>
              {t.eyebrow}
            </Text>
            <Heading style={{ fontFamily: "Georgia, serif", fontStyle: "italic", fontWeight: 400, fontSize: 30, marginTop: 12, marginBottom: 0, color: colors.ink }}>
              {t.title}
            </Heading>
          </Section>

          <Hr style={{ borderColor: colors.rule, borderTop: `1px solid ${colors.rule}` }} />

          <Section style={{ paddingTop: 28, paddingBottom: 16 }}>
            <Text style={{ fontSize: 16, lineHeight: 1.7, color: colors.muted, marginTop: 0 }}>
              {t.intro}
            </Text>
          </Section>

          <Section style={{ paddingTop: 8, paddingBottom: 8 }}>
            <Field label={t.ref} value={booking.reference} />
            <Field
              label={t.stay}
              value={`${fmtDate(booking.checkIn)} → ${fmtDate(booking.checkOut)}`}
            />
            <Field
              label={t.guests}
              value={`${booking.adults}${booking.children ? ` + ${booking.children}` : ""}`}
            />
          </Section>

          <Hr style={{ borderColor: colors.rule, borderTop: `1px solid ${colors.rule}`, marginTop: 18 }} />

          {/* Room ledger */}
          <Section style={{ paddingTop: 18 }}>
            <Text style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.forest, margin: "0 0 12px" }}>
              {t.room}
            </Text>
            {booking.items.map((item, i) => (
              <Row key={i} style={{ marginBottom: 8 }}>
                <Column>
                  <Text style={{ margin: 0, color: colors.ink, fontSize: 17 }}>
                    {isEN ? item.room.roomType.nameEn : item.room.roomType.nameDe}
                    <span style={{ color: colors.muted, fontSize: 14 }}>
                      {" "}· {item.nights} {t.nights}
                    </span>
                  </Text>
                </Column>
                <Column align="right">
                  <Text style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 17, color: colors.ink }}>
                    CHF {Math.round(Number(item.lineTotal))}
                  </Text>
                </Column>
              </Row>
            ))}
          </Section>

          {booking.extras.length > 0 && (
            <Section style={{ paddingTop: 14 }}>
              <Text style={{ fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.forest, margin: "0 0 10px" }}>
                {t.extras}
              </Text>
              {booking.extras.map((e, i) => (
                <Row key={i} style={{ marginBottom: 6 }}>
                  <Column>
                    <Text style={{ margin: 0, color: colors.ink, fontSize: 16 }}>
                      {isEN ? e.experience.nameEn : e.experience.nameDe}
                      <span style={{ color: colors.muted }}> × {e.quantity}</span>
                    </Text>
                  </Column>
                  <Column align="right">
                    <Text style={{ margin: 0, fontFamily: "Georgia, serif", fontSize: 16, color: colors.ink }}>
                      CHF {Math.round(Number(e.lineTotal))}
                    </Text>
                  </Column>
                </Row>
              ))}
            </Section>
          )}

          <Hr style={{ borderColor: colors.rule, borderTop: `1px solid ${colors.rule}`, marginTop: 22 }} />

          <Section style={{ paddingTop: 14 }}>
            <Row>
              <Column>
                <Text style={{ margin: 0, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.forest }}>
                  {t.deposit}
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: 17, fontFamily: "Georgia, serif", color: colors.ink }}>
                  CHF {Math.round(Number(booking.depositAmount))}
                </Text>
              </Column>
            </Row>
            <Row style={{ marginTop: 4 }}>
              <Column>
                <Text style={{ margin: 0, fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase", color: colors.forest }}>
                  {t.total}
                </Text>
              </Column>
              <Column align="right">
                <Text style={{ margin: 0, fontSize: 22, fontFamily: "Georgia, serif", color: colors.ink }}>
                  CHF {Math.round(Number(booking.total))}
                </Text>
              </Column>
            </Row>
          </Section>

          <Hr style={{ borderColor: colors.rule, borderTop: `1px solid ${colors.rule}`, marginTop: 26 }} />

          <Section style={{ paddingTop: 24, textAlign: "center" }}>
            <Text style={{ margin: 0, color: colors.muted, fontSize: 15 }}>{t.signoff}</Text>
            <Text style={{ marginTop: 14, fontFamily: "Georgia, serif", fontStyle: "italic", color: colors.ink, fontSize: 17 }}>
              {t.signature}
            </Text>
          </Section>

          <Section style={{ paddingTop: 30, textAlign: "center" }}>
            <Text style={{ fontSize: 11, color: colors.muted, letterSpacing: "0.18em", textTransform: "uppercase", margin: 0 }}>
              {t.houseLine}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <Row style={{ marginBottom: 8 }}>
      <Column style={{ width: "32%" }}>
        <Text style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: colors.forest }}>
          {label}
        </Text>
      </Column>
      <Column>
        <Text style={{ margin: 0, color: colors.ink, fontSize: 16 }}>{value}</Text>
      </Column>
    </Row>
  );
}
