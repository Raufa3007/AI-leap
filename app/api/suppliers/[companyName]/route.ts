import { type NextRequest, NextResponse } from "next/server"
import { fetchSupplierByName } from "@/app/actions/fetch-supplier-by-name"

export async function GET(request: NextRequest, { params }: { params: { companyName: string } }) {
  try {
    const companyName = decodeURIComponent(params.companyName)
    console.log("[v0] API: Fetching supplier by name:", companyName)

    const supplier = await fetchSupplierByName(companyName)

    if (!supplier) {
      return NextResponse.json({ error: "Supplier not found" }, { status: 404 })
    }

    console.log("[v0] API: Fetched supplier:", supplier.company_name)

    return NextResponse.json({ supplier }, { status: 200 })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch supplier" },
      { status: 500 },
    )
  }
}
