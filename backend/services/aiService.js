import fetch from "node-fetch";

// Simple AI service that either calls OpenAI (if API key present) or returns mocked text.
// Exports: generateReview({ rating, tone, notes }), generateReply({ rating, reviewText })

const OPENAI_KEY = process.env.OPENAI_API_KEY;

if (OPENAI_KEY) {
  console.log(`[AIService] OPENAI_KEY loaded: ${OPENAI_KEY.substring(0, 20)}...`);
} else {
  console.log("[AIService] OPENAI_KEY not found! Using mocked responses.");
}

const pickToneFromRating = (rating) => {
  if (rating <= 2) return "apologetic";
  if (rating === 3) return "professional";
  return rating >= 4 ? "friendly" : "professional";
};

const mockGenerateReview = ({ rating, tone, notes }) => {
  const toneText = {
    apologetic: "We're really sorry that your experience didn't meet expectations.",
    professional: "Thank you for your feedback; we appreciate your time.",
    friendly: "Thanks so much — we're glad you had a good experience!",
    enthusiastic: "Amazing! We're thrilled you loved it!",
  }[tone || pickToneFromRating(rating)];

  let base = `${toneText} This ${rating}-star review`;
  if (notes) base += ` — ${notes}`;
  base += "";
  return `${base} (AI-generated summary)`;
};

const mockGenerateReply = ({ rating, reviewText }) => {
  const apology = rating <= 2 ? "We're sorry to hear that. Please contact us so we can make it right." : "Thank you for your review! We're glad you enjoyed your experience.";
  return `${apology} Reply to: "${reviewText.slice(0, 180)}"`;
};

async function callOpenAI(prompt) {
  // minimal wrapper for OpenAI completions via fetch (text-davinci-like). This is intentionally simple.
  const url = "https://api.openai.com/v1/chat/completions";
  const body = {
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    max_tokens: 400,
  };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const txt = await res.text();
      console.error(`[AIService] OpenAI error ${res.status}:`, txt);
      throw new Error(`OpenAI error ${res.status}: ${txt}`);
    }
    const data = await res.json();
    const msg = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text || "";
    return msg.trim();
  } catch (err) {
    console.error(`[AIService] callOpenAI failed:`, err.message);
    throw err;
  }
}

export async function generateReview({ rating, tone, notes }) {
  const selectedTone = tone || pickToneFromRating(rating);
  const prompt = `Generate a concise ${selectedTone} customer review summary for a ${rating}-star rating. Include a short summary and optionally incorporate these notes: ${notes || "none"}`;
  try {
    if (OPENAI_KEY) {
      return await callOpenAI(prompt);
    }
    return mockGenerateReview({ rating, tone: selectedTone, notes });
  } catch (err) {
    // fallback to mock
    return mockGenerateReview({ rating, tone: selectedTone, notes });
  }
}

export async function generateReply({ rating, reviewText }) {
  const prompt = `Write a short business reply to this customer review (rating: ${rating}): ${reviewText}`;
  try {
    if (OPENAI_KEY) {
      return await callOpenAI(prompt);
    }
    return mockGenerateReply({ rating, reviewText });
  } catch (err) {
    return mockGenerateReply({ rating, reviewText });
  }
}

export default { generateReview, generateReply };
