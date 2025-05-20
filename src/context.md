# context.md

## Index & Module Status
This index gives the AI Coder a snapshot of each module's current state to prevent rework and ensure a consistent build flow.

| Module                     | Status       | Notes                                            |
|----------------------------|--------------|--------------------------------------------------|
| Auth & KYC                 | Pending      | Aadhaar OTP, JWT 2FA                             |
| Listings                   | Pending      | CRUD, image pipeline, AI tagging                 |
| Search & Discovery         | Pending      | ES indexing, geo/filters, recommendation stub     |
| Chat & Notifications       | Pending      | WebSocket setup, notification hooks               |
| Payments & Escrow          | Pending      | Razorpay/Stripe integration, dispute logic       |
| Reviews & Ratings          | Pending      | API endpoints, sentiment analysis                |
| Admin & Analytics          | Pending      | Moderation APIs, Recharts dashboards             |
| Fraud Detection            | Pending      | Rule engine, anomaly model                       |
| DevOps & Infra             | Ongoing      | Docker, K8s, CI/CD, monitoring                   |
| Cost Optimization & Staging| Defined      | Free-local, \$5 VM, budget alerts                 |

---

## Project Overview

**Objective**: Build a fully automated, AI-driven OLX-style marketplace with best-in-class UI/UX, secure Aadhaar-based KYC, fraud prevention, and end-to-end transaction management.

**Scope**: 
- Peer-to-peer listings
- Real-time messaging
- Secure payments with escrow
- Automated reviews & analytics
- AI-driven fraud detection

---

## 1. AI Coder Workflow

### 1.1 Modules & Responsibilities
- **Auth & KYC Module**
  - Implement user signup/login APIs.
  - Integrate Aadhaar OTP API for e-KYC.
  - Configure JWT-based 2FA (TOTP/SMS).
- **Listings Module**
  - Create CRUD endpoints for listings (metadata + images).
  - Auto-generate image thumbnails via Sharp.
  - Tag & categorize using AI (NLP classification).
- **Search & Discovery Module**
  - Index data in Elasticsearch.
  - Develop search APIs: full-text, geo-filter, facets.
  - Implement AI-powered recommendation engine.
- **Chat & Notifications Module**
  - Setup WebSocket service (Socket.IO).
  - Real-time chat UI components.
  - Email/SMS/Push notifications integration (SendGrid, Twilio, FCM).
- **Payments & Escrow Module**
  - Integrate with Razorpay/Stripe.
  - Define escrow workflow: hold, release, dispute handling.
- **Reviews & Ratings Module**
  - Post-transaction review APIs.
  - Sentiment analysis on review text for fraud signals.
- **Admin & Analytics Module**
  - Build admin APIs for user/listing moderation.
  - Generate dashboards with Recharts (transactions, fraud flags).
- **Fraud Detection Module**
  - Implement rule-based filters (speed of listings, duplicate content).
  - Train anomaly detection model on user behavior.

### 1.2 Technical Stack
- **Language**: TypeScript (full-stack)  
  - Shared DTOs and type safety across modules.
- **Frontend**: Next.js + Tailwind CSS  
  - SSR for SEO; client-side for interactivity.
  - Zustand for state; React Query for data fetching.
- **Backend**: Node.js + NestJS  
  - Modular services, GraphQL schema-first or REST with OpenAPI.
- **Database**: PostgreSQL + Redis  
  - ACID transactions; Redis for sessions & caching.
- **Search**: Elasticsearch  
  - Full-text, geo, aggregations.
- **Storage**: AWS S3 + CloudFront  
  - Store images; serve via CDN.
- **Real-Time**: Socket.IO  
  - Chat channels; live alerts.
- **Notifications**: SendGrid, Twilio, FCM
- **Payments**: Razorpay (India), Stripe (Global)
- **Infra & DevOps**:
  - Docker → Kubernetes (EKS/GKE)
  - Terraform for IaC; GitHub Actions CI/CD
  - Prometheus & Grafana; Sentry; ELK logging
- **Security**:
  - TLS everywhere; WAF + Shield; OWASP ZAP; pen-tests

### 1.3 TypeScript Rationale
- **Type Safety**: Prevent runtime errors in KYC/payment flows.
- **Shared Contracts**: Single source of truth for DTOs across client/server.
- **Refactorability**: Safe code evolution as features grow.
- **IDE Support**: Enhanced autocompletion accelerates AI-generated code quality.

---

## 2. Sprint Plan & Milestones

| Sprint | Duration    | Goals                                                         |
|--------|-------------|---------------------------------------------------------------|
| 1      | Week 1–2    | Scaffold monorepo (frontend/backend), CI/CD pipelines, Auth   |
| 2      | Week 3–4    | Aadhaar KYC, user profiles, basic listing CRUD                |
| 3      | Week 5–6    | Image pipeline, search indexing, AI recommendation stub       |
| 4      | Week 7–8    | Real-time chat, notification hooks                            |
| 5      | Week 9–10   | Payment integration, escrow workflow                          |
| 6      | Week 11–12  | Reviews, sentiment analysis, admin dashboard                  |
| 7      | Week 13–14  | Fraud detection model training, manual review UI              |
| 8      | Week 15–16  | Security audit, performance tuning, prod rollout              |

---

## 3. Development Best Practices
- **Linting & Formatting**: ESLint + Prettier.
- **Testing**: Jest (unit), Supertest (API), Cypress (E2E).
- **Docs**: Auto-generate OpenAPI/GraphQL schema docs.
- **Monitoring**: Instrument code for Prometheus metrics.

---

## 4. Cost Optimization & Development Environment

### 4.1 Development Stage (Free / Minimal Cost)
- **Local Setup**: Run all services locally with Docker Compose. No cloud bills.
- **Self-Hosted VMs**: Use a single $5/mo VM (DigitalOcean/Linode) for staging: run PostgreSQL, Redis, Elasticsearch, and NestJS/Next.js apps.
- **Free Tiers**:
  - **AWS S3** (5 GB), **CloudFront** (50 GB transfer) for image assets.
  - **SendGrid** (100 emails/day), **Twilio Trial** ($15 credit) for notifications.
  - **GitHub Actions** (2,000 free CI minutes) for pipelines.
  - **Firebase Cloud Messaging** (unlimited free) for push.
- **Open-Source Tools**: Utilize entirely free, self-managed Prometheus, Grafana, ELK, and Sentry (self-hosted).

### 4.2 Production Staging (Low Cost)
- **Infrastructure**:
  - One small Kubernetes cluster (2–3 t3.small nodes) or single VM that can autoscale.
  - Managed PostgreSQL & Redis services only if stability outweighs cost (start self-hosted, migrate later).
- **Search**: Host one small Elasticsearch node; monitor memory; downsize if underutilized.
- **Storage**: Continue with AWS S3 + CloudFront free tier; delete old files regularly to stay under free limits.

### 4.3 Cost-Control Strategies
- **Monitoring & Alerts**: Define budget alerts in cloud provider UI, track usage daily.
- **Auto-suspend Idle Resources**: Shut down non-production clusters on nights/weekends via scripts.
- **Optimize Image Sizes**: Automatically compress/rescale to minimize storage and bandwidth.
- **Use Serverless Functions**: For occasional batch tasks (e.g. analytics) to avoid always-on servers.

---

*Generated for the AI Coder pipeline.*