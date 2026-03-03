import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { userChoice, aiError, aiCorrection } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Tu es un juge de jeu de quiz. Ton rôle est de dire si l'élève a identifié la bonne erreur. Sois indulgent : si l'idée est là, c'est bon. Réponds UNIQUEMENT par 'OUI' ou 'NON'.",
        },
        {
          role: "user",
          content: `L'erreur à trouver était : "${aiError}".
          L'explication correcte était : "${aiCorrection}".
          L'élève a répondu : "${userChoice}".
          L'élève a-t-il trouvé l'erreur ?`,
        },
      ],
      model: "llama-3-8b-8192",
    });

    const result = completion.choices[0]?.message?.content
      ?.trim()
      .toUpperCase();
    return NextResponse.json({ isCorrect: result?.includes("OUI") });
  } catch (error) {
    return NextResponse.json({ isCorrect: false });
  }
}
