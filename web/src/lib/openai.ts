import OpenAI from "openai";

let openaiInstance: OpenAI | null = null;

function getOpenAI() {
  if (!openaiInstance) {
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openaiInstance;
}

export async function generateStudyMaterials(content: string, options?: {
  summaryType?: "QUICK" | "DETAILED" | "BEGINNER" | "COLLEGE";
  flashcardCount?: number;
  quizCount?: number;
  quizDifficulty?: "EASY" | "MEDIUM" | "HARD";
}) {
  const summaryType = options?.summaryType ?? "QUICK";
  const flashcardCount = options?.flashcardCount ?? 20;
  const quizCount = options?.quizCount ?? 10;
  const difficulty = options?.quizDifficulty ?? "MEDIUM";

  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are StudyFlow AI, an expert educational assistant. Analyze the provided content and generate study materials.
Return JSON with this exact structure:
{
  "summary": "markdown summary (${summaryType} level)",
  "keyConcepts": ["concept1", "concept2"],
  "vocabulary": [{"term": "", "definition": ""}],
  "formulas": [{"name": "", "formula": "", "explanation": ""}],
  "flashcards": [{"front": "question", "back": "answer", "topic": "topic name"}],
  "quiz": [{"type": "MULTIPLE_CHOICE|TRUE_FALSE|FILL_BLANK|SHORT_ANSWER", "question": "", "options": ["a","b","c","d"], "correctAnswer": "", "explanation": ""}]
}
Generate exactly ${flashcardCount} flashcards and ${quizCount} quiz questions at ${difficulty} difficulty.
Only use information from the provided content. Do not hallucinate.`,
      },
      { role: "user", content: content.slice(0, 50000) },
    ],
    temperature: 0.3,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error("No AI response");
  return JSON.parse(text);
}

export async function chatWithMaterial(
  content: string,
  question: string,
  history: { role: string; content: string }[]
) {
  const response = await getOpenAI().chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `You are StudyFlow AI. Answer questions ONLY using the provided study material. If the answer is not in the material, say "I couldn't find that in your uploaded content." Do not make up information.

STUDY MATERIAL:
${content.slice(0, 50000)}`,
      },
      ...history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: question },
    ],
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content ?? "Sorry, I couldn't generate a response.";
}
