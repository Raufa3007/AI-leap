"use server"

export interface ProcessHistoryStage {
  title: string
  status: "InProgress" | "Open" | "Completed"
  statusColor: "orange" | "blue" | "green"
  steps: string[]
  completedDate?: string
}

export async function fetchProcessHistory(rfpId: string): Promise<ProcessHistoryStage[]> {
  try {
    console.log("[v0] Fetching process history for:", rfpId)
    return getStaticProcessHistory(rfpId)
  } catch (error) {
    console.error("[v0] Error in fetchProcessHistory:", error)
    return getDefaultHistory()
  }
}

function getStaticProcessHistory(rfpId: string): ProcessHistoryStage[] {
  const mockHistories: { [key: string]: ProcessHistoryStage[] } = {
    RFP_10000000107: [
      {
        title: "RFP Preparation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "RFP Approved - Requestor Manager (Owner: Ahmed Al-Rashid)",
          "RFP Review - Finance Officer (Owner: Fatima Al-Dosari)",
          "RFP Approved - Finance Manager (Owner: Mohammed Al-Otaibi)",
          "RFP Review - PMO Officer (Owner: Sara Al-Shammari)",
          "RFP Approved - PMO Manager (Owner: Khalid Al-Harbi)",
          "RFP Review - Procurement Officer (Owner: Noor Al-Qahtani)",
          "RFP Approved - Procurement Manager (Owner: Hassan Al-Mutairi)",
          "RFP Approved - Procurement Director (Owner: Layla Al-Ansari)",
          "RFP Final Approval - CEO (Owner: Abdullah Al-Subaie)",
        ],
        completedDate: "2025-01-15",
      },
      {
        title: "Committee Evaluation",
        status: "InProgress",
        statusColor: "orange",
        steps: [
          "Technical Evaluation - In Progress",
          "Commercial Assessment - Pending",
          "Final Committee Review - Pending",
        ],
      },
      {
        title: "Contract Creation",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
      {
        title: "Issuing Certificate of Completion",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
    ],
    "PO#3432": [
      {
        title: "RFP Preparation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "RFP Approved - Requestor Manager (Owner: Ahmed Al-Rashid)",
          "RFP Review - Finance Officer (Owner: Fatima Al-Dosari)",
          "RFP Approved - Finance Manager (Owner: Mohammed Al-Otaibi)",
          "RFP Review - PMO Officer (Owner: Sara Al-Shammari)",
          "RFP Approved - PMO Manager (Owner: Khalid Al-Harbi)",
          "RFP Review - Procurement Officer (Owner: Noor Al-Qahtani)",
          "RFP Approved - Procurement Manager (Owner: Hassan Al-Mutairi)",
          "RFP Approved - Procurement Director (Owner: Layla Al-Ansari)",
          "RFP Final Approval - CEO (Owner: Abdullah Al-Subaie)",
        ],
        completedDate: "2025-01-10",
      },
      {
        title: "Committee Evaluation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "Technical Evaluation - Completed",
          "Commercial Assessment - Completed",
          "Final Committee Review - Completed",
        ],
        completedDate: "2025-01-20",
      },
      {
        title: "Contract Creation",
        status: "InProgress",
        statusColor: "orange",
        steps: ["Contract Draft - In Progress", "Legal Review - Pending", "Signature - Pending"],
      },
      {
        title: "Issuing Certificate of Completion",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
    ],
    "RFP #4353": [
      {
        title: "RFP Preparation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "RFP Approved - Requestor Manager (Owner: Ahmed Al-Rashid)",
          "RFP Review - Finance Officer (Owner: Fatima Al-Dosari)",
          "RFP Approved - Finance Manager (Owner: Mohammed Al-Otaibi)",
          "RFP Review - PMO Officer (Owner: Sara Al-Shammari)",
          "RFP Approved - PMO Manager (Owner: Khalid Al-Harbi)",
          "RFP Review - Procurement Officer (Owner: Noor Al-Qahtani)",
          "RFP Approved - Procurement Manager (Owner: Hassan Al-Mutairi)",
          "RFP Approved - Procurement Director (Owner: Layla Al-Ansari)",
          "RFP Final Approval - CEO (Owner: Abdullah Al-Subaie)",
        ],
        completedDate: "2025-01-12",
      },
      {
        title: "Committee Evaluation",
        status: "InProgress",
        statusColor: "orange",
        steps: [
          "Technical Evaluation - Completed",
          "Commercial Assessment - In Progress",
          "Final Committee Review - Pending",
        ],
      },
      {
        title: "Contract Creation",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
      {
        title: "Issuing Certificate of Completion",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
    ],
    "RFP#4542": [
      {
        title: "RFP Preparation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "RFP Approved - Requestor Manager (Owner: Ahmed Al-Rashid)",
          "RFP Review - Finance Officer (Owner: Fatima Al-Dosari)",
          "RFP Approved - Finance Manager (Owner: Mohammed Al-Otaibi)",
          "RFP Review - PMO Officer (Owner: Sara Al-Shammari)",
          "RFP Approved - PMO Manager (Owner: Khalid Al-Harbi)",
          "RFP Review - Procurement Officer (Owner: Noor Al-Qahtani)",
          "RFP Approved - Procurement Manager (Owner: Hassan Al-Mutairi)",
          "RFP Approved - Procurement Director (Owner: Layla Al-Ansari)",
          "RFP Final Approval - CEO (Owner: Abdullah Al-Subaie)",
        ],
        completedDate: "2025-01-18",
      },
      {
        title: "Committee Assignment",
        status: "InProgress",
        statusColor: "orange",
        steps: [
          "Committee Members Assignment - In Progress",
          "Evaluation Criteria Definition - In Progress",
          "Committee Approval - Pending",
        ],
      },
      {
        title: "Technical Evaluation",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
      {
        title: "Commercial Assessment",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
    ],
    "RFP#343": [
      {
        title: "RFP Preparation",
        status: "Completed",
        statusColor: "green",
        steps: [
          "RFP Approved - Requestor Manager (Owner: Ahmed Al-Rashid)",
          "RFP Review - Finance Officer (Owner: Fatima Al-Dosari)",
          "RFP Approved - Finance Manager (Owner: Mohammed Al-Otaibi)",
          "RFP Review - PMO Officer (Owner: Sara Al-Shammari)",
          "RFP Approved - PMO Manager (Owner: Khalid Al-Harbi)",
          "RFP Review - Procurement Officer (Owner: Noor Al-Qahtani)",
          "RFP Approved - Procurement Manager (Owner: Hassan Al-Mutairi)",
          "RFP Approved - Procurement Director (Owner: Layla Al-Ansari)",
          "RFP Final Approval - CEO (Owner: Abdullah Al-Subaie)",
        ],
        completedDate: "2025-01-16",
      },
      {
        title: "Technical Assessment",
        status: "InProgress",
        statusColor: "orange",
        steps: [
          "Technical Evaluation - In Progress",
          "Technical Committee Review - Pending",
          "Technical Approval - Pending",
        ],
      },
      {
        title: "Commercial Assessment",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
      {
        title: "Final Committee Review",
        status: "Open",
        statusColor: "blue",
        steps: [],
      },
    ],
  }

  // Return specific history if available, otherwise return default
  return mockHistories[rfpId] || getDefaultHistory()
}

function getDefaultHistory(): ProcessHistoryStage[] {
  return [
    {
      title: "RFP Preparation",
      status: "InProgress",
      statusColor: "orange",
      steps: [
        "RFP Approval - Requestor Manager (Owner: Pending)",
        "RFP Review - Finance Officer (Owner: Pending)",
        "RFP Approval - Finance Manager (Owner: Pending)",
        "RFP Review - PMO Officer (Owner: Pending)",
        "RFP Approval - PMO Manager (Owner: Pending)",
        "RFP Review - Procurement Officer (Owner: Pending)",
        "RFP Approval - Procurement Manager (Owner: Pending)",
        "RFP Approval - Procurement Director (Owner: Pending)",
        "RFP Final Approval - CEO (Owner: Pending)",
      ],
    },
    {
      title: "Committee Evaluation",
      status: "Open",
      statusColor: "blue",
      steps: [],
    },
    {
      title: "Contract Creation",
      status: "Open",
      statusColor: "blue",
      steps: [],
    },
    {
      title: "Issuing Certificate of Completion",
      status: "Open",
      statusColor: "blue",
      steps: [],
    },
  ]
}
