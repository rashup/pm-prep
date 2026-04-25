import fs from "fs"
import path from "path"
import Link from "next/link"
import { GetStaticProps } from "next"

type Report = {
  slug: string
  company: string
  date: string
}

export default function Home({ reports }: { reports: Report[] }) {
  return (
    <main style={{
      maxWidth: 720,
      margin: "60px auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0 24px",
      color: "#1a1a1a"
    }}>
      <h1 style={{ fontSize: 26, fontWeight: 700, marginBottom: 6 }}>PM Interview Prep</h1>
      <p style={{ color: "#888", marginBottom: 40, fontSize: 15 }}>
        Company research reports
      </p>

      {reports.length === 0 ? (
        <p style={{ color: "#aaa" }}>
          No reports yet. Run <code style={{ background: "#f4f4f4", padding: "2px 6px", borderRadius: 4 }}>
            python generate.py "Company"
          </code>
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {reports.map((r) => (
            <li key={r.slug} style={{
              padding: "16px 0",
              borderBottom: "1px solid #eee",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <Link href={`/${r.slug}`} style={{
                fontSize: 17,
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
      )}
    </main>
  )
}

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

  return { props: { reports } }
}
