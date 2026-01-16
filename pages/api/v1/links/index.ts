import { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import database from "infra/database";

const linkSchema = z.object({
  url: z.string().url("Invalid URL format"),
  code: z.string().min(1, "Code is required").max(50),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Request method:", req.method); // DEBUG LINE

  if (req.method === "GET") {
    return await getLinks(req, res);
  }

  if (req.method === "POST") {
    return await createLink(req, res);
  }

  return res.status(405).json({ error: "Method not allowed" });
}

async function getLinks(req: NextApiRequest, res: NextApiResponse) {
  console.log("GET handler called"); // DEBUG LINE
  try {
    const result = await database.query({
      text: "SELECT code, url, clicks, created_at FROM links ORDER BY created_at DESC",
    });

    return res.status(200).json({
      links: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error("Error fetching links:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function createLink(req: NextApiRequest, res: NextApiResponse) {
  console.log("POST handler called", req.body); // DEBUG LINE

  const validation = linkSchema.safeParse(req.body);

  if (!validation.success) {
    console.log("Validation failed:", validation.error.errors); // DEBUG LINE
    return res.status(400).json({
      error: "Validation error",
      details: validation.error.errors,
    });
  }

  try {
    const result = await database.query({
      text: `
        INSERT INTO links (code, url, clicks, created_at)
        VALUES ($1, $2, 0, NOW())
        RETURNING code, url, clicks, created_at
      `,
      values: [validation.data.code, validation.data.url],
    });

    return res.status(201).json(result.rows[0]);
  } catch (error) {
    if ((error as any).code === "23505") {
      return res.status(409).json({
        error: "Code already exists",
      });
    }

    console.error("Error creating link:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
