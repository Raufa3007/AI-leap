import { type NextRequest, NextResponse } from "next/server"
import { loginSupplier } from "@/app/actions/login-supplier"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await loginSupplier({ email, password })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json(
      {
        message: result.message,
        user: result.user,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login API error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
