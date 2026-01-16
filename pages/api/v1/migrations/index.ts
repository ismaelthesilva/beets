import { NextApiRequest, NextApiResponse } from "next";
import migrationsRunner from "node-pg-migrate";
import { join } from "path";
import database from "infra/database";

export default async function migrations(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  const dbClient = await database.getNewClient();

  const defaultMigrationsOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: join("infra", "migrations"),
    direction: "up" as const,
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    // Show pending migrations
    const pendingMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
    });

    // Also show applied migrations
    const appliedMigrations = await dbClient.query(
      "SELECT name, run_on FROM pgmigrations ORDER BY run_on DESC;",
    );

    await dbClient.end();

    return response.status(200).json({
      pending: pendingMigrations,
      applied: appliedMigrations.rows,
    });
  }

  if (request.method === "POST") {
    const migratedMigrations = await migrationsRunner({
      ...defaultMigrationsOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigrations.length > 0) {
      return response.status(201).json(migratedMigrations);
    }
    return response.status(200).json(migratedMigrations);
  }

  return response.status(405).end();
}
