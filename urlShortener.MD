# Full-Stack Technical Interview Assignment: URL Shortener

## Objective

Build a working URL shortener with a frontend to create/manage links and a backend API to validate input and persist data.

## 🛠 Tech Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Validation:** Zod
- **Styling:** Tailwind CSS

---

## 🗄️ Database & Persistence

**Requirement:** All created links must be stored in PostgreSQL via Prisma and remain available after a server restart.

**Schema Requirements:**
The `Link` model must include at minimum:

- [ ] `code` (String, Unique, Indexed)
- [ ] `url` (String, Original long URL)
- [ ] `clicks` (Integer, default `0`)
- [ ] `createdAt` (DateTime, default `now`)

---

## 📡 Backend API

### 1. Create a Short Link

**Endpoint:** `POST /api/links`

**Rules:**

- [ ] Validate request body using **Zod**.
- [ ] `url` must be a valid http/https URL.
- [ ] `code` is optional.
  - [ ] If provided: Must be URL-safe (no spaces) and Unique.
  - [ ] If NOT provided: Generate a unique code automatically.
- [ ] Handle collision errors deterministically.

**Request Body:**

```json
{
  "url": "[https://example.com/some/path](https://example.com/some/path)",
  "code": "optional-custom-alias"
}
```
