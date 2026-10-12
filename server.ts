import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// Always listen on port 3000 (nginx listens on 8080 and forwards to 3000)
const PORT = 3000;

// Increase payload limit for PDF and image uploads (base64)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Lazy Gemini AI client - only instantiate when a valid API key is present
// Never instantiate with undefined/empty apiKey to prevent google-auth-library from attempting OAuth fallback
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.trim() === '') {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Endpoint: Check API Key status
app.get('/api/health', (_req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasKey = Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY' && apiKey.trim() !== '');
  res.json({
    status: 'ok',
    hasApiKey: hasKey,
  });
});

// Endpoint: Extract questions from PDF or scanned images
app.post('/api/extract-exam', async (req, res) => {
  try {
    const { fileBase64, mimeType, examSubject = 'सामान्य विषय' } = req.body;

    if (!fileBase64 || !mimeType) {
      return res.status(400).json({
        error: 'कृपया मान्य PDF या प्रश्न पत्र की छवि (Image) अपलोड करें। (Missing file data)',
      });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(503).json({
        error: 'Gemini API Key उपलब्ध नहीं है। कृपया ऐप सेटिंग में GEMINI_API_KEY कॉन्फ़िगर करें या नीचे दिए गए मॉडल पेपर से अभ्यास करें।',
      });
    }

    const cleanBase64 = fileBase64.replace(/^data:.*?;base64,/, '');

    const systemPrompt = `You are an expert Bihar School Examination Board (BSEB / बिहार विद्यालय परीक्षा समिति) Class 10 (Matric) exam evaluator and OCR specialist.
Your task is to thoroughly analyze the provided question paper document (which may be a digital PDF, scanned document, or photograph in Hindi medium), extract all multiple choice and objective questions, clean up Hindi Devanagari text, identify the correct answer for each question according to BSEB NCERT/SCERT Class 10 curriculum, and provide clear step-by-step Hindi explanations.

Guidelines:
1. All extracted questions and options must be in clean, grammatically correct Hindi (Devanagari script).
2. For multiple-choice questions (MCQ), ensure there are 4 options labeled A, B, C, D (or क, ख, ग, घ mapped to A, B, C, D).
3. If an answer key is provided in the document, use it. Otherwise, solve each question accurately with 100% precision for Class 10 Matric standard.
4. Provide a helpful, clear explanation in Hindi (विस्तृत हल/व्याख्या) for why that option is correct.
5. If the document has many questions, extract as many complete objective questions as possible (up to 30 questions).
6. Total marks per question is typically 1 mark for BSEB objective questions.`;

    const userPrompt = `कृपया इस बिहार बोर्ड मैट्रिक (Class 10) प्रश्न पत्र से सभी वस्तुनिष्ठ (Objective / MCQ) प्रश्नों को निकालें। विषय: ${examSubject}. सुनिश्चित करें कि प्रत्येक प्रश्न का शुद्ध हिन्दी पाठ, 4 विकल्प (A, B, C, D), सही उत्तर और विस्तृत हिन्दी व्याख्या JSON प्रारूप में प्राप्त हो।`;

    const documentPart = {
      inlineData: {
        data: cleanBase64,
        mimeType: mimeType,
      },
    };

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [documentPart, { text: userPrompt }],
      },
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examTitle: {
              type: Type.STRING,
              description: 'Exam title in Hindi (e.g. बिहार बोर्ड कक्षा 10वीं मैट्रिक वार्षिक परीक्षा)',
            },
            subject: {
              type: Type.STRING,
              description: 'Subject name in Hindi (e.g. विज्ञान, गणित, सामाजिक विज्ञान, हिन्दी, संस्कृत)',
            },
            totalMarks: {
              type: Type.INTEGER,
              description: 'Total marks for this section',
            },
            suggestedTimeMinutes: {
              type: Type.INTEGER,
              description: 'Recommended exam time in minutes (e.g., 60, 90, 180)',
            },
            instructions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: 'Important instructions for students in Hindi',
            },
            questions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.INTEGER },
                  questionNumber: { type: Type.STRING },
                  questionText: { type: Type.STRING },
                  options: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                    description: 'Four options: [A, B, C, D]',
                  },
                  correctOption: {
                    type: Type.STRING,
                    description: 'One of: A, B, C, D',
                  },
                  marks: { type: Type.INTEGER },
                  explanation: {
                    type: Type.STRING,
                    description: 'Detailed explanation in Hindi explaining why the answer is correct',
                  },
                  topic: {
                    type: Type.STRING,
                    description: 'Chapter or topic name in Hindi',
                  },
                },
                required: [
                  'id',
                  'questionNumber',
                  'questionText',
                  'options',
                  'correctOption',
                  'marks',
                  'explanation',
                ],
              },
            },
          },
          required: ['examTitle', 'subject', 'questions'],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Gemini model did not return text response.');
    }

    const examData = JSON.parse(responseText);

    // Validate that questions array is not empty
    if (!examData.questions || examData.questions.length === 0) {
      return res.status(422).json({
        error: 'PDF से कोई वस्तुनिष्ठ प्रश्न नहीं मिल सका। कृपया सुनिश्चित करें कि दस्तावेज़ में पठनीय हिन्दी प्रश्न मौजूद हैं।',
      });
    }

    res.json({
      success: true,
      data: examData,
    });
  } catch (error: any) {
    console.error('Error extracting exam from PDF:', error);
    res.status(500).json({
      error: error?.message || 'प्रश्न पत्र प्रोसेस करने में त्रुटि हुई। कृपया पुनः प्रयास करें।',
    });
  }
});

// In production, serve static files from dist; in development, mount Vite middleware
async function startServer() {
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));
  const isProd = process.env.NODE_ENV === 'production';

  if (isProd && hasDist) {
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      if (hasDist) {
        console.warn('Vite dev server failed to start, falling back to dist static files:', err);
        app.use(express.static(distPath));
        app.get('*', (_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      } else {
        throw err;
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`BSEB Class 10 Exam Server running on port ${PORT}`);
  });
}

startServer();
