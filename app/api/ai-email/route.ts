import { NextRequest, NextResponse } from "next/server";
import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StructuredOutputParser } from "langchain/output_parsers";
import { z } from "zod";


export const emailPrompt = `You are an expert email assistant. Improve or generate a cold email based on the following subject and content.

Respond ONLY with a valid JSON object containing:
- "subject": Improved Subject or Generated Subject
- "content": Improved or Generated Email Content
- "name": Template Name
- "category": Email Category

Subject: {subject}
Content: {content}

Make sure to follow proper JSON syntax without markdown or extra text.
`;


export async function POST(req: NextRequest) {
  const { subject, content } = await req.json();

  // 2. First create the parser
  const parser = StructuredOutputParser.fromZodSchema(
    z.object({
    subject: z.string().min(1, "Subject is required"),
    content: z.string().min(1, "Content is required"),
    name: z.string().min(1, "Template name is required"),
    category: z.string().min(1, "Template category is required"),
  })
  );

 
  const formatInstructions = parser.getFormatInstructions()
    .replace(/{/g, '{{')
    .replace(/}/g, '}}')
    .replace(/{{{(.*?)}}}/g, '{$1}'); 

  function extractJsonFields(text: string) {
  const matchField = (field: string) => {
    const regex = new RegExp(`"${field}"\\s*:\\s*"(.*?)"`, 'i');
    const match = text.match(regex);
    return match?.[1]?.trim() || '';
  };

  return {
    subject: matchField('subject'),
    content: matchField('content'),
    name: matchField('name'),
    category: matchField('category'),
  };
}
  const prompt = new PromptTemplate({
    template: `${emailPrompt}\n\n${formatInstructions}`,
    inputVariables: ["subject", "content"],
    validateTemplate: false, 
  });

  const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY!,
    model: "llama3-70b-8192",
    temperature: 0.2,
  });

  const chain = prompt.pipe(model).pipe(parser);

  try {
    const result = await chain.invoke({ subject, content });
    const parsed = extractJsonFields(JSON.stringify(result));

  // Validate and respond
  if (!parsed.subject || !parsed.content) {
    return NextResponse.json({ error: 'Missing subject/content in LLM output', raw: result }, { status: 500 });
  }
    
    
    return NextResponse.json(result);
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { error: "Processing failed", details: String(err) },
      { status: 500 }
    );
  }
}