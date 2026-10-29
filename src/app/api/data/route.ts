import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { personalData as defaultPersonalData } from "@/data/personalData";
import { getDb } from "@/lib/mongodb";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");
const DOC_ID = "main_dashboard_data";
const COLLECTION_NAME = "portfolio_data";

function readLocalDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading local db.json:", err);
  }
  return null;
}

function writeLocalDb(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing local db.json:", err);
    return false;
  }
}

export async function GET() {
  try {
    const db = await getDb();
    const collection = db.collection(COLLECTION_NAME);
    const mongoData = await collection.findOne({ _id: DOC_ID as any });

    if (mongoData) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, ...cleanData } = mongoData;
      // Keep local backup synchronized
      writeLocalDb(cleanData);
      return NextResponse.json(cleanData);
    }

    // If MongoDB document doesn't exist yet, seed from local db.json
    const local = readLocalDb();
    if (local) {
      await collection.updateOne(
        { _id: DOC_ID as any },
        { $set: { ...local, updatedAt: new Date().toISOString() } },
        { upsert: true }
      );
      return NextResponse.json(local);
    }
  } catch (mongoError) {
    console.warn("MongoDB notice (serving from local backup):", mongoError);
    const local = readLocalDb();
    if (local) {
      return NextResponse.json(local);
    }
  }

  // Fallback defaults if both are empty
  return NextResponse.json({
    profile: defaultPersonalData,
    faviconUrl: "/uploads/applicant-photo.jpg",
    vaultCategories: null,
    vaultRecords: null,
    showcaseItems: null,
    cvData: null,
    authCredentials: null,
    expenses: null,
    incomes: null,
    monthlyPlans: null,
    budgetConfig: null
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let existing: any = null;

    try {
      const db = await getDb();
      const collection = db.collection(COLLECTION_NAME);
      const mongoDoc = await collection.findOne({ _id: DOC_ID as any });
      if (mongoDoc) {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, ...cleanDoc } = mongoDoc;
        existing = cleanDoc;
      }
    } catch (e) {
      console.warn("Could not read existing doc from MongoDB:", e);
    }

    if (!existing) {
      existing = readLocalDb() || {};
    }

    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString()
    };

    // Save to MongoDB
    try {
      const db = await getDb();
      const collection = db.collection(COLLECTION_NAME);
      await collection.updateOne(
        { _id: DOC_ID as any },
        { $set: updated },
        { upsert: true }
      );
    } catch (dbErr) {
      console.error("Failed to persist to MongoDB Atlas:", dbErr);
    }

    // Also persist local file as backup
    writeLocalDb(updated);

    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating data:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
