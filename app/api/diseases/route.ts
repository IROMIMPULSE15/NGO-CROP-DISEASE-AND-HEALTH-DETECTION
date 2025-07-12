import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search")
    const cropType = searchParams.get("cropType")
    const severity = searchParams.get("severity")
    const limit = Number.parseInt(searchParams.get("limit") || "50")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    let query = `
      SELECT 
        id, name_en, name_hi, description_en, description_hi,
        symptoms_en, symptoms_hi, treatment_en, treatment_hi,
        prevention_en, prevention_hi, crop_type, severity_level, image_url
      FROM diseases
      WHERE 1=1
    `
    const params: any[] = []
    let paramIndex = 1

    if (search) {
      query += ` AND (name_en ILIKE $${paramIndex} OR name_hi ILIKE $${paramIndex} OR crop_type ILIKE $${paramIndex})`
      params.push(`%${search}%`)
      paramIndex++
    }

    if (cropType) {
      query += ` AND crop_type = $${paramIndex}`
      params.push(cropType)
      paramIndex++
    }

    if (severity) {
      query += ` AND severity_level = $${paramIndex}`
      params.push(severity)
      paramIndex++
    }

    query += ` ORDER BY name_en LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`
    params.push(limit, offset)

    const diseases = await sql.unsafe(query, params)

    return NextResponse.json(diseases)
  } catch (error) {
    console.error("Error fetching diseases:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const {
      name_en,
      name_hi,
      description_en,
      description_hi,
      symptoms_en,
      symptoms_hi,
      treatment_en,
      treatment_hi,
      prevention_en,
      prevention_hi,
      crop_type,
      severity_level,
      image_url,
    } = await request.json()

    const result = await sql`
      INSERT INTO diseases (
        name_en, name_hi, description_en, description_hi,
        symptoms_en, symptoms_hi, treatment_en, treatment_hi,
        prevention_en, prevention_hi, crop_type, severity_level, image_url
      )
      VALUES (
        ${name_en}, ${name_hi}, ${description_en}, ${description_hi},
        ${symptoms_en}, ${symptoms_hi}, ${treatment_en}, ${treatment_hi},
        ${prevention_en}, ${prevention_hi}, ${crop_type}, ${severity_level}, ${image_url}
      )
      RETURNING *
    `

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating disease:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
