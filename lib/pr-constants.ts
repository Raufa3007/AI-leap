export const BUDGET_CODE_OPTIONS = [
  { value: "BC001", label: "BC001 - Operations" },
  { value: "BC002", label: "BC002 - Marketing" },
  { value: "BC003", label: "BC003 - IT Infrastructure" },
  { value: "BC004", label: "BC004 - HR & Training" },
  { value: "BC005", label: "BC005 - Facilities" },
  { value: "BC006", label: "BC006 - Research & Development" },
]

export const MATERIAL_GROUP_OPTIONS = [
  { value: "MG001", label: "Raw Materials" },
  { value: "MG002", label: "Office Supplies" },
  { value: "MG003", label: "IT Equipment" },
  { value: "MG004", label: "Machinery & Tools" },
  { value: "MG005", label: "Packaging Materials" },
  { value: "MG006", label: "Services" },
  { value: "MG007", label: "Consumables" },
  { value: "MG008", label: "Safety Equipment" },
]

export const UNIT_OF_MEASURE_OPTIONS = [
  { value: "PCS", label: "Pieces" },
  { value: "KG", label: "Kilogram" },
  { value: "LTR", label: "Liter" },
  { value: "MTR", label: "Meter" },
  { value: "BOX", label: "Box" },
  { value: "PACK", label: "Pack" },
  { value: "SET", label: "Set" },
  { value: "ROLL", label: "Roll" },
  { value: "HOUR", label: "Hour" },
  { value: "DAY", label: "Day" },
]

export const CHECKLIST_QUESTIONS = [
  { id: 1, question: "Is this project included as per procurement planning?", key: "checklist_project_in_procurement_plan" },
  { id: 2, question: "Were the specifications of the team work mentioned?", key: "checklist_team_specifications_mentioned" },
  { id: 3, question: "Has the data of the person concerned with coordinating with suppliers been written down ? (Name, Mobile, Email)", key: "checklist_supplier_coordinator_details" },
  { id: 4, question: "has the information of the person concerned with receiving the samples been written down ? (Name, Mobile, Email)", key: "checklist_sample_receiver_details" },
  { id: 5, question: "Is the scope of work similar to the scope of existing contract? If yes please refer to the contract", key: "checklist_scope_similar_to_existing_contract" },
  { id: 6, question: "The names of the companies summoned in the limited tender, along with writing the commercial registration number of the company", key: "checklist_limited_tender_companies_listed" },
]
