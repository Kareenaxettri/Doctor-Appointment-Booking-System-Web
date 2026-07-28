"use server";

import { generateContent } from "@/lib/api/ai/gemini";
import { getApiErrorMessage } from "@/lib/utils";

const SYSTEM_INSTRUCTION = `You are a pre-visit preparation assistant for the MediClick appointment-booking platform.
Given a doctor's specialty (and optionally the patient's stated symptoms/reason for visit), respond with ONLY strict JSON (no markdown fences, no extra text) in exactly this shape:
{"generalTips": ["...", "...", "..."], "specialtyTips": ["...", "..."]}

"generalTips" should be 3-5 short, universally-applicable preparation steps (e.g. arriving early, bringing ID, bringing previous reports/prescriptions).
"specialtyTips" should be 2-4 short tips specific to that specialty (e.g. fasting before a blood test, not applying creams before a dermatology visit, bringing an ECG/medication list for a cardiologist).
Each tip should be a single short sentence, practical and specific, written directly to the patient (e.g. "Fast for 8 hours before your appointment.").
Do not include medical advice beyond standard, well-known preparation practices. Do not diagnose or suggest treatment.`;

export interface AppointmentPrepResult {
  generalTips: string[];
  specialtyTips: string[];
}

export interface AppointmentPrepResponse {
  success: boolean;
  message?: string;
  data?: AppointmentPrepResult;
}

export async function handleAppointmentPrep(
  specialty: string,
  reasonForVisit?: string
): Promise<AppointmentPrepResponse> {
  try {
    const trimmedSpecialty = specialty.trim();
    if (!trimmedSpecialty) {
      return { success: false, message: "Specialty is required to generate preparation tips." };
    }

    const context = reasonForVisit?.trim()
      ? `Specialty: ${trimmedSpecialty}. Reason for visit / symptoms: ${reasonForVisit.trim()}.`
      : `Specialty: ${trimmedSpecialty}. No specific reason for visit was provided.`;

    const response = await generateContent(
      SYSTEM_INSTRUCTION,
      "Context: Generate preparation tips for this upcoming appointment and return the JSON object only.",
      context,
      { responseMimeType: "application/json" }
    );

    const raw: string | undefined = response?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!raw) {
      return { success: false, message: "No preparation tips generated. Please try again." };
    }

    const parsed = JSON.parse(raw) as AppointmentPrepResult;
    if (!Array.isArray(parsed.generalTips) || !Array.isArray(parsed.specialtyTips)) {
      return { success: false, message: "Could not generate preparation tips right now." };
    }

    return { success: true, data: parsed };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "The preparation assistant is unavailable right now."),
    };
  }
}
