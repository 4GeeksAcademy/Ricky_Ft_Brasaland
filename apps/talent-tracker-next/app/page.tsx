import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <section className="panel">
        <h1>Talent Tracker (Next.js)</h1>
        <p className="meta">
          This app uses Next.js routing. Open the candidates list and navigate to details without full page reloads.
        </p>
        <p>
          <Link className="back" href="/candites">
            Go to candidates list
          </Link>
        </p>
      </section>
    </main>
  );
}
