# PROJECT CONTEXT & CODING STANDARDS

# AI INSTRUCTION: Read this file to understand the project architecture and coding style.

## 1. TECH STACK OVERVIEW

- **Framework:** Next.js (Full Stack).
- **Database:** PostgreSQL 16.0 (running via Docker Compose).
- **DB Client:** `pg` library (node-postgres). **DO NOT** use ORMs like Prisma or Sequelize. Use raw SQL.
- **Migrations:** `node-pg-migrate`.
- **Testing:** Jest (Integration tests focus).

## 2. API ARCHITECTURE

- **Base Path:** `/api/v1/`
- **Pattern:** All endpoints must return JSON.
- **Error Handling:** - Distinguish between **400** (Client Error / Validation) and **500** (Server/Database Error).
  - Always wrap DB calls in `try/catch`.
  - Return clean error messages: `res.status(500).json({ error: "Internal Server Error" });`

## 3. DATABASE PATTERNS (CRITICAL)

- **Connection:** Use the shared pool from `infra/database.js`.
- **Query Style:** Parameterized queries to prevent SQL Injection.
  - BAD: `query("SELECT * FROM users WHERE id = " + id)`
  - GOOD: `query("SELECT * FROM users WHERE id = $1", [id])`
- **Sanitization:** Strip dangerous characters before passing to the logic layer.

## 4. CODE STYLE (DESCHAMPS / CLEAN CODE)

- **Variables:** Use descriptive names.
  - BAD: `const data = ...`
  - GOOD: `const activeUserList = ...`
- **Comments:** Explain "Why", not "What".
- **Formatting:** Prettier standard.

## 5. EXAMPLE: STANDARD API ROUTE TEMPLATE

# Use this structure when generating new endpoints:

import database from "infra/database.js";

async function handler(request, response) {
if (request.method !== "GET") {
return response.status(405).json({ error: "Method not allowed" });
}

try {
// 1. Connection & Logic
const result = await database.query("SELECT 1 + 1 as sum;");

    // 2. Response
    const data = result.rows[0];
    return response.status(200).json(data);

} catch (error) {
// 3. Error Handling
console.error(error);
return response.status(500).json({ error: "Internal server error" });
}
}

export default handler;
