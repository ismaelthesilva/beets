import database from "infra/database";

beforeAll(cleanDatabase);

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

test("GET /api/v1/migrations returns 200 and status message", async () => {
  const response = await fetch("http://localhost:3000/api/v1/migrations");
  expect(response.status).toBe(200);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("pending");
  expect(responseBody).toHaveProperty("applied");
  expect(Array.isArray(responseBody.pending)).toBe(true);
  expect(Array.isArray(responseBody.applied)).toBe(true);
  expect(responseBody.pending.length).toBeGreaterThanOrEqual(0);
});
