"use client"

import { useState } from "react"
import { Info } from "lucide-react"

interface TechnicalEvaluationTableProps {
  isEditable?: boolean
}

export default function TechnicalEvaluationTable({ isEditable = false }: TechnicalEvaluationTableProps) {
  const [data, setData] = useState({
    previousExperience: {
      yearsScore: 35,
      projectsScore: 40,
      valueScore: 12,
    },
    existingObligations: {
      projectsScore: 30,
      valueScore: 55,
    },
    hr: {
      employeesScore: 50,
      saudiScore: 30,
    },
  })

  const handleScoreChange = (section: string, field: string, value: string) => {
    if (!isEditable) return
    const numValue = Number.parseFloat(value) || 0
    setData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: numValue,
      },
    }))
  }

  const calculateSectionTotal = (section: keyof typeof data) => {
    return Object.values(data[section]).reduce((sum, val) => sum + val, 0)
  }

  const calculateWeightedScore = (score: number, weight: number) => {
    return ((score * weight) / 100).toFixed(2)
  }

  const prevExpTotal = calculateSectionTotal("previousExperience")
  const existingTotal = calculateSectionTotal("existingObligations")
  const hrTotal = calculateSectionTotal("hr")

  const prevExpWeighted = Number.parseFloat(calculateWeightedScore(prevExpTotal, 35))
  const existingWeighted = Number.parseFloat(calculateWeightedScore(existingTotal, 25))
  const hrWeighted = Number.parseFloat(calculateWeightedScore(hrTotal, 40))

  const totalWeightedScore = prevExpWeighted + existingWeighted + hrWeighted
  const technicalCapabilities = (totalWeightedScore * 0.6).toFixed(2)

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-green-700">Technical evaluation</h3>

      <div className="border border-gray-200 rounded-lg overflow-hidden">
        {/* Main Header */}
        <div className="grid grid-cols-12 gap-4 bg-green-700 text-white p-4 font-medium text-sm">
          <div className="col-span-4">Evaluation standard</div>
          <div className="col-span-4">Technical capabilities (Technical member)</div>
          <div className="col-span-2 flex items-center gap-1">
            Weightage (%)
            <Info className="w-4 h-4" />
          </div>
          <div className="col-span-2 flex items-center gap-1">
            Score
            <Info className="w-4 h-4" />
          </div>
        </div>

        {/* Previous experience section */}
        <div className="bg-green-100 border-b-2 border-green-200">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-green-800">
            <div className="col-span-10">Previous experience</div>
            <div className="col-span-1 text-center">35</div>
            <div className="col-span-1 text-center">{prevExpWeighted}</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100">
          <div className="col-span-4">Number of years experience</div>
          <div className="col-span-4">Minimum 10 years</div>
          <div className="col-span-2 text-center">40</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.previousExperience.yearsScore}
                onChange={(e) => handleScoreChange("previousExperience", "yearsScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.previousExperience.yearsScore}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100">
          <div className="col-span-4">Number of projects implemented during the last three years</div>
          <div className="col-span-4">Minimum 12 Projects</div>
          <div className="col-span-2 text-center">45</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.previousExperience.projectsScore}
                onChange={(e) => handleScoreChange("previousExperience", "projectsScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.previousExperience.projectsScore}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200">
          <div className="col-span-4">Total value of Projects during the last three years (SAR)</div>
          <div className="col-span-4">100,000,000,000</div>
          <div className="col-span-2 text-center">15</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.previousExperience.valueScore}
                onChange={(e) => handleScoreChange("previousExperience", "valueScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.previousExperience.valueScore}</span>
            )}
          </div>
        </div>

        {/* Section total */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="col-span-10"></div>
          <div className="col-span-2 text-center font-medium text-gray-700">100</div>
        </div>

        {/* Existing contractual obligations section */}
        <div className="bg-green-100 border-b-2 border-green-200">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-green-800">
            <div className="col-span-10">Existing contractual obligations</div>
            <div className="col-span-1 text-center">25</div>
            <div className="col-span-1 text-center">{existingWeighted}</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100">
          <div className="col-span-4">Number of existing Projects</div>
          <div className="col-span-4">Minimum 12 Projects</div>
          <div className="col-span-2 text-center">35</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.existingObligations.projectsScore}
                onChange={(e) => handleScoreChange("existingObligations", "projectsScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.existingObligations.projectsScore}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200">
          <div className="col-span-4">The value of existing projects</div>
          <div className="col-span-4">100,000,000</div>
          <div className="col-span-2 text-center">65</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.existingObligations.valueScore}
                onChange={(e) => handleScoreChange("existingObligations", "valueScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.existingObligations.valueScore}</span>
            )}
          </div>
        </div>

        {/* Section total */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="col-span-10"></div>
          <div className="col-span-2 text-center font-medium text-gray-700">100</div>
        </div>

        {/* HR section */}
        <div className="bg-green-100 border-b-2 border-green-200">
          <div className="grid grid-cols-12 gap-4 p-4 font-medium text-green-800">
            <div className="col-span-10">HR</div>
            <div className="col-span-1 text-center">40</div>
            <div className="col-span-1 text-center">{hrWeighted}</div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100">
          <div className="col-span-4">Number of employees</div>
          <div className="col-span-4">10,000</div>
          <div className="col-span-2 text-center">55</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.hr.employeesScore}
                onChange={(e) => handleScoreChange("hr", "employeesScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.hr.employeesScore}</span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200">
          <div className="col-span-4">Percentage of Saudi employees</div>
          <div className="col-span-4">35%</div>
          <div className="col-span-2 text-center">45</div>
          <div className="col-span-2 text-center">
            {isEditable ? (
              <input
                type="number"
                value={data.hr.saudiScore}
                onChange={(e) => handleScoreChange("hr", "saudiScore", e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                min="0"
                max="100"
              />
            ) : (
              <span className="text-gray-700">{data.hr.saudiScore}</span>
            )}
          </div>
        </div>

        {/* Section total */}
        <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 border-b-2 border-gray-200">
          <div className="col-span-10"></div>
          <div className="col-span-2 text-center font-medium text-gray-700">100</div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 bg-green-50 border-b-2 border-green-200">
          <div className="col-span-10"></div>
          <div className="col-span-2 text-center font-medium text-green-800">100</div>
        </div>

        {/* Final results */}
        <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-white">
          <div className="col-span-10 font-medium text-gray-900">Total</div>
          <div className="col-span-2 text-center font-medium text-gray-900">{totalWeightedScore.toFixed(2)}</div>
        </div>

        <div className="grid grid-cols-12 gap-4 p-4 bg-blue-50 border-t-2 border-blue-200">
          <div className="col-span-10 font-medium text-blue-800">Technical capabilities (60%)</div>
          <div className="col-span-2 text-center font-medium text-blue-800">{technicalCapabilities}</div>
        </div>
      </div>
    </div>
  )
}
