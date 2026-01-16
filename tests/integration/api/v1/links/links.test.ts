import database from "infra/database";

beforeAll(async () => {
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");

  // Manually create the table for tests
  await database.query(`
    CREATE TABLE IF NOT EXISTS links (
      code VARCHAR(50) PRIMARY KEY NOT NULL,
      url TEXT NOT NULL,
      clicks INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP NOT NULL DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS idx_links_created_at ON links(created_at);
  `);
}

test("POST /api/v1/links creates a new link with custom code", async () => {
  const response = await fetch("http://localhost:3000/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/some/path",
      code: "optional-custom-alias",
    }),
  });

  expect(response.status).toBe(201);

  const responseBody = await response.json();

  expect(responseBody).toHaveProperty("code", "optional-custom-alias");
  expect(responseBody).toHaveProperty("url", "https://example.com/some/path");
  expect(responseBody).toHaveProperty("clicks", 0);
  expect(responseBody).toHaveProperty("created_at");
});

test("POST /api/v1/links returns 400 for invalid URL", async () => {
  const response = await fetch("http://localhost:3000/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "not-a-valid-url",
      code: "test-code",
    }),
  });

  expect(response.status).toBe(400);

  const responseBody = await response.json();
  console.log("Actual response:", JSON.stringify(responseBody, null, 2)); // ADD THIS LINE
  expect(responseBody).toHaveProperty("error", "Validation error");
  expect(responseBody).toHaveProperty("details");
});

test("POST /api/v1/links returns 409 for duplicate code", async () => {
  await fetch("http://localhost:3000/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/first",
      code: "duplicate-code",
    }),
  });

  const response = await fetch("http://localhost:3000/api/v1/links", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      url: "https://example.com/second",
      code: "duplicate-code",
    }),
  });

  expect(response.status).toBe(409);

  const responseBody = await response.json();
  expect(responseBody).toHaveProperty("error", "Code already exists");
});
