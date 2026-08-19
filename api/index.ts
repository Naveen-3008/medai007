import { GoogleGenAI, Type } from '@google/genai';

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
  const isTamil = language === 'Tamil' || language === 'தமிழ்';

  if (isTamil) {
    let condition = 'லேசான தசை அல்லது திசு சுளுக்கு';
    let category = 'முதலுதவி & வீட்டுப் பராமரிப்பு';
    let severity: 'Mild' | 'Moderate' | 'Severe / Seek Emergency Care' = 'Mild';
    let rationale = `வலி நிலை ${painLevel}/10. வீட்டிலேயே எளிய பராமரிப்பு மூலம் குணப்படுத்தலாம்.`;
    let causeSummary = 'திடீர் அசைவு, அதிக எடை தூக்குதல் அல்லது தசை பிடிப்பு காரணமாக ஏற்படுகிறது.';
    let effectSummary = 'லேசான வீக்கம், அசைக்கும் போது வலி மற்றும் தசை இறுக்கம் உணரப்படலாம்.';
    let reasonSummary = 'தசை திசுக்கள் பாதிக்கப்படும் போது, அதை குணப்படுத்த உடல் அதிக ரத்த ஓட்டத்தை அனுப்புகிறது; அதனால் வீக்கமும் வலியும் ஏற்படுகிறது.';
    let firstAid = [
      'ஓய்வு: வலி உள்ள பகுதிக்கு முழு ஓய்வு கொடுங்கள்.',
      'ஐஸ் ஒத்தடம்: துணியில் சுற்றப்பட்ட ஐஸ் கட்டியை 15 நிமிடங்கள் வையுங்கள்.',
      'உயர்த்தி வைத்தல்: வீக்கம் குறைய காலையோ கையையோ தலையணை மீது உயர்த்தி வையுங்கள்.',
    ];
    let clinicalTreatments = [
      'மருந்தகத்தில் எளிய வலி நிவாரண மாத்திரைகள் குறித்து கேட்டுப் பெறலாம்.',
      'லேசான எலாஸ்டிக் பேண்டேஜ் கட்டுப்போட்டு தாங்குதல் அளிக்கலாம்.',
    ];
    let warnings = [
      'கடும் வலி இருக்கும் போது அதிக எடையைத் தூக்கக் கூடாது.',
      'ஐஸ் கட்டியை நேரடியாக தோலில் வைக்கக் கூடாது.',
    ];
    let dietFoods = [
      'நிறைய சுத்தமான தண்ணீர் குடிக்கவும்.',
      'முட்டை, பயறு வகைகள் போன்ற புரத உணவுகள் தசை வளர்ச்சிக்கு உதவும்.',
      'வைட்டமின் சி நிறைந்த எலுமிச்சை, நெல்லிக்காய், பழங்கள் சாப்பிடவும்.',
    ];
    let avoidFoods = [
      'அதிக காரமான மற்றும் எண்ணெய் பலகாரங்களைத் தவிர்க்கவும்.',
      'அதிக உப்பு உள்ள உணவுகளைக் குறைக்கவும்.',
    ];

    if (lower.includes('burn') || lower.includes('steam') || lower.includes('heat') || lower.includes('தீ') || lower.includes('சுடு')) {
      condition = 'லேசான தீக்காயம் / கொதிநீர் காயம்';
      category = 'தோல் & தீக்காய பராமரிப்பு';
      causeSummary = 'சூடான பாத்திரம், சுடுநீர் அல்லது நீராவி பட்டதால் ஏற்பட்ட காயம்.';
      effectSummary = 'தோல் சிவத்தல், எரிச்சல் மற்றும் சிறிய கொப்புளம் ஏற்படலாம்.';
      reasonSummary = 'வெப்பம் தோலின் மேல் அடுக்கை சேதப்படுத்துகிறது; உடல் அந்த இடத்தை குளிர்விக்க திரவத்தை அனுப்புவதால் கொப்புளம் ஏற்படுகிறது.';
      firstAid = [
        'உடனே சாதாரண குளிர்ந்த குழாய் தண்ணீரில் 15-20 நிமிடங்கள் காட்டவும்.',
        'மோதிரம், வளையல் போன்றவற்றை வீக்கம் வருவதற்கு முன் கழற்றிவிடவும்.',
        'சுத்தமான துணியால் தளர்வாக மூடவும்.',
      ];
      warnings = ['ஐஸ் கட்டி, பற்பசை (toothpaste), எண்ணெய் அல்லது வெண்ணெய் தடவக் கூடாது.', 'கொப்புளங்களை உடைக்கக் கூடாது.'];
    } else if (lower.includes('ankle') || lower.includes('sprain') || lower.includes('சுளுக்கு') || lower.includes('கால்')) {
      condition = 'கால் சுளுக்கு / தசை பிடிப்பு';
      category = 'எலும்பு & தசை பராமரிப்பு';
      causeSummary = 'நடக்கும் போதோ அல்லது விளையாடும் போதோ கால் தவறாக மடிந்ததால் ஏற்பட்டது.';
      effectSummary = 'கணுக்காலில் வீக்கம் மற்றும் காலை ஊன்றி நடக்க முடியாத வலி.';
      reasonSummary = 'எலும்புகளை இணைக்கும் தசைநார்கள் அளவுக்கு அதிகமாக இழுக்கப்பட்டதால் வீக்கம் ஏற்பட்டுள்ளது.';
      firstAid = [
        'ஓய்வு: அந்த காலில் எடையை வைத்து நடக்க வேண்டாம்.',
        'ஐஸ்: துணியில் சுற்றிய ஐஸ் கட்டியை 15 நிமிடங்கள் ஒத்தடம் கொடுக்கவும்.',
        'கட்டு: லேசான பேண்டேஜ் துணியால் கட்டுப்போடவும்.',
        'உயர்த்துதல்: கால்களை தலையணை மீது உயர்த்தி வைக்கவும்.',
      ];
      warnings = ['வலியோடு நடக்கவோ ஓடவோ கூடாது.', 'முதல் 2 நாட்களுக்கு சுடுநீர் ஒத்தடம் கொடுக்கக் கூடாது.'];
    }

    return {
      conditionName: condition,
      category,
      severity,
      severityDescription: rationale,
      fivePointGuide: {
        cause: {
          title: '1. காரணம் (Cause)',
          summary: causeSummary,
          details: [
            `முக்கிய தூண்டுதல்: "${symptoms || 'தெரிவிக்கப்பட்ட அறிகுறி'}".`,
            'திடீர் உடல் உழைப்பு அல்லது வெப்பப் பாதிப்பு காரணமாக ஏற்பட்டுள்ளது.',
          ],
        },
        effect: {
          title: '2. உடலில் ஏற்படும் தாக்கம் (Effect)',
          summary: effectSummary,
          details: [
            `வலி அளவு: ${painLevel}/10.`,
            'லேசான வீக்கம், எரிச்சல் மற்றும் அசைக்க சிரமம்.',
          ],
        },
        reason: {
          title: '3. ஏன் ஏற்படுகிறது? (Why It Happens)',
          summary: reasonSummary,
          details: [
            'பாதிக்கப்பட்ட இடத்தை குணப்படுத்த உடல் ரத்த ஓட்டத்தையும் வெள்ளை அணுக்களையும் அங்கு அனுப்புகிறது.',
            'உடலை பாதுகாக்க மூளைக்கு வலி சமிக்ஞைகள் அனுப்பப்படுகின்றன.',
          ],
        },
        treatment: {
          title: '4. சிகிச்சை & முதலுதவி (Treatment & First-Aid)',
          immediateFirstAid: firstAid,
          clinicalTreatments: clinicalTreatments,
          warnings: warnings,
        },
        diet: {
          title: '5. குணமளிக்கும் உணவு & தண்ணீர் (Diet & Hydration)',
          recommendedFoods: dietFoods,
          foodsToAvoid: avoidFoods,
          hydrationGuidance: 'தினமும் 6 முதல் 8 டம்ளர் சுத்தமான குடிநீர் குடிக்கவும்.',
        },
      },
      whenToSeekDoctor: [
        '24-48 மணி நேரத்திற்குப் பிறகும் வலி மிக தீவிரமடைந்தால்.',
        'அதிக காய்ச்சல் அல்லது கடுமையான சீழ் பிடித்தால்.',
        'மயக்கம் அல்லது சுவாசிப்பதில் சிரமம் ஏற்பட்டால் உடனே மருத்துவரை அணுகவும்.',
      ],
      disclaimer: 'இது Mr Health AI வழங்கும் முதலுதவி வழிகாட்டி மட்டுமே. தீவிர பிரச்சனைக்கு உடனே மருத்துவரை அணுகவும்.',
      analyzedAt: new Date().toISOString(),
    };
  }

  // English Fallback
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
    category = 'Skin & Burn Care';
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
    disclaimer: 'This 5-point guide from Mr Health AI is for educational and first-aid guidance. Always check with a doctor for serious concerns.',
    analyzedAt: new Date().toISOString(),
  };
}

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    return res.status(200).json({
      status: 'ok',
      name: 'Mr Health AI Vercel API',
      timestamp: new Date().toISOString(),
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Handle translation if requested
  if (req.body?.action === 'translate' || req.query?.action === 'translate') {
    const { text, targetLanguage = 'Tamil' } = req.body;
    if (!text || !text.trim()) {
      return res.status(200).json({ translatedText: '' });
    }
    const ai = getGeminiClient();
    if (ai) {
      const isTargetTamil = targetLanguage === 'Tamil' || targetLanguage === 'தமிழ்';
      const prompt = isTargetTamil
        ? `Translate this medical symptom / health description from English to natural, simple everyday spoken & written Tamil (எளிய தமிழ்). Output ONLY the translated text without extra notes, quotes, or markdown:\n\n${text}`
        : `Translate this medical symptom / health description to clear, everyday English. Output ONLY the translated text without extra notes, quotes, or markdown:\n\n${text}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-lite',
          contents: prompt,
        });

        if (response.text) {
          const translated = response.text.trim().replace(/^["']|["']$/g, '');
          return res.status(200).json({ translatedText: translated });
        }
      } catch (err: any) {
        console.warn('Translation API error in Vercel:', err.message);
      }
    }

    return res.status(200).json({ translatedText: text });
  }

  try {
    const {
      symptoms = '',
      painLevel = 4,
      duration = '1 - 3 hours ago',
      language = 'English',
      detailLevel = 'Standard',
      imageBase64,
      mimeType,
    } = req.body || {};

    if (!symptoms && !imageBase64) {
      return res.status(400).json({ error: 'Please provide symptom descriptions or upload an injury image.' });
    }

    const ai = getGeminiClient();

    if (ai) {
      const isTamil = language === 'Tamil' || language === 'தமிழ்';

      const systemInstruction = isTamil
        ? `நீங்கள் 'Mr Health AI' என்ற புத்திசாலித்தனமான, அன்பான மருத்துவ முதலுதவி AI உதவியாளர்.
நீங்கள் பயனரின் உடல் அறிகுறிகளைப் பகுப்பாய்வு செய்து மிக எளிய, தெளிவான அன்றாடப் பேச்சுத் தமிழில் (Simple spoken & written Tamil) 5-புள்ளி வழிகாட்டியை வழங்க வேண்டும்.

முக்கிய விதிகள்:
- அனைத்து விளக்கங்களும் எளிய தமிழில் இருக்க வேண்டும் (கடினமான மருத்துவ சொற்களைத் தவிர்க்கவும்).
- 5-புள்ளி கட்டமைப்பு:
  1. காரணம் (Cause): எளிய தமிழில் என்ன காரணம்?
  2. உடலில் ஏற்படும் தாக்கம் (Effect): உடலில் என்ன நிகழ்கிறது, வலி/வீக்கம் எப்படி இருக்கும்?
  3. ஏன் ஏற்படுகிறது (Reason): உடல் எவ்வாறு இயற்கையாக அதை சரிசெய்ய முனைகிறது?
  4. சிகிச்சை & முதலுதவி (Treatment): வீட்டிலேயே செய்யக்கூடிய 3 எளிய முதலுதவி படிகள், மற்றும் செய்யக்கூடாதவை.
  5. உணவு & தண்ணீர் (Diet): குணமடைய உதவும் எளிய உணவுகள் மற்றும் குடிநீர் வழிகாட்டல்.`
        : `You are Mr Health AI, a smart, friendly, empathetic health & first-aid AI assistant.
Your goal is to explain health conditions in SIMPLE, CLEAR, EVERYDAY LANGUAGE (6th-grade reading level).

CRITICAL SIMPLICITY GUIDELINES:
- Avoid dense medical jargon.
- Keep explanations short, clear, and direct.
- Use 2-3 simple, actionable bullet points per section.
- Follow the 5-Point Guide structure:
  1. Cause: What caused it in plain words?
  2. Effect: How does it feel and affect your body?
  3. Reason: Why does your body react this way in simple terms?
  4. Treatment: Easy first-aid steps at home, plus what NOT to do.
  5. Diet: Everyday foods and water intake that help healing, plus foods to avoid.

Language: ${language}.
Always include a simple disclaimer that this is educational advice from Mr Health AI and to see a doctor for serious issues.`;

      const promptText = `Please analyze this symptom report and provide a simple, easy-to-understand 5-Point Guide in ${language}:
Symptom: "${symptoms || 'Assessing based on attached photo.'}"
Pain Level: ${painLevel}/10
Duration: ${duration}
Language requested: ${language}`;

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
          conditionName: { type: Type.STRING, description: 'Simple common name of condition in the requested language' },
          category: { type: Type.STRING, description: 'Category in requested language' },
          severity: { type: Type.STRING, description: 'Mild, Moderate, or Severe / Seek Emergency Care' },
          severityDescription: { type: Type.STRING, description: 'One short sentence explaining severity in requested language' },
          fivePointGuide: {
            type: Type.OBJECT,
            properties: {
              cause: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '1. Cause' },
                  summary: { type: Type.STRING, description: '1 short simple sentence' },
                  details: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 simple bullet points' },
                },
                required: ['title', 'summary', 'details'],
              },
              effect: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '2. Effect on Body' },
                  summary: { type: Type.STRING, description: '1 short sentence' },
                  details: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 simple bullet points' },
                },
                required: ['title', 'summary', 'details'],
              },
              reason: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: '3. Why It Happens' },
                  summary: { type: Type.STRING, description: 'Simple explanation' },
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
                  recommendedFoods: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 healthy foods' },
                  foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING }, description: '2 foods to avoid' },
                  hydrationGuidance: { type: Type.STRING, description: 'Daily water goal' },
                },
                required: ['title', 'recommendedFoods', 'foodsToAvoid', 'hydrationGuidance'],
              },
            },
            required: ['cause', 'effect', 'reason', 'treatment', 'diet'],
          },
          whenToSeekDoctor: { type: Type.ARRAY, items: { type: Type.STRING }, description: '3 warning signs' },
          disclaimer: { type: Type.STRING, description: 'Safety disclaimer in requested language' },
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
            const parsedData = JSON.parse(cleanText);
            parsedData.analyzedAt = new Date().toISOString();
            return res.status(200).json(parsedData);
          }
        } catch (modelError: any) {
          console.warn(`[Mr Health AI Vercel] Model ${modelName} error:`, modelError.message);
        }
      }
    }

    const fallback = generateSimpleFallback(symptoms, painLevel, duration, language);
    return res.status(200).json(fallback);
  } catch (error: any) {
    console.error('Error in Vercel handler:', error);
    const fallback = generateSimpleFallback('General discomfort', 4, 'Recent', 'English');
    return res.status(200).json(fallback);
  }
}
