import { type NextRequest, NextResponse } from "next/server"

// Sample users data (same as in login route)
const SAMPLE_USERS = [
  {
    id: 1,
    companyName: "Tech Solutions Ltd",
    businessType: "Technology",
    country: "United Kingdom",
    city: "London",
    address: "123 Tech Street",
    industriesServed: "IT, Software",
    productServices: [],
    differentiators: "Innovation",
    numberOfEmployees: "50-100",
    officeLocations: "London, Manchester",
    annualTurnover: "1M-5M",
    capacityToDeliver: "High",
    existingClients: "Fortune 500",
    primaryRepFirstName: "Ahmed",
    primaryRepLastName: "Khan",
    primaryRepPhone: "1234567890",
    primaryRepPhoneCode: "+44",
    primaryRepEmail: "ahmed@techsolutions.com",
    primaryRepRelationship: "Director",
    primaryRepNationality: "British",
    password: "SecurePass123",
  },
  {
    id: 2,
    companyName: "Global Logistics Inc",
    businessType: "Logistics",
    country: "United Arab Emirates",
    city: "Dubai",
    address: "456 Logistics Ave",
    industriesServed: "Supply Chain, Shipping",
    productServices: [],
    differentiators: "Global Network",
    numberOfEmployees: "100-500",
    officeLocations: "Dubai, Abu Dhabi",
    annualTurnover: "5M-10M",
    capacityToDeliver: "Very High",
    existingClients: "International Brands",
    primaryRepFirstName: "Fatima",
    primaryRepLastName: "Al-Mansouri",
    primaryRepPhone: "9876543210",
    primaryRepPhoneCode: "+971",
    primaryRepEmail: "fatima@globallogistics.com",
    primaryRepRelationship: "Manager",
    primaryRepNationality: "Emirati",
    password: "LogisticsPro456",
  },
]

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const requiredFields = [
      "companyName",
      "businessType",
      "countryOfOperation",
      "dateOfIncorporation",
      "crNumber",
      "crIssueDate",
      "companyAddressLine1",
      "companyCity",
      "companyPostalCode",
      "industriesServed",
      "differentiators",
      "numberOfEmployees",
      "officeLocations",
      "capacityToDeliver",
      "existingClients",
      "primaryRepFirstName",
      "primaryRepLastName",
      "primaryRepPhone",
      "primaryRepPhoneCode",
      "primaryRepEmail",
      "primaryRepRelationship",
      "primaryRepNationality",
      "password",
      "confirmPassword",
    ]

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 })
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.primaryRepEmail)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const existingUser = SAMPLE_USERS.find((u) => u.primaryRepEmail === body.primaryRepEmail)
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 })
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/
    if (!passwordRegex.test(body.password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters with uppercase, lowercase, and numbers" },
        { status: 400 },
      )
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match" }, { status: 400 })
    }

    const newId = Math.max(...SAMPLE_USERS.map((u) => u.id)) + 1

    return NextResponse.json(
      {
        message: "Registration successful",
        user: {
          id: newId,
          email: body.primaryRepEmail,
          companyName: body.companyName,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Registration error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
