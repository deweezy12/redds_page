import { Link } from "wouter";

type LegalPageProps = {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
};

function LegalLayout({ title, eyebrow, children }: LegalPageProps) {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10 md:px-10 md:py-14">
      <div className="mx-auto flex max-w-3xl flex-col gap-10">
        <div className="flex items-center justify-between gap-4 text-sm text-white/50">
          <Link href="/" className="inline-flex items-center gap-2 transition-colors hover:text-white">
            <span aria-hidden="true">←</span>
            <span>Back to home</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/impressum" className="transition-colors hover:text-white">
              Impressum
            </Link>
            <Link href="/datenschutz" className="transition-colors hover:text-white">
              Datenschutz
            </Link>
          </div>
        </div>

        <header className="space-y-4 border-b border-white/10 pb-8">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-white/35">{eyebrow}</p>
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">{title}</h1>
        </header>

        <div className="space-y-10 text-sm leading-8 text-white/78">{children}</div>
      </div>
    </main>
  );
}

function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold text-white">{heading}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function LegalParagraph({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}

export function ImpressumPage() {
  return (
    <LegalLayout title="Impressum" eyebrow="Pflichtangaben">
      <LegalSection heading="Angaben gemaess § 5 DDG">
        <LegalParagraph>
          Oliver Jan Jarosik
          <br />
          Eisenacher Straße 123
          <br />
          10777 Berlin
          <br />
          Deutschland
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Kontakt">
        <LegalParagraph>
          E-Mail:{" "}
          <a className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white" href="mailto:O.Jarosik@gmx.net">
            O.Jarosik@gmx.net
          </a>
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Beruflicher Auftritt">
        <LegalParagraph>
          Diese Website dient der beruflichen Darstellung von Oliver Jan Jarosik als Computer Vision Engineer und
          AI Engineer.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Haftung fuer Inhalte">
        <LegalParagraph>
          Die Inhalte dieser Website wurden mit groesstmoeglicher Sorgfalt erstellt. Fuer die Richtigkeit,
          Vollstaendigkeit und Aktualitaet der Inhalte wird jedoch keine Gewaehr uebernommen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Haftung fuer Links">
        <LegalParagraph>
          Diese Website enthaelt Links zu externen Websites Dritter, auf deren Inhalte kein Einfluss besteht.
          Deshalb kann fuer diese fremden Inhalte auch keine Gewaehr uebernommen werden. Fuer die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="Urheberrecht">
        <LegalParagraph>
          Die durch den Seitenbetreiber erstellten Inhalte und Werke auf dieser Website unterliegen dem deutschen
          Urheberrecht. Eine Vervielfaeltigung, Bearbeitung, Verbreitung und jede Art der Verwertung ausserhalb der
          Grenzen des Urheberrechts beduerfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
        </LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}

export function DatenschutzPage() {
  return (
    <LegalLayout title="Datenschutzerklaerung" eyebrow="Datenschutz">
      <LegalSection heading="1. Verantwortlicher">
        <LegalParagraph>
          Oliver Jan Jarosik
          <br />
          Eisenacher Straße 123
          <br />
          10777 Berlin
          <br />
          Deutschland
        </LegalParagraph>
        <LegalParagraph>
          E-Mail:{" "}
          <a className="underline decoration-white/25 underline-offset-4 transition-colors hover:text-white" href="mailto:O.Jarosik@gmx.net">
            O.Jarosik@gmx.net
          </a>
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="2. Allgemeines zur Datenverarbeitung">
        <LegalParagraph>
          Diese Website verarbeitet personenbezogene Daten nur, soweit dies fuer die Bereitstellung der Website,
          die Kommunikationsmoeglichkeiten und die technische Sicherheit erforderlich ist.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="3. Bereitstellung der Website und Server-Logfiles">
        <LegalParagraph>
          Beim Aufruf dieser Website erhebt der Hosting-Anbieter automatisch technisch erforderliche Daten in
          Server-Logfiles. Dazu koennen insbesondere gehoeren:
        </LegalParagraph>
        <LegalList
          items={[
            "IP-Adresse",
            "Datum und Uhrzeit des Zugriffs",
            "angeforderte Datei bzw. URL",
            "Referrer-URL",
            "Browsertyp und Browserversion",
            "Betriebssystem",
          ]}
        />
        <LegalParagraph>
          Die Verarbeitung erfolgt zur Sicherstellung eines stabilen und sicheren Betriebs der Website auf Grundlage
          von Art. 6 Abs. 1 lit. f DSGVO.
        </LegalParagraph>
        <LegalParagraph>
          Hosting-Anbieter: GitHub, Inc., 88 Colin P Kelly Jr St, San Francisco, CA 94107, USA
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="4. Extern geladene Schriftarten">
        <LegalParagraph>
          In der aktuellen Implementierung werden Schriftarten ueber Google Fonts von Servern von Google geladen.
          Dabei kann insbesondere die IP-Adresse an Google uebermittelt werden.
        </LegalParagraph>
        <LegalParagraph>
          Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO, sofern die Einbindung fuer eine konsistente Darstellung
          der Website erfolgt. Wenn du die Fonts spaeter lokal hostest, kann dieser Abschnitt entsprechend gekuerzt
          oder angepasst werden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="5. Kontaktaufnahme per E-Mail">
        <LegalParagraph>
          Bei einer Kontaktaufnahme per E-Mail werden die uebermittelten Daten ausschliesslich zur Bearbeitung der
          Anfrage verwendet. Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, sofern die Anfrage auf den Abschluss
          oder die Durchfuehrung eines Vertrags gerichtet ist, andernfalls Art. 6 Abs. 1 lit. f DSGVO.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="6. Externe Links und Profile">
        <LegalParagraph>
          Diese Website verlinkt auf externe Profile und Inhalte, insbesondere LinkedIn, GitHub, Instagram sowie
          auf ein PDF-Dokument. Beim blossen Besuch dieser Website werden diese externen Dienste nicht automatisch
          eingebunden; eine Datenuebermittlung erfolgt in der Regel erst beim aktiven Anklicken des jeweiligen
          Links.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="7. Cookies und Tracking">
        <LegalParagraph>
          Nach aktuellem Stand verwendet diese Website keine eigenen Analyse-, Marketing- oder Tracking-Tools. Es
          wird kein Cookie-Banner eingesetzt. Falls spaeter einwilligungspflichtige Technologien eingebunden werden,
          muessen diese Datenschutzerklaerung und das Consent-Setup angepasst werden.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="8. Speicherdauer">
        <LegalParagraph>
          Personenbezogene Daten werden nur so lange gespeichert, wie dies fuer die genannten Zwecke erforderlich
          ist oder gesetzliche Aufbewahrungspflichten bestehen.
        </LegalParagraph>
      </LegalSection>

      <LegalSection heading="9. Rechte betroffener Personen">
        <LegalParagraph>Betroffene Personen haben insbesondere folgende Rechte:</LegalParagraph>
        <LegalList
          items={[
            "Recht auf Auskunft gemaess Art. 15 DSGVO",
            "Recht auf Berichtigung gemaess Art. 16 DSGVO",
            "Recht auf Loeschung gemaess Art. 17 DSGVO",
            "Recht auf Einschraenkung der Verarbeitung gemaess Art. 18 DSGVO",
            "Recht auf Datenuebertragbarkeit gemaess Art. 20 DSGVO",
            "Widerspruchsrecht gemaess Art. 21 DSGVO",
            "Beschwerderecht bei einer Datenschutz-Aufsichtsbehoerde",
          ]}
        />
      </LegalSection>

      <LegalSection heading="10. Stand">
        <LegalParagraph>Stand dieser Datenschutzerklaerung: 6. April 2026</LegalParagraph>
      </LegalSection>
    </LegalLayout>
  );
}
