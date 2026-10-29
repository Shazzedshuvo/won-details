import { NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";

export async function GET() {
  const startTime = Date.now();
  try {
    const db = await getDb();
    // Ping MongoDB to test live connection
    await db.command({ ping: 1 });
    const pingTimeMs = Date.now() - startTime;

    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c) => c.name);

    return NextResponse.json({
      status: "connected",
      database: db.databaseName,
      cluster: "cluster0.brr1zca.mongodb.net",
      authenticatedUser: "shazzed2003_db_user",
      latencyMs: pingTimeMs,
      collections: collectionNames,
      timestamp: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        status: "error",
        message: err.message || "Failed to connect to MongoDB",
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

