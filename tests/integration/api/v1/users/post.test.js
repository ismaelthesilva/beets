import database from "infra/database";

beforeAll(async () => {
  await cleanDatabase();
  await runMigrations();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade; create schema public;");
}

async function runMigrations() {
  await fetch("http://localhost:3000/api/v1/migrations", {
    method: "POST",
  });
}

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("Creating a valid user", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
          email: "test@example.com",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();
      expect(responseBody).toHaveProperty("id");
      expect(responseBody.username).toBe("testuser");
      expect(responseBody.email).toBe("test@example.com");
      expect(responseBody).toHaveProperty("created_at");
    });

    test("Creating user with duplicate email", async () => {
      // First user
      await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user1",
          email: "duplicate@example.com",
        }),
      });

      // Duplicate attempt
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "user2",
          email: "duplicate@example.com",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.error).toContain("already exists");
    });

    test("Creating user without required fields", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "testuser",
        }),
      });

      expect(response.status).toBe(400);

      const responseBody = await response.json();
      expect(responseBody.error).toContain("required");
    });
  });
});
