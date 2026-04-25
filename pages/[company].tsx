import fs from "fs"
import path from "path"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Link from "next/link"
import { GetStaticProps, GetStaticPaths } from "next"

export default function ReportPage({ content }: { content: string }) {
  return (
    <main style={{
      maxWidth: 760,
      margin: "40px auto",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      padding: "0 24px",
      color: "#1a1a1a"
    }}>
      <Link href="/" style={{ color: "#888", fontSize: 14, textDecoration: "none" }}>
        ← All reports
      </Link>
      <article style={{ marginTop: 28, lineHeight: 1.75 }}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => (
              <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 4 }}>{children}</h1>
            ),
            h2: ({ children }) => (
              <h2 style={{
                fontSize: 18,
                fontWeight: 700,
                marginTop: 40,
                marginBottom: 12,
                paddingBottom: 6,
                borderBottom: "2px solid #eee"
              }}>{children}</h2>
            ),
            h3: ({ children }) => (
              <h3 style={{ fontSize: 16, fontWeight: 600, marginTop: 24 }}>{children}</h3>
            ),
            p: ({ children }) => (
              <p style={{ marginBottom: 14, fontSize: 15 }}>{children}</p>
            ),
            li: ({ children }) => (
              <li style={{ marginBottom: 6, fontSize: 15 }}>{children}</li>
            ),
            table: ({ children }) => (
              <div style={{ overflowX: "auto", margin: "20px 0" }}>
                <table style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: 14,
                  border: "1px solid #e0e0e0",
                  borderRadius: 6,
                }}>{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th style={{
                background: "#f7f7f7",
                padding: "10px 14px",
                textAlign: "left",
                borderBottom: "2px solid #ddd",
                borderRight: "1px solid #e0e0e0",
                fontWeight: 600,
                whiteSpace: "nowrap"
              }}>{children}</th>
            ),
            td: ({ children }) => (
              <td style={{
                padding: "9px 14px",
                borderBottom: "1px solid #eee",
                borderRight: "1px solid #eee",
                verticalAlign: "top"
              }}>{children}</td>
            ),
            code: ({ children }) => (
              <code style={{
                background: "#f4f4f4",
                padding: "2px 6px",
                borderRadius: 4,
                fontSize: 13
              }}>{children}</code>
            ),
            blockquote: ({ children }) => (
              <blockquote style={{
                borderLeft: "3px solid #0070f3",
                paddingLeft: 16,
                margin: "20px 0",
                color: "#555"
              }}>{children}</blockquote>
            ),
            em: ({ children }) => (
              <em style={{ color: "#666" }}>{children}</em>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </main>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const reportsDir = path.join(process.cwd(), "reports")
  const files = fs.readdirSync(reportsDir).filter((f) => f.endsWith(".md"))
  return {
    paths: files.map((f) => ({ params: { company: f.replace(".md", "") } })),
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.company as string
  const filePath = path.join(process.cwd(), "reports", `${slug}.md`)
  const content = fs.readFileSync(filePath, "utf-8")
  return { props: { content, slug } }
}
