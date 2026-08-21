import { GoogleGenAI } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { englishWord, englishDefinition, category } = await req.json();

    if (!englishWord) {
      return NextResponse.json({ error: 'English word is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          {
            teluguWord: `${englishWord} తెలుగింపు`,
            transliteration: 'Telugimpu',
            rationale: 'ఆంగ్ల భావనకు సరిపోయే సహజమైన తెలుగు వ్యక్తీకరణ.',
            exampleSentence: `దీనిని నిత్య వ్యవహారంలో ఉపయోగించవచ్చు.`
          }
        ],
        fallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `You are an expert Telugu linguist and neologist dedicated to Telugu culture preservation and vocabulary creation ("పద సంపద").
We need innovative, authentic, catchy, and culturally grounded Telugu coined terms (తెలుగు అనువాదాలు / నూతన పదాలు) for the following English concept:

English Concept: "${englishWord}"
Definition/Context: "${englishDefinition || 'Modern term'}"
Category: "${category || 'General'}"

Rules for Telugu Coined Words:
1. Ground the word in natural Telugu roots (అచ్చతెలుగు లేదా సంస్కృత-తెలుగు ధాతువులు, e.g., 'వలన్వేషి' for browser, 'రైలురేవు' for railway station, 'తెరపటం' for screenshot).
2. It should be concise, memorable, and natural to pronounce for modern speakers.
3. Provide:
   - "teluguWord": The Telugu word in Telugu script (తెలుగు లిపి).
   - "transliteration": Standard English Roman script transliteration (e.g., 'Railurevu').
   - "rationale": Clear explanation in Telugu why this word was coined (ఎందుకు / అర్థ సమర్థన).
   - "exampleSentence": A natural real-world example sentence in Telugu using the new word.

Respond ONLY with valid JSON array containing 2 to 3 objects with keys: "teluguWord", "transliteration", "rationale", "exampleSentence". No markdown ticks outside the JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '[]';
    let suggestions = [];
    try {
      suggestions = JSON.parse(responseText);
    } catch {
      // In case of parsing edge cases, extract JSON array
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        suggestions = JSON.parse(match[0]);
      }
    }

    return NextResponse.json({ suggestions });
  } catch (error: any) {
    console.error('Error generating Telugu word suggestions:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate suggestions' }, { status: 500 });
  }
}
