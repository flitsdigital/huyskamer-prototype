import Link from "next/link";

// ponytail: placeholder privacyverklaring — vervang door definitieve juridische tekst.
export default function PrivacyPage() {
  return (
    <main className="page">
      <div className="container stack">
        <div className="stack-sm">
          <span className="eyebrow-light">De Huyskamer</span>
          <h1 className="title">Privacyverklaring</h1>
        </div>
        <div className="card stack-sm body-light">
          <p>
            <strong>Let op:</strong> dit is een voorbeeldtekst voor de testfase. De definitieve
            privacyverklaring wordt nog aangeleverd.
          </p>
          <p>
            Voor het spaarprogramma slaan we je naam, e-mailadres en/of telefoonnummer en je
            spaar- en bestedingshistorie op. We gebruiken deze gegevens uitsluitend om je
            puntensaldo bij te houden en beloningen te kunnen verstrekken.
          </p>
          <p>
            Je kunt je gegevens op elk moment inzien in de app en je account zelf verwijderen via
            de knop &ldquo;Account verwijderen&rdquo; op je spaarkaart. Bij verwijdering wissen we
            je profiel en je transactiehistorie.
          </p>
          <p className="muted-light">
            <Link href="/" className="link-underline">
              Terug
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
