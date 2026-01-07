import { NextApiRequest, NextApiResponse } from "next";
import database from "infra/database";

async function handler(request: NextApiRequest, response: NextApiResponse) {
  if (request.method === "GET") {
    return getAllUsers(request, response);
  }

  if (request.method === "POST") {
    return createUser(request, response);
  }

  return response.status(405).json({ error: "Method not allowed" });
}

async function getAllUsers(request: NextApiRequest, response: NextApiResponse) {
  try {
    const result = await database.query({
      text: "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC;",
    });

    return response.status(200).json({
      users: result.rows,
      total: result.rowCount,
    });
  } catch (error) {
    console.error("Database error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

async function createUser(request: NextApiRequest, response: NextApiResponse) {
  const { username, email } = request.body;

  // Validation
  if (!username || !email) {
    return response.status(400).json({
      error: "Username and email are required",
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return response.status(400).json({
      error: "Invalid email format",
    });
  }

  try {
    // Parameterized query prevents SQL injection
    const result = await database.query({
      text: `
        INSERT INTO users (username, email)
        VALUES ($1, $2)
        RETURNING id, username, email, created_at;
      `,
      values: [username, email],
    });

    return response.status(201).json(result.rows[0]);
  } catch (error) {
    // Handle duplicate key error (PostgreSQL error code 23505)
    if (error.code === "23505") {
      return response.status(400).json({
        error: "Username or email already exists",
      });
    }

    console.error("Database error:", error);
    return response.status(500).json({ error: "Internal server error" });
  }
}

export default handler;
