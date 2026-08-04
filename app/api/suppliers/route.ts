import { type NextRequest, NextResponse } from "next/server"
import { fetchSuppliers } from "@/app/actions/fetch-suppliers"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] API: Fetching suppliers...")

    const suppliers = await fetchSuppliers()

    console.log("[v0] API: Fetched suppliers:", suppliers?.length || 0)

    return NextResponse.json({ suppliers: suppliers || [] }, { status: 200 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch suppliers" },
      { status: 500 },
    )
  }
}
