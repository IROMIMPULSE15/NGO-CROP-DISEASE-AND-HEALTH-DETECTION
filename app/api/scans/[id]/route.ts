import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { verifyToken } from "@/lib/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    const scanId = Number.parseInt(params.id)

    // Verify scan belongs to user
    const scan = await sql`
      SELECT id FROM scans 
      WHERE id = ${scanId} AND user_id = ${decoded.userId}
    `

    if (scan.length === 0) {
      return NextResponse.json({ error: "Scan not found" }, { status: 404 })
    }

    // Delete scan
    await sql`
      DELETE FROM scans 
      WHERE id = ${scanId} AND user_id = ${decoded.userId}
    `

    return NextResponse.json({ message: "Scan deleted successfully" })
  } catch (error) {
    console.error("Error deleting scan:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
