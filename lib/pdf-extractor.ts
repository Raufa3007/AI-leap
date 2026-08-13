// @ts-ignore
import pdfParse from "pdf-parse/lib/pdf-parse.js"

/**
 * Reusable server-side PDF extraction function.
 * Uses pdf-parse/lib/pdf-parse.js directly to avoid Next.js server runtime file system test checks.
 *
 * @param fileBuffer - Buffer containing PDF file data
 * @returns Promise<string> containing extracted text
 */
export async function extractTextFromPDF(fileBuffer: Buffer): Promise<string> {
  if (!fileBuffer || !(fileBuffer instanceof Buffer) || fileBuffer.length === 0) {
    throw new Error("Invalid or empty PDF file buffer provided.")
  }

  try {
    const data = await pdfParse(fileBuffer)
    const text = data?.text ? data.text.trim() : ""

    if (!text || text.length === 0) {
      return "No readable text could be extracted from this PDF."
    }

    return text
  } catch (error: any) {
    console.error("[pdf-extractor] Error parsing PDF document:", error)
    if (error?.message && error.message.includes("No readable text")) {
      return "No readable text could be extracted from this PDF."
    }
    throw new Error(error?.message || "Unable to read this PDF. Please try another document.")
  }
}
