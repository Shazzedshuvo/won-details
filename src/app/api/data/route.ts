import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { personalData as defaultPersonalData } from "@/data/personalData";

const DB_PATH = path.join(process.cwd(), "src", "data", "db.json");

function readDb() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const content = fs.readFileSync(DB_PATH, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error reading db.json:", err);
  }
  return null;
}

function writeDb(data: any) {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), "utf-8");
    return true;
  } catch (err) {
    console.error("Error writing db.json:", err);
    return false;
  }
}

export async function GET() {
  const current = readDb();
  if (current) {
    return NextResponse.json(current);
  }
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
    const existing = readDb() || {};
    const updated = {
      ...existing,
      ...body,
      updatedAt: new Date().toISOString()
    };

    writeDb(updated);
    return NextResponse.json({ success: true, data: updated });
  } catch (err: any) {
    console.error("Error updating db:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
