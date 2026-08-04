// This works reliably in the Next.js runtime without file system access issues

export interface User {
  id: number
  companyName: string
  registrationNumber: string
  businessType: string
  country: string
  city: string
  address: string
  industriesServed: string
  productServices: Array<{
    category: string
    description: string
  }>
  differentiators: string
  numberOfEmployees: string
  officeLocations: string
  annualTurnover: string
  capacityToDeliver: string
  existingClients: string
  primaryRepFirstName: string
  primaryRepLastName: string
  primaryRepPhone: string
  primaryRepPhoneCode: string
  primaryRepEmail: string
  primaryRepRelationship: string
  primaryRepNationality: string
  password: string
}

// Sample users for initial data
const SAMPLE_USERS: User[] = [
  {
    id: 1,
    companyName: "Tech Solutions Ltd",
    registrationNumber: "REG001",
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
    registrationNumber: "REG002",
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

// Initialize users from localStorage or use sample users
function initializeUsers(): User[] {
  if (typeof window === "undefined") {
    // Server-side: return sample users
    return SAMPLE_USERS
  }

  const stored = localStorage.getItem("app_users")
  if (stored) {
    try {
      return JSON.parse(stored)
    } catch {
      return SAMPLE_USERS
    }
  }
  return SAMPLE_USERS
}

export function getAllUsers(): User[] {
  return initializeUsers()
}

export function addUser(userData: Omit<User, "id">): User {
  const users = getAllUsers()
  const newId = users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1

  const newUser: User = {
    ...userData,
    id: newId,
  }

  users.push(newUser)

  if (typeof window !== "undefined") {
    localStorage.setItem("app_users", JSON.stringify(users))
  }

  return newUser
}

export function findUserByEmail(email: string): User | undefined {
  const users = getAllUsers()
  return users.find((u) => u.primaryRepEmail === email)
}

export function findUserByEmailAndPassword(email: string, password: string): User | undefined {
  const users = getAllUsers()
  return users.find((u) => u.primaryRepEmail === email && u.password === password)
}
