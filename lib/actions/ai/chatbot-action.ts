"use server";

import { generateContent } from "@/lib/api/ai/gemini";
import { getApiErrorMessage } from "@/lib/utils";

const SYSTEM_INSTRUCTION =
  "You are the MediClick Assistant, a friendly help-desk agent for a doctor-appointment " +
  "booking website called MediClick. Help users understand how to register, log in, search " +
  "doctors by specialty, book/reschedule/cancel appointments, pay for appointments, manage " +
  "favourites and notifications, and edit their profile. Keep answers under 3 short sentences. " +
  "Never invent doctor names, prices, or availability — if you don't know, tell the user to " +
  "check the Doctors or Appointments page. Always make clear you are not a medical " +
  "professional and cannot diagnose conditions or prescribe treatment.";

export interface ChatbotResult {
  success: boolean;
  message: string;
}

export async function handleChatbotMessage(message: string): Promise<ChatbotResult> {
  try {
    const trimmed = message.trim();
    if (!trimmed) {
      return { success: false, message: "Please type a message." };
    }

    const response = await generateContent(
      SYSTEM_INSTRUCTION,
      "Context: Respond to the user's question about the MediClick platform concisely.",
      trimmed
    );

    const text: string | undefined = response?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    if (!text) {
      return { success: false, message: "No response generated. Please try again." };
    }

    return { success: true, message: text };
  } catch (error: unknown) {
    return {
      success: false,
      message: getApiErrorMessage(error, "The assistant is unavailable right now."),
    };
  }
}
