import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { theme } = await req.json();

    if (!theme) {
      return NextResponse.json({ error: "Thème manquant" }, { status: 400 });
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Tu es un expert en pédagogie et en fact-checking. 
          Ton but est de créer des textes éducatifs pour des collégiens (11-15 ans).
          Tu dois TOUJOURS répondre sous forme d'un objet JSON pur.
          Le texte doit être court (4-5 lignes), sérieux, et contenir EXACTEMENT UNE erreur factuelle subtile mais trouvable.
          L'erreur ne doit pas être une faute d'orthographe, mais une erreur de fait (date, nom, concept, lieu).`,
        },
        {
          role: "user",
          content: `Génère un texte sur le thème suivant : "${theme}". 
          Format JSON attendu :
          {
            "text": "Le texte complet avec l'erreur",
            "error": "Le mot ou la phrase précise qui est faux",
            "correction": "L'explication correcte"
          }`,
        },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      response_format: { type: "json_object" },
    });

    const responseContent = completion.choices[0]?.message?.content;

    if (!responseContent) {
      throw new Error("Pas de réponse de l'IA");
    }

    const data = JSON.parse(responseContent);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Erreur Groq:", error);
    return NextResponse.json(
      { error: "Impossible de générer la question" },
      { status: 500 },
    );
  }
}
