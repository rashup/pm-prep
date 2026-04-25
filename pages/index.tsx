import fs from "fs"
import path from "path"
import Link from "next/link"
import { GetStaticProps } from "next"

type Report = {
  slug: string
  company: string
  date: string
}

export default function Home({ reports, featured }: { reports: Report[], featured: Report | null }) {
  return (
    <main style={{
      maxWidth: 720,
      margin: "60px auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0 24px",
      color: "#1a1a1a"
    }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>Company Research Tool for PM Interviews</h1>
      <p style={{ color: "#888", marginBottom: 40, fontSize: 15 }}>
        Structured company research reports for product manager interviews —
        live web-sourced, inline citations, built with the Anthropic API.
      </p>

      {/* Featured sample report */}
      {featured && (
        <div style={{
          background: "#f0f7ff",
          border: "1px solid #cce0ff",
          borderRadius: 8,
          padding: "20px 24px",
          marginBottom: 40
        }}>
          <p style={{ fontSize: 12, fontWeight: 600, color: "#0070f3", marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
            Sample Report
          </p>
          <Link href={`/${featured.slug}`} style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#0070f3",
            textDecoration: "none",
            display: "block",
            marginBottom: 6
          }}>
            {featured.company} →
          </Link>
          <p style={{ fontSize: 13, color: "#666", margin: 0 }}>
            See a full report: business model, financials, products, competitors,
            product sense insights, interview talking points, and recent news.
          </p>
          <p style={{ fontSize: 13, marginTop: 10, margin: 0 }}>
            <Link href="/netflix" style={{ color: "#0070f3" }}>
              View Netflix sample report →
            </Link>
          </p>
        </div>
      )}

      {/* All reports */}
      {reports.length === 0 ? (
        <p style={{ color: "#aaa" }}>No reports yet.</p>
      ) : (
        <>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#aaa", marginBottom: 12, textTransform: "uppercase", letterSpacing: 1 }}>
            All Reports
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {reports.map((r) => (
              <li key={r.slug} style={{
                padding: "14px 0",
                borderBottom: "1px solid #eee",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}>
                <Link href={`/${r.slug}`} style={{
                  fontSize: 16,
                  fontWeight: 600,
                  color: "#0070f3",
                  textDecoration: "none"
                }}>
                  {r.company}
                </Link>
                <span style={{ color: "#aaa", fontSize: 13 }}>{r.date}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p style={{ marginTop: 60, fontSize: 12, color: "#ccc" }}>
        Built with Claude claude-opus-4-7 + live web search ·{" "}
        <a href="https://github.com/rashup/pm-prep" style={{ color: "#ccc" }}>GitHub</a>
      </p>
    </main>
  )
}

const FEATURED_SLUG = "intel"

export const getStaticProps: GetStaticProps = async () => {
  const reportsDir = path.join(process.cwd(), "reports")
  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".md"))

  const reports: Report[] = files.map((file) => {
    const slug = file.replace(".md", "")
    const content = fs.readFileSync(path.join(reportsDir, file), "utf-8")
    const lines = content.split("\n")
    const companyLine = lines[0].replace("# ", "").trim()
    const dateLine = lines[1]?.replace(/\*Generated: |\*/g, "").trim() ?? ""
    return { slug, company: companyLine, date: dateLine }
  })

  reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  const featured = reports.find((r) => r.slug === FEATURED_SLUG) ?? reports[0] ?? null

  return { props: { reports, featured } }
}
