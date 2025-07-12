import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const scans = await sql`
      SELECT 
        id, image_url, plant_part, prediction_result, 
        confidence_score, created_at
      FROM scans 
      WHERE user_id = ${decoded.userId}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `

    return NextResponse.json(scans)
  } catch (error) {
    console.error("Error fetching scans:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
