import anthropic
import sys
from pathlib import Path
from datetime import datetime

SYSTEM_PROMPT = """
You are a PM interview preparation agent. When given a company name and optional product,
generate a structured research report with the following sections:

1. BUSINESS MODEL — How the company makes money, key revenue streams
2. FINANCIAL SIGNALS — Key insights from 10-K/filings, where they're investing, risks and concerns
3. PRODUCTS — Core products and their purpose, strengths and weaknesses. If a specific product
   is provided, write a focused summary of that product including what a PM should know.
4. COMPETITORS — Direct and indirect competitors
5. PRODUCT SENSE INSIGHTS — Opportunities for new features, potential improvements, strategic bets
6. INTERVIEW TALKING POINTS — Exactly 3 sharp, opinionated insights the user can own
   in the room. Not generic — specific, defensible, and surprising where possible.
7. RECENT NEWS — Anything newsworthy from the last 30 days only. Use web search with
   a date filter. If nothing significant found, say so explicitly.
8. REPORT LIMITATIONS — Always include this section at the end:
   - Date generated and why that matters for data freshness
   - Which source types were used (SEC filings, earnings calls, press releases, news)
   - Which source types were NOT accessible (paywalled analyst reports, private data, etc.)
   - Any specific sections where data was unavailable or marked unverified
   - What this report does not replace: talking to employees, using the product, reading customer reviews
9. SOURCES — A labeled list of every source used, formatted as:
   - [Source Type] [Publication](URL) — what it was used for
   Source type labels to use: 10-K/Filing | Earnings Call | Company Newsroom | News | Analyst Report

SOURCING RULES:
- Cite sources INLINE immediately after each factual claim using markdown links
  Example: "Revenue grew 22% YoY ([Intel Q1 2026 Earnings](https://...)) driven by data center demand."
- Every financial figure, market share stat, and product claim must have an inline citation
- Run at minimum 4 targeted web searches:
  (1) financials and 10-K filings
  (2) strategy, products, and roadmap
  (3) competitors and market share
  (4) recent news with explicit 30-day date filter
- If you cannot find a source for a claim, mark it [unverified] — never fabricate
- Never invent financial figures. Write "data unavailable" rather than guess.
- For Recent News: only include items with a confirmed published date from web search

CORNER CASES TO HANDLE EXPLICITLY:
- If the company is private (no public filings): state this clearly, use news/press only, flag all figures as unverified
- If the company name is ambiguous (e.g. "Apple" could be multiple companies): confirm which one at the top
- If a product name doesn't clearly match the company: flag it before generating
- If recent news search returns nothing meaningful: say "No significant news in the last 30 days" — do not fill with older news
- If a section has insufficient data: write "Insufficient public data available" rather than padding with generalities

STYLE:
- Be concise, specific, and opinionated. No filler. No generic observations.
- Format output as clean markdown with clear section headers (##)
- Use tables where comparisons are cleaner than prose
"""

def generate_report(company: str, product: str = None):
    client = anthropic.Anthropic()

    prompt = f"Company: {company}"
    if product:
        prompt += f"\nProduct: {product}"

    slug = company.lower().replace(" ", "-")
    output_path = Path(f"reports/{slug}.md")
    Path("reports").mkdir(exist_ok=True)

    print(f"\nGenerating report for: {company}" + (f" / {product}" if product else ""))
    print("=" * 60)

    date_str = datetime.now().strftime("%B %d, %Y")
    header = f"# {company}" + (f" — {product}" if product else "") + "\n"
    header += f"*Generated: {date_str}*\n\n"
    report = header

    with client.messages.stream(
        model="claude-opus-4-7",
        max_tokens=4096,
        tools=[
            {"type": "web_search_20260209", "name": "web_search"},
            {"type": "web_fetch_20260209", "name": "web_fetch"},
        ],
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": prompt}],
    ) as stream:
        for text in stream.text_stream:
            print(text, end="", flush=True)
            report += text

    output_path.write_text(report, encoding="utf-8")
    print(f"\n\n✓ Saved to {output_path}")
    print(f"\nNext steps:")
    print(f"  git add reports/{slug}.md")
    print(f"  git commit -m 'Add {company} report'")
    print(f"  git push")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python generate.py \"Company Name\" [\"Product Name\"]")
        print("Examples:")
        print("  python generate.py \"Intel\"")
        print("  python generate.py \"Figma\" \"FigJam\"")
        sys.exit(1)

    company = sys.argv[1]
    product = sys.argv[2] if len(sys.argv) > 2 else None
    generate_report(company, product)
