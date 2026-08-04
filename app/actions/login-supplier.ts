"use server"

import { createClient } from "@supabase/supabase-js"

interface LoginData {
  email: string
  password: string
}

export async function loginSupplier(loginData: LoginData) {
  try {
    const supabaseUrl = "https://hcwsdskgzgwrhvqnjwno.supabase.co"
    const serviceRoleKey =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjd3Nkc2tnemd3cmh2cW5qd25vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MDk5Mzg2MiwiZXhwIjoyMDc2NTY5ODYyfQ.RbO9gzehzZszEjP6aL-x8EiBLwB49cMGafQ7MBNS28k"

    console.log("[v0] Login attempt with email:", loginData.email)

    if (!supabaseUrl || !serviceRoleKey) {
      console.error("[v0] Missing Supabase credentials")
      return {
        success: false,
        error: "Supabase credentials not configured",
      }
    }

    if (!loginData.email || !loginData.password) {
      console.log("[v0] Missing email or password")
      return {
        success: false,
        error: "Email and password are required",
      }
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey)

    // Query supplier table for matching email and password
    console.log("[v0] Querying supplier table for email:", loginData.email)

    const { data: supplier, error: queryError } = await supabase
      .from("supplier")
      .select("*")
      .eq("primary_rep_email", loginData.email)
      .maybeSingle()

    if (queryError) {
      console.error("[v0] Database query error:", queryError)
      return {
        success: false,
        error: "Database error occurred",
      }
    }

    if (!supplier) {
      console.log("[v0] No supplier found with email:", loginData.email)
      return {
        success: false,
        error: "Incorrect email or password",
      }
    }

    // Validate password
    if (supplier.password_hash !== loginData.password) {
      console.log("[v0] Password mismatch for email:", loginData.email)
      return {
        success: false,
        error: "Incorrect email or password",
      }
    }

    console.log("[v0] Login successful for supplier:", supplier.id)

    // Return supplier data without password
    const { password_hash, ...supplierWithoutPassword } = supplier

    return {
      success: true,
      message: "Login successful",
      user: supplierWithoutPassword,
    }
  } catch (error) {
    console.error("[v0] Login error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "An error occurred during login",
    }
  }
}
