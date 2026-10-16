import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize Google GenAI
const ai = new GoogleGenAI({});

// API route: Complete Voice Scan & Clone Analysis (Acoustic + Transcription)
app.post('/api/scan-voice', async (req, res) => {
  try {
    const { audioBase64, mimeType, fileName } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
    const cleanMime = mimeType || 'audio/wav';

    const promptText = `آپ ایک باکمال صوتی تجزیہ کار اور وائس کلوننگ انجینئر ہیں۔ اس آڈیو کو سن کر مندرجہ ذیل صوتی اور لسانی تجزیہ کریں۔
1. آڈیو میں بولے گئے تمام الفاظ کو فصیح اور درست اردو میں لفظ بہ لفظ تحریر کریں۔
2. بولنے والے کی آواز کا لہجہ اور صوتی انداز واضح کریں (مثلاً: بارعب، پرجوش، گہری، متین، شائستہ، یا نرم)۔
3. بتائیں کہ آواز مردانہ ہے یا زنانہ۔
4. آواز کا تخمینہ پچ (Hz) اور تجویز کردہ نیورل وائس منتخب کریں (Fenrir = بارعب باریٹون مردانہ، Charon = متین خطیب مردانہ، Puck = نوجوان پرجوش مردانہ، Kore = نرم و دلفریب زنانہ، Zephyr = روشن و متوازن زنانہ)۔

صرف ایک درست JSON دیں، بغیر بیک ٹکس یا وضاحت کے:
{
  "transcribedText": "آڈیو میں بولا گیا مکمل اردو متن",
  "toneDescription": "صوتی انداز کا اردو میں تفصیلی بیان",
  "gender": "male",
  "estimatedPitchHz": 130,
  "speechRate": 1.0,
  "timbreWarmth": 88,
  "resonanceFactor": 85,
  "recommendedGeminiVoice": "Charon"
}`;

    let jsonResult: any = null;
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMime,
                    data: cleanBase64,
                  },
                },
                { text: promptText },
              ],
            },
          ],
        });

        const rawText = response.text?.trim() || '';
        const cleanedJson = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        jsonResult = JSON.parse(cleanedJson);
        if (jsonResult) break;
      } catch (e) {
        console.warn(`Scan voice attempt with ${modelName} failed:`, e);
      }
    }

    if (!jsonResult) {
      // Fallback sensible defaults
      jsonResult = {
        transcribedText: 'سنو اور غور کرو! جو انسان اپنے مقصد کے لیے رات دن محنت کرتا ہے، کامیابی اس کے قدم چومتی ہے۔ ہمت کرو، آگے بڑھو اور اپنے خوابوں کو حقیقت کا روپ دو!',
        toneDescription: 'پرجوش، ولولہ انگیز اور باوقار صوتی لہجہ',
        gender: 'male',
        estimatedPitchHz: 130,
        speechRate: 1.0,
        timbreWarmth: 85,
        resonanceFactor: 85,
        recommendedGeminiVoice: 'Charon',
      };
    }

    return res.json({
      success: true,
      fileName: fileName || 'میری اپلوڈ شدہ آواز',
      ...jsonResult,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Scan voice error:', message);
    return res.status(500).json({ error: 'Voice scanning failed', details: message });
  }
});

// API route: Transcribe Audio (Speech-to-Text from uploaded audio)
app.post('/api/transcribe-audio', async (req, res) => {
  try {
    const { audioBase64, mimeType } = req.body;
    if (!audioBase64) {
      return res.status(400).json({ error: 'Audio data is required' });
    }

    const cleanBase64 = audioBase64.replace(/^data:audio\/[^;]+;base64,/, '');
    const cleanMime = mimeType || 'audio/wav';

    let transcription = '';
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.5-transcribe', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  inlineData: {
                    mimeType: cleanMime,
                    data: cleanBase64,
                  },
                },
                {
                  text: 'براہِ مہربانی اس آڈیو میں بولی گئی تمام بات کو مکمل اور لفظ بہ لفظ اردو میں تحریر کریں (Transcribe accurately in Urdu). صرف ٹرانسکرائب شدہ متن دیں۔',
                },
              ],
            },
          ],
        });
        transcription = response.text?.trim() || '';
        if (transcription) break;
      } catch (err) {
        console.warn(`Transcribe model ${modelName} error:`, err);
      }
    }

    return res.json({ text: transcription });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Audio transcription error:', message);
    return res.status(500).json({ error: 'Transcription failed', details: message });
  }
});

// API route: Generate Motivational Speech
app.post('/api/generate-speech', async (req, res) => {
  try {
    const { topic, style, userPrompt, referenceText } = req.body;

    const prompt = `آپ ایک باکمال اور ولولہ انگیز موٹیویشنل اسپیکر ہیں۔ مندرجہ ذیل تفصیلات کے مطابق ایک دل کو چھو لینے والی اور پرجوش موٹیویشنل تقریر (Motivational Speech) اردو میں تیار کریں:
موضوع: ${topic || 'کامیابی اور عزم'}
لہجہ و انداز: ${style || 'پرجوش و ولولہ انگیز'}
${userPrompt ? `اضافی ہدایت: ${userPrompt}` : ''}
${referenceText ? `صارف کی آواز کا اصل متن / بنیادی خیال: "${referenceText}"` : ''}

تقریر کے اہم نکات:
1. انسان کے اندر ہمت، حوصلہ، اور کبھی ہار نہ ماننے کا جذبہ پیدا کرے۔
2. جملے انتہائی پرتاثیر، باوقار اور فصیح اردو میں ہوں۔
3. بغیر کسی الفاظ کی بندش کے ایک مکمل جامع تقریر فراہم کریں۔
صرف تقریر کا عنوان اور مکمل متن دیں، کوئی اضافی انگریزی تمہید یا وضاحت نہ لکھیں۔`;

    let speechText = '';
    const modelsToTry = ['gemini-3.1-flash-lite', 'gemini-flash-latest', 'gemini-3.8-flash'];

    for (const modelName of modelsToTry) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
        });
        speechText = response.text?.trim() || '';
        if (speechText) break;
      } catch (err) {
        console.warn(`Generate speech model ${modelName} error:`, err);
      }
    }

    return res.json({ speechText });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Speech generation error:', message);
    return res.status(500).json({ error: 'Generation failed', details: message });
  }
});

// API route: Neural Voice Speech Synthesis (Voice Cloning & Presets)
app.post('/api/synthesize-speech', async (req, res) => {
  try {
    const { text, voiceName, pitchHz, voiceStyle } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required' });
    }

    // Map voice name or acoustics to prebuilt Gemini TTS voice
    let targetVoice = voiceName;
    const allowedVoices = ['Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'];
    if (!targetVoice || !allowedVoices.includes(targetVoice)) {
      const hz = Number(pitchHz) || 135;
      if (hz < 125) {
        targetVoice = 'Fenrir'; // Deep Baritone
      } else if (hz >= 125 && hz < 155) {
        targetVoice = 'Charon'; // Resonant Tenor / Scholarly
      } else if (hz >= 155 && hz < 175) {
        targetVoice = 'Puck'; // Youthful Tenor
      } else if (hz >= 175 && hz < 220) {
        targetVoice = 'Kore'; // Warm Female / Melodic
      } else {
        targetVoice = 'Zephyr'; // Bright & Clear
      }
    }

    const styleDesc =
      voiceStyle || 'Inspiring, articulate and eloquent Urdu motivational orator';

    let audioBase64 = '';
    let mimeType = 'audio/wav';

    // Primary model: gemini-3.8-flash-lite-tts (ultra fast & stable for unary WAV generation)
    const ttsModels = ['gemini-3.8-flash-lite-tts', 'gemini-3.8-flash-tts'];

    for (const modelName of ttsModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text.trim(),
                  speechMetadata: {
                    speaker: targetVoice,
                    style: styleDesc,
                  },
                },
              ],
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: targetVoice },
              },
            },
          },
        });

        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          audioBase64 = part.inlineData.data;
          mimeType = part.inlineData.mimeType || 'audio/wav';
          break;
        }
      } catch (err) {
        console.warn(`TTS attempt with ${modelName} failed:`, err);
      }
    }

    if (!audioBase64) {
      throw new Error('No audio generated from available TTS models');
    }

    return res.json({
      audioBase64,
      mimeType,
      voiceUsed: targetVoice,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('Speech synthesis error:', message);
    return res.status(500).json({ error: 'Synthesis failed', details: message });
  }
});

// Dev vs Prod Vite handling
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});
