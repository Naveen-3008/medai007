import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function generateSimpleFallback(
  symptoms: string,
  painLevel: number = 4,
  duration: string = 'Recent',
  language: string = 'English'
) {
  const lower = (symptoms || '').toLowerCase();

  let condition = 'Mild Muscle or Tissue Strain';
  let category = 'First Aid & Home Care';
  let severity: 'Mild' | 'Moderate' | 'Severe / Seek Emergency Care' = 'Mild';
  let rationale = `Mild discomfort rated ${painLevel}/10. Can usually be managed at home with simple care.`;
  let causeSummary = `Caused by sudden movement, physical strain, or minor irritation.`;
  let effectSummary = `You may feel soreness, mild swelling, or tenderness when moving.`;
  let reasonSummary = `When tissue gets irritated, your body sends extra blood to the area to protect and heal it, which causes swelling and soreness.`;
  let firstAid = [
    'Rest: Stop any activity that hurts and rest the sore area.',
    'Ice / Cold: Put a cool ice pack wrapped in a cloth on the area for 15 minutes at a time.',
    'Elevate: Prop the area up on pillows if it is swollen.',
  ];
  let clinicalTreatments = [
    'Ask a pharmacist about simple pain relief medicines like acetaminophen or ibuprofen if needed.',
    'Use an elastic bandage wrap gently for extra support.',
  ];
  let warnings = [
    'DO NOT push through severe pain or do heavy lifting.',
    'DO NOT apply bare ice directly onto your skin.',
  ];
  let dietFoods = [
    'Drink plenty of plain water to stay well-hydrated.',
    'Eat protein-rich foods like eggs, yogurt, or chicken to help your body repair.',
    'Eat fresh fruits like oranges and berries for natural vitamins.',
  ];
  let avoidFoods = [
    'Avoid junk food, high sugar snacks, and soda which can slow down recovery.',
    'Limit salty snacks that make swelling worse.',
  ];

  if (lower.includes('burn') || lower.includes('steam') || lower.includes('heat') || lower.includes('scald') || lower.includes('fire')) {
    condition = 'Minor Heat Burn / Scald';
    category = 'Burn Care';
    severity = painLevel >= 7 ? 'Moderate' : 'Mild';
    rationale = 'Skin is red and sore from contact with heat or hot liquid.';
    causeSummary = 'Contact with a hot surface, hot liquid, or steam.';
    effectSummary = 'Red skin, stinging pain, and possible small fluid blisters.';
    reasonSummary = 'Heat damages the top layer of skin. Your body rushes fluid to the burn to cool and protect the tissue below.';
    firstAid = [
      'Cool Water Immediately: Run cool tap water over the burn for 10 to 20 minutes.',
      'Remove tight rings, watches, or clothing before the area starts to swell.',
      'Cover gently with a clean, loose, non-stick bandage or plastic wrap.',
    ];
    warnings = [
      'DO NOT put ice, butter, oil, or toothpaste on a burn.',
      'DO NOT pop or peel any blisters.',
    ];
    dietFoods = ['Drink extra water', 'Eat foods high in Vitamin C (citrus, berries)', 'Eat lean proteins (eggs, beans, fish)'];
    avoidFoods = ['Avoid spicy foods', 'Limit salty snacks'];
  } else if (lower.includes('sprain') || lower.includes('ankle') || lower.includes('twist') || lower.includes('foot')) {
    condition = 'Twisted Ankle / Sprain';
    category = 'Joint & Muscle Care';
    severity = painLevel >= 8 ? 'Moderate' : 'Mild';
    rationale = 'The ankle was twisted beyond its normal range, causing swelling.';
    causeSummary = 'Twisting or rolling the foot awkwardly while walking, running, or playing sports.';
    effectSummary = 'Swelling, bruising, and pain when trying to put weight on the foot.';
    reasonSummary = 'The strong bands (ligaments) holding your ankle bones together were overstretched, causing minor swelling and fluid buildup.';
    firstAid = [
      'Rest: Avoid walking on the injured foot as much as possible.',
      'Ice: Apply an ice pack wrapped in a towel for 15-20 minutes every few hours.',
      'Compress: Wrap gently with an elastic bandage for support (not too tight).',
      'Elevate: Keep your foot propped up on cushions above heart level.',
    ];
    warnings = [
      'DO NOT walk or run through sharp pain.',
      'DO NOT use hot baths or heating pads during the first 2 days.',
    ];
  } else if (lower.includes('tooth') || lower.includes('dental') || lower.includes('gum') || lower.includes('jaw')) {
    condition = 'Toothache / Gum Irritation';
    category = 'Dental Care';
    severity = painLevel >= 7 ? 'Moderate' : 'Mild';
    rationale = 'Discomfort originating from tooth enamel, gums, or nerve sensitivity.';
    causeSummary = 'Tooth decay, food stuck between teeth, gum irritation, or sensitivity to hot/cold.';
    effectSummary = 'Throbbing ache in the mouth, sensitivity when eating or drinking.';
    reasonSummary = 'The nerve inside or around the tooth gets irritated by bacteria, temperature, or pressure.';
    firstAid = [
      'Rinse your mouth gently with warm salt water (1/2 teaspoon of salt in a glass of warm water).',
      'Floss gently to remove any food particles stuck between teeth.',
      'Put an ice pack wrapped in a towel on your cheek for 15 minutes to reduce swelling.',
    ];
    warnings = [
      'DO NOT place aspirin tablets directly against your gums (it burns the skin).',
      'DO NOT bite down on hard ice, candy, or very sticky food.',
    ];
  } else if (lower.includes('fever') || lower.includes('temperature') || lower.includes('chills') || lower.includes('cold') || lower.includes('cough')) {
    condition = 'Common Viral Infection / Cold & Fever';
    category = 'General Illness';
    severity = painLevel >= 7 ? 'Moderate' : 'Mild';
    rationale = 'Your body is fighting off a common virus or infection.';
    causeSummary = 'Catching a common cold or viral infection.';
    effectSummary = 'Feeling warm, shivering, tiredness, body aches, and low energy.';
    reasonSummary = 'Your brain temporarily raises body temperature to help your immune system fight off viruses and bacteria.';
    firstAid = [
      'Rest in bed in a comfortable, quiet room with light blankets.',
      'Drink lots of fluids like water, warm lemon tea, and clear soups.',
      'Wipe forehead and neck with a lukewarm (not cold) damp cloth for comfort.',
    ];
    warnings = [
      'DO NOT take ice-cold showers (causes shivering and raises fever).',
      'DO NOT give aspirin to children or teenagers.',
    ];
  }

  return {
    conditionName: condition,
    category,
    severity,
    severityDescription: rationale,
    fivePointGuide: {
      cause: {
        title: '1. Cause',
        summary: causeSummary,
        details: [
          `Main trigger: "${symptoms || 'Reported symptom'}".`,
          'Direct physical strain or everyday exposure that temporarily overloaded the area.',
        ],
      },
      effect: {
        title: '2. Effect on Body',
        summary: effectSummary,
        details: [
          `Pain level rated around ${painLevel}/10.`,
          'Mild temporary swelling, tenderness, and stiffness.',
        ],
      },
      reason: {
        title: '3. Why It Happens',
        summary: reasonSummary,
        details: [
          'Your body naturally sends extra blood and immune cells to repair the irritated spot.',
          'Nerve endings send quick pain signals to tell your brain to protect the area while it heals.',
        ],
      },
      treatment: {
        title: '4. Treatment & What To Do',
        immediateFirstAid: firstAid,
        clinicalTreatments: [
          'Simple over-the-counter pain relief from a pharmacist if recommended.',
          'Gentle supportive wrapping or resting posture.',
        ],
        warnings: warnings,
      },
      diet: {
        title: '5. Healing Diet & Water',
        recommendedFoods: dietFoods,
        foodsToAvoid: avoidFoods,
        hydrationGuidance: 'Drink 6 to 8 glasses of fresh water daily to stay hydrated and support fast recovery.',
      },
    },
    whenToSeekDoctor: [
      'Pain gets much worse after 24-48 hours instead of getting better.',
      'You develop a high fever, severe spreading redness, or foul discharge.',
      'You feel sudden numbness, dizziness, or difficulty breathing.',
    ],
    disclaimer: 'This 5-point guide is for simple learning and educational purposes only. It is not a replacement for a doctor. Always check with a healthcare professional if you are worried.',
    analyzedAt: new Date().toISOString(),
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemini-3.1-flash-lite', timestamp: new Date().toISOString() });
});

app.post('/api/recommend', async (req, res) => {
  try {
    const {
      symptoms = '',
      painLevel = 4,
      duration = '1 - 3 hours ago',
      language = 'English',
      detailLevel = 'Standard',
      imageBase64,
      mimeType,
    } = req.body;

    if (!symptoms && !imageBase64) {
      return res.status(400).json({ error: 'Please provide symptom descriptions or upload an injury image.' });
    }

    const ai = getGeminiClient();

    if (ai) {
      const systemInstruction = `You are a helpful, empathetic, first-aid and wellness assistant.
Your goal is to explain health conditions in SIMPLE, CLEAR, EVERYDAY LANGUAGE (6th-grade reading level).

CRITICAL SIMPLICITY GUIDELINES:
- Avoid dense medical jargon (e.g., instead of "erythematous dermal vasodilation", say "redness and swelling from increased blood flow"; instead of "odontogenic pulpitis", say "toothache / irritated tooth nerve").
- Keep explanations short, clear, and direct.
- Use 2-3 simple, actionable bullet points per section.
- Follow the 5-Point Guide structure:
  1. Cause: What caused it in plain words?
  2. Effect: How does it feel and affect your body?
  3. Reason: Why does your body react this way in simple terms?
  4. Treatment: Easy first-aid steps at home, plus what NOT to do.
  5. Diet: Everyday foods and water intake that help healing, plus foods to avoid.

Language: ${language}.
Always include a simple disclaimer that this is educational advice and to see a doctor for serious issues.`;

      const promptText = `Please analyze this symptom report and provide a simple, easy-to-understand 5-Point Guide:
Symptom: "${symptoms || 'Assessing based on attached photo.'}"
Pain Level: ${painLevel}/10
Duration: ${duration}
Language: ${language}`;

      const parts: any[] = [];
      if (imageBase64) {
        const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z+]+;base64,/, '');
        const validMime = mimeType || 'image/jpeg';
        parts.push({
          inlineData: {
            mimeType: validMime,
            data: cleanBase64,
          },
        });
      }
      parts.push({ text: promptText });

      const responseSchema = {
        type: Type.OBJECT,
        properties: {
          conditionName: { type: Type.STRING, description: 'Simple common name of the condition (e.g., Twisted Ankle, Mild Burn, Tension Headache, Toothache)' },
          category: { type: Type.STRING, description: 'Simple category (e.g., Joint & Muscle, Skin & Burns, Head & Cold, Dental Care)' },
          severity: { type: Type.STRING, description: 'Mild, Moderate, or Severe / Seek Emergency Care' },
          severityDescription: { type: Type.STRING, description: 'One short sentence explaining severity in plain words' },
          fivePointGuide: {
            type: Type.OBJECT,
            properties: {
              cause: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '1. Cause' },
                  summary: { type: Type.STRING, description: '1 short simple sentence explaining what caused it' },
                  details: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 simple bullet points' },
                },
                required: ['title', 'summary', 'details'],
              },
              effect: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '2. Effect on Body' },
                  summary: { type: Type.STRING, description: '1 short sentence describing how it feels' },
                  details: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 simple bullet points' },
                },
                required: ['title', 'summary', 'details'],
              },
              reason: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '3. Why It Happens' },
                  summary: { type: Type.STRING, description: 'Simple explanation of the body healing response' },
                  details: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 simple bullet points' },
                },
                required: ['title', 'summary', 'details'],
              },
              treatment: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '4. Treatment & What To Do' },
                  immediateFirstAid: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 simple, practical first-aid steps' },
                  clinicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING }, description: '1-2 home care / pharmacist tips' },
                  warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 things NOT to do' },
                },
                required: ['title', 'immediateFirstAid', 'clinicalTreatments', 'warnings'],
              },
              diet: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '5. Healing Diet & Water' },
                  recommendedFoods: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 healthy foods that support healing' },
                  foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 foods/drinks to avoid' },
                  hydrationGuidance: { type: Type.STRING, description: 'Simple daily water goal' },
                },
                required: ['title', 'recommendedFoods', 'foodsToAvoid', 'hydrationGuidance'],
              },
            },
            required: ['cause', 'effect', 'reason', 'treatment', 'diet'],
          },
          whenToSeekDoctor: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 simple red flag signs to see a doctor' },
          disclaimer: { type: Type.STRING, description: 'Simple safety disclaimer' },
        },
        required: [
          'conditionName',
          'category',
          'severity',
          'severityDescription',
          'fivePointGuide',
          'whenToSeekDoctor',
          'disclaimer',
        ],
      };

      const candidateModels = ['gemini-3.1-flash-lite', 'gemini-3.7-flash'];

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: parts,
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema,
            },
          });

          if (response.text) {
            const cleanText = response.text.replace(/^```json\s*/, '').replace(/\s*```$/, '').trim();
            const parsed = JSON.parse(cleanText);
            parsed.analyzedAt = new Date().toISOString();
            return res.json(parsed);
          }
        } catch (err: any) {
          console.warn(`[Gemini API] Model ${modelName} error:`, err.message);
        }
      }
    }

    return res.json(generateSimpleFallback(symptoms, painLevel, duration, language));
  } catch (err: any) {
    return res.json(generateSimpleFallback('General discomfort'));
  }
});

export default app;
