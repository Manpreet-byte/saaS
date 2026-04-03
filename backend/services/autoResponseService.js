import fetch from "node-fetch";

import { backendEnv } from "../utils/env.js";

const FRIENDLY = "friendly";
const PROFESSIONAL = "professional";
const APOLOGETIC = "apologetic";

const normalizeTone = (tone) => {
  if ([FRIENDLY, PROFESSIONAL, APOLOGETIC].includes(tone)) {
    return tone;
  }

  return FRIENDLY;
};

export const detectSentiment = (rating) => {
  if (rating <= 2) return "negative";
  if (rating === 3) return "neutral";
  return "positive";
};

const toneFromSentiment = (sentiment) => {
  if (sentiment === "negative") return APOLOGETIC;
  if (sentiment === "neutral") return PROFESSIONAL;
  return FRIENDLY;
};

const buildPrompt = ({ rating, comment, tone, sentiment }) =>
  [
    `Write a short ${tone} business reply to a customer review.`,
    `Sentiment: ${sentiment}.`,
    `Rating: ${rating}/5.`,
    `Review: ${comment}`,
    "Keep the reply warm, specific, and under 80 words.",
  ].join("\n");

const fallbackResponse = ({ rating, comment, tone, sentiment }) => {
  if (sentiment === "negative") {
    return `We are sorry to hear about your experience. We value your feedback and would like to make this right. Please contact us so we can address the issue raised in your ${rating}-star review: "${comment.slice(0, 120)}".`;
  }

  if (sentiment === "neutral") {
    return `Thank you for sharing your feedback. We appreciate your time and will keep improving our service based on your review.`;
  }

  return `Thank you for the kind review. We are glad you had a positive experience and appreciate you recommending us.`;
};

const callOpenAI = async (prompt) => {
  if (!backendEnv.openaiApiKey) {
    return "";
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${backendEnv.openaiApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You write concise and polite review replies." },
        { role: "user", content: prompt },
      ],
      temperature: 0.6,
      max_tokens: 180,
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data?.choices?.[0]?.message?.content?.trim() ?? "";
};

const callGemini = async (prompt) => {
  if (!backendEnv.geminiApiKey) {
    return "";
  }

  const url = new URL(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
  );
  url.searchParams.set("key", backendEnv.geminiApiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 180,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ?? "";
};

export const generateAutoResponse = async ({
  rating,
  comment,
  tone,
  provider = backendEnv.aiProvider,
}) => {
  const sentiment = detectSentiment(rating);
  const resolvedTone = normalizeTone(tone || toneFromSentiment(sentiment));
  const prompt = buildPrompt({ rating, comment, tone: resolvedTone, sentiment });

  try {
    if ((provider === "auto" || provider === "openai") && backendEnv.openaiApiKey) {
      const responseText = await callOpenAI(prompt);
      if (responseText) {
        return {
          provider: "openai",
          sentiment,
          tone: resolvedTone,
          responseText,
        };
      }
    }

    if ((provider === "auto" || provider === "gemini") && backendEnv.geminiApiKey) {
      const responseText = await callGemini(prompt);
      if (responseText) {
        return {
          provider: "gemini",
          sentiment,
          tone: resolvedTone,
          responseText,
        };
      }
    }
  } catch (error) {
    console.error("Auto-response generation failed:", error.message);
  }

  return {
    provider: "fallback",
    sentiment,
    tone: resolvedTone,
    responseText: fallbackResponse({ rating, comment, tone: resolvedTone, sentiment }),
  };
};
