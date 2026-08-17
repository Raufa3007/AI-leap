import { GoogleGenAI } from "@google/genai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: "GEMINI_API_KEY is not configured." },
      { status: 500 }
    )
  }

  try {
    const body = await req.json()
    const ai = new GoogleGenAI({ apiKey })

    const contents = body.contents || body.prompt
    const config = body.config || body.generationConfig || {}

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: config,
    })

    return NextResponse.json({
      text: response.text,
      candidates: response.candidates,
    })
  } catch (error: any) {
    console.error("[api/gemini] Gemini SDK Error:", error)
    return NextResponse.json(
      { error: error?.message || "Failed to generate content from Gemini API." },
      { status: 500 }
    )
  }
}

