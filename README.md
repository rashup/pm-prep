# PM Interview Prep

A research tool that generates structured company reports for product manager interviews.

## What It Does

Given a company name (and optional product), it produces a report covering:

1. **Business Model** — Revenue streams and how the company makes money
2. **Financial Signals** — 10-K insights, investment priorities, risks
3. **Products** — Core products, strengths/weaknesses, focused product deep-dive if specified
4. **Competitors** — Direct and indirect
5. **Product Sense Insights** — Feature opportunities, improvements, strategic bets
6. **Interview Talking Points** — 3 sharp, opinionated insights to own in the room
7. **Recent News** — Last 30 days only, sourced from live web search
8. **Report Limitations** — What the data covers, what it doesn't, what primary research would add
9. **Sources** — Every source labeled by type (10-K, Earnings Call, News, etc.) with inline citations

## How It Works

- Built on the [Anthropic API](https://anthropic.com) using Claude claude-opus-4-7
- Live web search grounded responses — not static training data
- Inline citations on every factual claim
- Explicit handling of edge cases: private companies, ambiguous names, missing data

## Usage

```bash
# Install dependency
pip install anthropic

# Set your API key
export ANTHROPIC_API_KEY=your-key-here

# Generate a report
python generate.py "Intel"
python generate.py "Figma" "FigJam"

# Reports are saved to reports/<company-name>.md
```

## Viewing Reports

Reports are published at [yoursite.vercel.app](https://yoursite.vercel.app).

To add a new report to the site:

```bash
python generate.py "Stripe"
git add reports/stripe.md
git commit -m "Add Stripe report"
git push
```

Vercel auto-deploys on push. The site updates in ~30 seconds.

## Stack

- **Report generation**: Python + Anthropic API (Claude claude-opus-4-7 with web search)
- **Frontend**: Next.js + React Markdown
- **Hosting**: Vercel (auto-deploys from GitHub)

## Known Limitations

- Private companies have no SEC filings — financial figures will be unverified
- Paywalled sources (Bloomberg, WSJ subscribers, analyst reports) are not accessible
- Reports reflect public information only — not a substitute for talking to employees or using the product
- Data freshness depends on generation date — regenerate before each interview
