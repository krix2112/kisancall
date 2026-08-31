<div align="center">

# KisanCall

### Voice-First Procurement Coordination with a Verifiable Proof Layer

[![Typing SVG](https://readme-typing-svg.demolab.com/?font=Fira+Code&size=20&pause=1200&color=58A6FF&center=true&vCenter=true&width=650&lines=Know+the+price.+Know+your+slot.;Know+your+queue.+Know+your+payment.;Have+proof+of+what+happened.)](https://git.io/typing-svg)

Built for **Smart India Hackathon 2026** · Problem Statement **26032** · Department of Consumer Affairs

![SIH2026](https://img.shields.io/badge/SIH-2026-orange?style=for-the-badge)
![Team](https://img.shields.io/badge/Team-TeenTitans-blueviolet?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-In%20Development-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</div>

---

## Problem Statement Details

| Field | Detail |
|---|---|
| **Problem Statement ID** | 26032 |
| **Title** | Farmers often face long waiting times, lack of information regarding procurement schedules, and uncertainty about procurement status. |
| **Organization** | Ministry of Consumer Affairs, Food & Public Distribution |
| **Department** | Department of Consumer Affairs (DoCA) |
| **Category** | Software |
| **Theme** | Heritage & Culture |

**Expected solution — a platform that:**
- Enables farmer registration and slot booking
- Provides real-time queue management
- Sends SMS/app notifications
- Tracks procurement and payment status
- Reduces congestion and waiting time at procurement centres

---

## Table of Contents

1. [About the Project](#about-the-project)
2. [The Problem](#the-problem)
3. [Our Solution & USP](#our-solution--usp)
4. [Feature Set](#feature-set)
5. [User Personas](#user-personas)
6. [Workflow Visualizations](#workflow-visualizations)
7. [Tech Stack](#tech-stack)
8. [System Architecture](#system-architecture)
9. [Voice AI Engineering](#voice-ai-engineering)
10. [AgroChain — The Proof Layer](#agrochain--the-proof-layer)
11. [Security & Privacy](#security--privacy)
12. [Repository Structure](#repository-structure)
13. [Getting Started](#getting-started)
14. [Roadmap](#roadmap)
15. [Impact Metrics](#impact-metrics)
16. [Team](#team)

---

## About the Project

**KisanCall** is a voice-first procurement coordination platform for agricultural mandis and government procurement centres. It gives every farmer — including those without a smartphone or reliable data connection — a single conversational way to know their registration status, their procurement slot, their live position in the queue, the day's government-reported mandi price, and the status of their payment, through a **phone call, SMS, or a lightweight app.**

Underneath the conversational layer sits **AgroChain**, a narrow blockchain-anchored proof layer that timestamps and hashes the key events of a farmer's transaction — price agreed, quantity verified, procurement completed, payment confirmed — so that once a transaction is recorded, it cannot be silently altered. AgroChain never stores personal or financial data on-chain; it only anchors a cryptographic fingerprint of each critical event.

> **The core idea in one line:** KisanCall tells the farmer what is happening; AgroChain proves what happened.

The problem isn't that Indian agriculture lacks digital systems — procurement portals, mandi trading platforms, and government dashboards already exist. The problem is that the farmer's *experience* of those systems is fragmented, requires literacy and connectivity to use, and gives no way to independently verify that a transaction record is authentic. KisanCall closes that last-mile trust and accessibility gap by sitting **above** existing procurement infrastructure, not replacing it.

| Dimension | Assessment |
|---|---|
| Core users | Smallholder and marginal farmers registering for government/mandi procurement |
| Primary interface | Outbound/inbound AI voice call, SMS fallback, lightweight mobile & web app |
| Trust layer | AgroChain — selective blockchain anchoring of transaction events |
| Deployment model | Sits above existing procurement systems; doesn't require replacing them |
| Languages at launch | Hindi and English, with a roadmap to major regional languages |
| Differentiator | One conversational journey across registration, slot, queue, price, payment, and proof |

---

## The Problem

### The Real-World Workflow

A farmer engaging with a procurement centre typically moves through the following stages, regardless of which state or scheme is involved:

1. Procurement window is announced by the government or procurement agency
2. Farmer completes registration, KYC, and crop/land verification
3. Farmer is allotted a procurement centre, token, or slot
4. Farmer travels to the centre — often without a reliable idea of timing
5. Gate entry and arrival registration
6. Waiting in queue, weighing, and quality assessment
7. Procurement transaction and lot/bill entry
8. Payment processing
9. Farmer repeatedly checks or travels back just to confirm payment status

Every one of these steps generates information that's useful to the farmer — but today that information is scattered across portals, SMS, staff conversations, and physical visits. **The farmer bears the cost of stitching it together.**

### Farmer Pain Points

| Pain point | What the farmer actually needs | How KisanCall responds |
|---|---|---|
| Uncertain arrival time | A clear slot and a useful arrival window | Slot confirmation call/SMS plus a reminder before the window |
| Long physical waits | Live visibility of queue position | Real-time queue position and estimated wait time, updated by voice on demand |
| Sudden schedule changes | Immediate notice without having to check anything | Proactive outbound call or SMS the moment a change is recorded |
| Price uncertainty | Current, dated, sourced mandi reference price | Government-reported price read out with date and source |
| Payment uncertainty | A plain-language status, not a portal screen | AI explains payment status in the farmer's own language |
| Low smartphone comfort | No new app or workflow to learn | Phone call is the primary channel; app is optional |
| Poor rural connectivity | A channel that still works with 2G or no data | Voice and SMS require no data connection |
| Trust in digital records | Evidence that a transaction was actually recorded as agreed | A transaction reference the farmer can quote back, anchored via AgroChain |

---

## Our Solution & USP

KisanCall is built around three ideas held together tightly:

- **Voice as the primary interface, not an add-on** — a farmer can complete every core task by receiving or making a phone call
- **Proactive communication** — the system calls the farmer *before* the farmer has to ask a question
- **Verifiable proof** — the outcome of a procurement transaction is anchored on-chain so it cannot be silently altered after the fact

| USP | Why it matters |
|---|---|
| Single conversational journey | Registration, slot, queue, price, and payment handled in one flow instead of five disconnected systems |
| Smartphone-optional by design | The primary channel is a phone call; the app and web dashboard are conveniences, not requirements |
| Proactive, not reactive | System reaches out automatically at every meaningful status change — no need to repeatedly check or travel |
| Tamper-evident transaction proof | Selected events are hashed and anchored on-chain, giving a durable, independently checkable reference — without exposing personal or bank data |
| Grounded, hallucination-resistant AI | The voice agent only ever answers from live backend data through tool calls; it never invents a price, queue position, or payment status |
| Natural-language, zero-menu voice UX | Farmers ask in their own words ("mera number kab aayega?") instead of navigating a keypad-driven IVR tree |

> *KisanCall is a procurement-centre coordination and trust layer for farmers — reachable by a simple phone call, proactive by default, and backed by tamper-evident proof of what actually happened.*

---

## Feature Set

<details>
<summary><b> Farmer-Facing Features</b></summary>

- Voice and app-based registration, with staff-assisted correction for low-connectivity users
- Slot booking and confirmation with automatic reminder calls/SMS ahead of the arrival window
- Live queue position and estimated wait time, available on demand by call or in-app
- Daily government-reported mandi reference price, always read with date and source
- Procurement status tracking through plain-language stages: **Booked → Arrived → In Queue → Procured → Payment Processing → Paid**
- Payment status explained conversationally, not just displayed as a code
- On-demand transaction/proof reference the farmer can request at any time
- Multilingual voice support, starting with Hindi and English
- SMS fallback for every major status update

</details>

<details>
<summary><b> Staff / Procurement-Centre Features</b></summary>

- Daily farmer list with pending registrations and slot capacity view
- Arrival marking and live queue management
- Procurement and quality-verification entry
- Payment status updates with an auditable trail
- Call log and outcome tracking, including farmers who couldn't be reached
- Manual override and correction tools, all logged for audit
- Direct view of the blockchain proof reference tied to each transaction

</details>

<details>
<summary><b> AI Voice Agent Features</b></summary>

- Outbound proactive calling triggered by backend status changes
- Inbound call handling for farmer-initiated queries
- **Barge-in support** — if the farmer starts speaking while the agent is talking, the agent stops immediately and listens
- Tool-first answers — every factual response is retrieved from a backend tool call, never generated from memory
- Graceful fallback to keypad input or human staff escalation after repeated recognition failures
- Compact, per-call context — the agent is given only the exact facts needed for the current conversation

</details>

<details>
<summary><b> AgroChain Proof-Layer Features</b></summary>

- Event-based anchoring for six lifecycle milestones: procurement created, quantity verified, price confirmed, procurement completed, payment initiated, payment confirmed
- Only a hash of the canonicalised event payload and its metadata is written on-chain — never personal or bank data
- Every anchored event returns a transaction reference the farmer can be given and can independently ask about
- Asynchronous, queued writes so a temporary blockchain outage never blocks the operational flow

</details>

---

## User Personas

| Persona | Profile | Needs |
|---|---|---|
| **Ramesh** — Smallholder Farmer, 47 | Owns 2 acres, grows wheat and paddy, uses a basic keypad or shared smartphone, prefers Hindi | Wants to know when to show up and when he'll get paid, without travelling to ask. Primary channel: phone call |
| **Sunita** — Smartphone Farmer, 32 | Comfortable with WhatsApp and basic apps, occasional field connectivity issues | Uses the app to check status quickly, but appreciates that a call still comes through when something changes |
| **Operator** — Centre Staff | Manages arrivals, queue, and procurement entry for 100–300 farmers a day | A fast, low-friction dashboard and a way to correct mistakes without losing the audit trail |
| **Supervisor / Admin** | Oversees multiple operators | Visibility into missed calls, queue bottlenecks, and payment delays across the day; configures slot capacity |

---

## Workflow Visualizations

### 1. Registration — One Record, Two Entry Points

Both channels write to the exact same backend endpoint, so there is no divergent "app version" and "voice version" of a farmer's record.

```mermaid
graph TD
    A[Farmer via Mobile App<br/>taps Register] --> C(POST /farmers)
    B[Farmer via Voice Call<br/>'mera naam Ramesh hai...'] --> C
    C --> D[(farmers table<br/>Supabase)]
    D --> E[Staff Dashboard 'Today' view<br/>updates instantly Realtime]
```

### 2. Slot Booking

```mermaid
graph TD
    A[Farmer picks a date/time<br/>tap in app] --> C(POST /bookings)
    B[Farmer tells the AI naturally<br/>'mujhe kal subah aana hai'] --> C
    C --> D[bookings row created — status: BOOKED<br/>token number assigned]
    D --> E((Supabase Realtime push))
    E --> F[Staff Dashboard live queue<br/>view updates]
    E --> G[Farmer app / call confirms<br/>slot + today's price]
```

### 3. Live Queue Tracking

```mermaid
graph TD
    A[BOOKED] --> B[ARRIVED]
    B --> C[IN_QUEUE]
    C --> D[PROCURED]
    
    A -.-> E
    B -.-> E
    C -.-> E
    D -.-> E
    
    E[Each transition writes a queue_events row<br/>farmer's live position + estimated wait time] --> F((Supabase Realtime))
    
    F --> G[Mobile app updates<br/>position with no<br/>manual refresh]
    F --> H[Voice AI answers<br/>'where is my number'<br/>by querying the same table]
```

### 4. Payment Tracking

```mermaid
graph TD
    A[Booking reaches PROCURED] --> B[payments row created — status: PENDING]
    B --> C[status: PROCESSING]
    C --> D[status: PAID]
    
    D --> E[Visible identically on:<br/>- Staff Dashboard<br/>- Farmer app status screen<br/>- Voice AI on request]
    D --> F[On PAID -> AgroChain transaction<br/>hashes + anchors the event as a<br/>tamper-evident proof record]
```

### 5. Reminders & Notifications

```mermaid
graph TD
    A[Backend detects an upcoming slot / a status change] --> B(Outbound call or SMS triggered automatically)
    B --> C[Call answered]
    B --> D[Call not answered]
    
    C --> E[Outcome logged to<br/>call_logs visible on<br/>dashboard's 'Recent<br/>Voice Calls' panel]
    D --> F[Automatic retry + SMS,<br/>then staff follow-up]
```

---

## Tech Stack

### Frontend

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

### Backend

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Fastify](https://img.shields.io/badge/Fastify-000000?style=for-the-badge&logo=fastify&logoColor=white)
![Turborepo](https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-F69220?style=for-the-badge&logo=pnpm&logoColor=white)

### Data Layer

![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![pgvector](https://img.shields.io/badge/pgvector-4169E1?style=for-the-badge)

### AI Voice Layer

![Groq](https://img.shields.io/badge/Groq-F55036?style=for-the-badge)
![Deepgram](https://img.shields.io/badge/Deepgram-13EF93?style=for-the-badge)
![Twilio](https://img.shields.io/badge/Twilio-F22F46?style=for-the-badge&logo=twilio&logoColor=white)

### Blockchain — AgroChain

![Solidity](https://img.shields.io/badge/Solidity-363636?style=for-the-badge&logo=solidity&logoColor=white)
![Hardhat](https://img.shields.io/badge/Hardhat-FFF100?style=for-the-badge&logo=hardhat&logoColor=black)
![Ethers.js](https://img.shields.io/badge/Ethers.js-2535A0?style=for-the-badge&logo=ethers&logoColor=white)
![Shardeum](https://img.shields.io/badge/Shardeum-00A3FF?style=for-the-badge)

### Infrastructure

![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Render](https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white)
![Sentry](https://img.shields.io/badge/Sentry-362D59?style=for-the-badge&logo=sentry&logoColor=white)

### Real Government Data

![data.gov.in](https://img.shields.io/badge/data.gov.in-138808?style=for-the-badge)
![Agmarknet](https://img.shields.io/badge/AGMARKNET-FF9933?style=for-the-badge)

### Complete Stack Table

| Layer | Technology | Purpose |
|---|---|---|
| Farmer mobile app | React Native (Expo) | Single cross-platform codebase for Android/iOS, fast iteration |
| Farmer web dashboard | Next.js + TypeScript + Tailwind CSS | Lightweight fallback for smartphone/web users |
| Staff dashboard | Next.js + TypeScript + Tailwind CSS | Realtime queue and procurement console, role-based UI |
| Backend API | Node.js + Fastify | Core business logic, auth, tool endpoints for the voice agent |
| Database | PostgreSQL (Supabase) | System of record for farmers, slots, queue, procurement, payments |
| Realtime layer | Supabase Realtime / WebSockets | Live queue and status updates pushed to dashboards and app |
| Authentication | Supabase Auth (phone OTP + role-based access) | Farmer and staff identity and permissions |
| Telephony | India-compliant cloud telephony provider (dev: Twilio-class test config; production: Indian carrier) | Inbound/outbound calling and toll-free routing |
| Speech-to-Text | Deepgram Nova (multilingual, streaming) | Real-time transcription of farmer speech |
| Conversational LLM | Groq-hosted open model (low-latency tool-calling) | Intent understanding and structured tool selection |
| Text-to-Speech | Deepgram Aura / Flux (streaming) | Natural, low-latency spoken responses with barge-in support |
| SMS gateway | DLT-registered Indian SMS provider | Status notifications and fallback alerts |
| Blockchain network | Shardeum (EVM-compatible) | Low-fee, scalable anchoring for AgroChain proof events |
| Smart contracts | Solidity + Hardhat | AgroChain event-anchoring contract and deployment tooling |
| Blockchain client | ethers.js | Backend interaction with the AgroChain smart contract |
| Market data source | data.gov.in / AGMARKNET daily mandi price API | Government-reported wholesale price data |
| Hosting — web | Vercel | Deployment for dashboards and marketing site |
| Hosting — backend | Render | Deployment for backend API and workers |
| Monitoring | Sentry + platform logs | Error tracking and production observability |
| CI/CD | GitHub Actions | Automated build, test, and deploy pipeline |

---

## System Architecture

<div align="center">
<img src="public/assets/architecture-animated_2.svg" alt="KisanCall animated system architecture — farmer phone and mobile app and staff dashboard feeding into the backend, which fans out to Supabase, the voice AI pipeline, and the AgroChain proof builder" width="100%">

<sub>Animated SVG — lines pulse to show live data flow. If it renders as static in your viewer (some IDEs and PDF exports don't run SVG animation), the plain-text version below shows the identical structure.</sub>
</div>

### Architectural Principle

The system is **one backend brain reachable through several channels.** The mobile app, farmer web dashboard, staff dashboard, and phone call all query the same backend for the same facts. The operational database holds all live data. AgroChain only receives a narrow, pre-approved set of events to anchor.

```
                       ┌─────────────────────────────┐
                       │   Farmer Phone                │
                       │   AI Voice · SMS fallback      │
                       └───────────────┬───────────────┘
                                       │
    ┌────────────────────┐            │            ┌────────────────────┐
    │  Mobile App          │           │           │  Staff Dashboard      │
    │  (Expo)               │◄─────────┼─────────►│  Queue · Payments      │
    └──────────┬───────────┘           │            └──────────┬───────────┘
               │                       ▼                        │
               │        ┌───────────────────────────────┐        │
               └───────►│      KisanCall Backend           │◄───────┘
                        │      Node.js / Fastify API        │
                        │      Auth · Business Rules ·      │
                        │      Voice Tool Layer              │
                        └───┬───────────────┬───────────┬───┘
                            │               │           │
                 ┌──────────▼───┐  ┌────────▼──────┐ ┌───▼─────────────┐
                 │ Supabase       │  │ Voice AI       │ │ Event & Proof    │
                 │ (Postgres)     │  │ Pipeline       │ │ Builder →         │
                 │ farmers, slots,│  │ STT → LLM →    │ │ AgroChain          │
                 │ queue, payments│  │ TTS            │ │ (Shardeum)          │
                 └────────────────┘  └───────────────┘ └────────────────────┘
                            ▲
                            │
                 ┌──────────┴───────────┐
                 │  data.gov.in /         │
                 │  Agmarknet (live prices)│
                 └───────────────────────┘
```

### Data Flow for a Transaction Event

1. An operator marks a procurement stage complete on the staff dashboard
2. The backend writes the full record to PostgreSQL
3. The Event & Proof Builder canonicalises the relevant fields (event type, quantity, price, timestamp, transaction ID) and computes a hash
4. The hash and metadata are submitted to the AgroChain smart contract; the resulting transaction hash is stored back against the record
5. The farmer is notified by an outbound AI call or SMS, and can request the proof reference at any time

---

> **Note:** For detailed technical specifications, refer to [docs/DB_SCHEMA.md](./docs/DB_SCHEMA.md) for the data model and [docs/API_CONTRACT.md](./docs/API_CONTRACT.md) for core API endpoints.

---

## Voice AI Engineering

### Pipeline

```
Farmer speech
   → Telephony audio stream
   → Streaming Speech-to-Text (Deepgram)
   → Intent & tool selection
   → Backend tool call (get_slot / get_queue / get_price / get_payment / booking_create)
   → LLM composes a short answer strictly from tool output (Groq)
   → Streaming Text-to-Speech (Deepgram)
   → Farmer hears the response
```

### Context Design

Rather than loading a farmer's entire history and every FAQ document into the model, each call is given a **compact, structured context object** containing only what's relevant right now: `farmer_id`, `language`, `preferred_mandi`, `crop`, today's slot, queue position and ETA, latest price and its date, procurement status, payment status, and the outcome of the last call. This keeps responses fast, predictable, and grounded.

### Latency Targets

| Stage | Target | Approach |
|---|---|---|
| Speech capture | Continuous streaming | Detect end-of-speech quickly |
| Speech-to-Text | 100–400 ms incremental | Streaming STT with turn detection |
| Backend tool call | 50–250 ms | Indexed queries against the operational database |
| LLM time-to-first-token | 100–400 ms | Small, fast tool-calling model with concise prompts |
| Text-to-Speech first audio | 100–400 ms | Streaming TTS |
| **Perceived total response** | **0.5–1.5 s** | Stream partial audio; keep answers short |

### Barge-In

If the farmer starts speaking while the agent's audio is still playing, the agent **stops output immediately**, preserves conversation state, and returns to listening. This is treated as a first-class requirement — natural conversation depends on it.

### Grounding & Hallucination Control

- The LLM never invents a price, queue position, or payment status
- Every factual answer is retrieved through an internal tool call first
- If data is missing or stale, the agent says so and offers staff escalation instead of guessing
- Every price response includes its reporting date
- Every payment response is read from the authoritative `payments` table, never generated freely

---

## AgroChain — The Proof Layer

### Purpose

AgroChain exists to answer one question with confidence: **can the farmer trust that what the system says happened is what actually happened?** Blockchain anchoring is used narrowly, only for events where a durable, independently checkable record adds real value — it never substitutes for the operational database.

### Event Lifecycle

```
PROCUREMENT_CREATED → QUANTITY_VERIFIED → PRICE_CONFIRMED
   → PROCUREMENT_COMPLETED → PAYMENT_INITIATED → PAYMENT_CONFIRMED
```

### What Is Recorded per Event

- A unique transaction/event identifier
- A hash of the canonicalised transaction fields
- Event type and timestamp
- A pseudonymous actor/system identifier
- A reference to the previous event where relevant
- The resulting blockchain transaction hash

### Honest Limitations

A blockchain record cannot, by itself, prove that a physical weighing or a bank payment was conducted honestly — it can only make the recorded event significantly harder to alter after the fact. AgroChain is designed to **complement, not replace**, trusted staff processes, authentication, and weighing/quality evidence.

### Resilience

Proof writes are queued and submitted **asynchronously**, so a temporary blockchain network issue never blocks a farmer's procurement or payment flow. Failed writes are retried with idempotency keys to prevent duplicate anchoring.

---

## Security & Privacy

| Risk | Control |
|---|---|
| Phone number leakage | Role-based access, server-side masking, no public exposure |
| Identity document leakage | Minimise storage; rely on authorised identity systems where possible |
| Bank detail leakage | Encrypted at rest, never written to the blockchain |
| AI hallucination | Tool-first architecture; no free-form factual generation |
| False staff update | Role-based permissions and full audit logging |
| Queue manipulation | Server-side queue rules with an immutable audit trail |
| Blockchain key compromise | Secure secret storage; separate deployment and admin keys |
| Duplicate proof events | Idempotency keys on every proof submission |
| Third-party API outage | Caching with clear stale-data warnings |
| Wrong farmer record | Verified mobile number plus staff-assisted correction |
| Prompt injection via external data | External text/data treated as untrusted; strict tool allowlist |

---

## Repository Structure

This is a **Turborepo + pnpm workspace** monorepo:

```
kisansaarthi-agrochain/
├── backend/          → Fastify + TypeScript API (farmers, bookings, queue, payments, mandis)
├── voice-ai/         → Voice AI package — intents, context object, tool stubs, system prompt
├── mobile-app/       → Expo (React Native) farmer app
├── staff-dashboard/  → Next.js staff portal (today, queue, arrivals, procurement, payments)
├── web-dashboard/    → Next.js read-only farmer web fallback
├── agrochain/        → Hardhat + Solidity proof-registry contract (Shardeum testnet)
├── design/           → Shared design tokens & Figma export
├── docs/             → API_CONTRACT.md, DB_SCHEMA.md, PLAN.md
└── pitch/            → Presentation deck, script, Q&A prep
```

| Package | Owner(s) |
|---|---|
| `backend/` | Krishna, Vansh |
| `voice-ai/` | Krishna, Aarushi, Vansh |
| `mobile-app/` | Vansh |
| `staff-dashboard/` | Navya |
| `web-dashboard/` | Navya |
| `agrochain/` | Aarush |
| `design/` | Mehar |
| `docs/` | Shared (Krishna maintains) |
| `pitch/` | Navya, Mehar |

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/<your-org>/kisansaarthi-agrochain.git
cd kisansaarthi-agrochain

# Install dependencies (monorepo-wide)
pnpm install

# Copy environment variables in each package
cp backend/.env.example backend/.env
cp mobile-app/.env.example mobile-app/.env
cp staff-dashboard/.env.example staff-dashboard/.env

# Run everything in dev mode (via Turborepo)
pnpm dev
```

> Fill in your own Supabase, Groq, Deepgram, and Twilio/telephony keys in each `.env` file before running the voice pipeline or database-backed features.

---

## Roadmap

| Phase | Build target | Exit criteria |
|---|---|---|
| **Phase 1** | Database schema, auth, staff dashboard shell, farmer app shell, price data adapter | Farmer, slot, and queue data flow end-to-end |
| **Phase 2** | Voice pipeline, tool calling, Hindi/English intents for queue/price/payment | A live phone call correctly handles 5–10 scripted conversations |
| **Phase 3** | Procurement lifecycle, AgroChain proof anchoring, SMS, error handling | A full procurement transaction produces a verifiable proof hash |
| **Phase 4** | Polish, load testing, failure testing, demo rehearsal, metrics dashboard | The end-to-end demo runs reliably on the rehearsed path |

**Deferred to a later phase:** full nationwide government payment API integration · complete regional-language coverage · nationwide 1800 toll-free service · multi-centre route optimisation · buyer/trader marketplace features · automated dispute resolution · predictive demand and arrival modelling.

---

## Impact Metrics

| Metric | How KisanCall moves it | How to measure |
|---|---|---|
| Average waiting time | Pre-scheduled arrivals and live queue visibility | Compare centres before/after enablement |
| Unnecessary trips | Remote status checks by phone/app | Trips/visits avoided, self-reported |
| Missed slots | Reminder calls and SMS | Missed-slot percentage |
| Status enquiries to staff | Voice self-service | Questions per 100 farmers routed to staff |
| Payment uncertainty | Proactive payment updates | Time-to-notification after status change |
| Digital inclusion | Voice-first access, no smartphone required | Share of farmers completing the core task by voice alone |
| Dispute evidence | AgroChain transaction proof | Number of events with a verifiable proof reference |
| Farmer satisfaction | End-to-end coordination | Post-call CSAT and task completion rate |

---

## Team

<div align="center">

### Team TeenTitans

**JSS University — Smart India Hackathon 2026**

</div>

| Name | Role | Branch & Year |
|---|---|---|
| **Krishna** *(Team Lead)* | Full Stack Developer + AI Voice Developer | AIML, 2nd Year |
| **Vansh Bhatia** | Full Stack Developer + Android Developer | CSE Core, 2nd Year |
| **Aarushi Sachdeva** | AIML Developer + Researcher | AIML, 2nd Year |
| **Navya Vishwakarma** | Researcher + Presenter | AIML, 2nd Year |
| **Aarush Goel** | Full Stack Developer | AIML, 2nd Year |
| **Mehar Sehgal** | UI/UX Developer | ECE, 2nd Year |

---

## Conclusion

KisanCall is best understood as a carefully bounded digital public-service product, not a bundle of unrelated technologies. Government and market data give the system facts. The voice layer gives the farmer access without requiring literacy, a smartphone, or a data connection. The procurement engine coordinates the actual workflow at the centre. AgroChain anchors proof of what happened, so trust doesn't depend solely on taking the system's word for it.

### Support

 If you like this project, give it a and share it with your team!

<div align="center">

** THANK YOU **

*Built with by Team TeenTitans for Smart India Hackathon 2026*

</div>
