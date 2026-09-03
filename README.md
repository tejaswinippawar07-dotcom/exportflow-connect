# ExportFlow

ExportFlow is an export buyer discovery and Gmail outreach workspace built for internship evaluation. It takes a buyer record from discovery through validation, AI-style qualification, campaign preview, safe send processing, email logging, and CSV reporting.

## What is included

- Dashboard KPIs for total buyers, valid contacts, priority leads, sends, failures, duplicates, and skipped records.
- Buyer data room with search, filters, manual entry, CSV import, validation, duplicate detection, and CSV export.
- Discovery briefs for products, categories, countries, buyer types, and compliant research sources.
- Lead classification queue with buyer type, priority, and a short reason.
- Campaign builder with personalized subject/body, audience targeting, sending limit, delay, attachment, and campaign status.
- Full email preview and safe demo-mode campaign processing.
- Duplicate prevention using normalized email and campaign/buyer checks.
- Email audit logs for sent and skipped activity, with failed status support.
- Report summary with readiness score and downloadable CSV.
- Settings surfaces for Gmail OAuth and server-side AI readiness.

## Technology

- React 19 + TypeScript
- TanStack Start and TanStack Router
- Tailwind CSS v4 with semantic design tokens
- Lucide icons and Sonner notifications
- Lovable Cloud database schema for buyers, products, campaigns, targets, attachments, classifications, and email logs

## Data model

The backend schema includes `buyers`, `products`, `campaigns`, `campaign_targets`, `attachments`, `ai_classifications`, and `email_logs`. Each table is protected by row-level ownership policies and grants for signed-in workspace access. Buyer records include normalized email, validation status, contact status, classification, priority, source, product, and last-contacted timestamp.

## Demo mode

The first screen includes clearly marked DEMO DATA so the workflow can be evaluated immediately without sending real email. The campaign action records sent/skipped activity in the in-app audit trail and never contacts a recipient. The demo dataset intentionally includes valid, invalid, incomplete, duplicate, high-priority, and already-contacted records.

## Run locally

```bash
bun install
bun run dev
```

Then open the local preview URL shown by Vite. Use the left navigation to walk through the demonstration flow:

1. Review the dashboard and open Buyer records.
2. Click Validate data to normalize email addresses and re-check record quality.
3. Open AI classification and classify individual buyers or the eligible queue.
4. Open Campaigns, edit the campaign content, and review the personalized preview.
5. Run the campaign to record safe sent/skipped outcomes.
6. Review Email logs and export the campaign report from Reports.

## Production integrations

The Lovable Cloud schema is ready for authenticated persistence. Gmail should be connected with Google OAuth, with tokens kept server-side and no password collection. A production sender should enforce Gmail limits and retry temporary failures. AI credentials must be read only by server-side functions; never place provider secrets in frontend code.