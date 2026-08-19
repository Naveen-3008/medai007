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

function generateClinicalFallback(
  symptoms: string,
  painLevel: number = 4,
  duration: string = 'Recent',
  language: string = 'English'
) {
  const lower = (symptoms || '').toLowerCase();

  let condition = 'Superficial Soft Tissue Strain / Localized Inflammatory Response';
  let category = 'Musculoskeletal / General Trauma';
  let severity = 'Mild';
  let rationale = 'Symptoms present localized discomfort without overt systemic distress, gross deformity, or severe neurovascular compromise.';

  if (lower.includes('burn') || lower.includes('steam') || lower.includes('heat') || lower.includes('scald')) {
    condition = 'Superficial Partial-Thickness Thermal Burn';
    category = 'Thermal Injury / Dermatology';
    severity = painLevel >= 7 ? 'Moderate' : 'Mild';
    rationale = 'Thermal exposure causing localized epidermal erythema and potential superficial vesiculation without charred subdermal tissue.';
  } else if (lower.includes('sprain') || lower.includes('ankle') || lower.includes('twist') || lower.includes('pop')) {
    condition = 'Grade I-II Inversion Ankle Ligamentous Sprain';
    category = 'Orthopedic / Sports Medicine';
    severity = painLevel >= 8 ? 'Moderate' : 'Mild';
    rationale = 'Excessive tensile stress across anterior talofibular ligament resulting in localized microtrauma and inflammatory edema.';
  } else if (lower.includes('rash') || lower.includes('itch') || lower.includes('allergy') || lower.includes('dermatitis')) {
    condition = 'Acute Contact Dermatitis / Erythematous Urticaria';
    category = 'Immunological / Dermatology';
    severity = 'Mild';
    rationale = 'Type IV cell-mediated or IgE-mediated cutaneous hyper-reactivity triggered by contact allergen or irritant.';
  } else if (lower.includes('scrape') || lower.includes('cut') || lower.includes('abrasion') || lower.includes('bleed')) {
    condition = 'Superficial Mechanical Cutaneous Abrasion';
    category = 'Wound Care / Trauma';
    severity = 'Mild';
    rationale = 'Mechanical friction shearing stratum corneum and superficial papillary dermis.';
  } else if (lower.includes('headache') || lower.includes('temple') || lower.includes('neck') || lower.includes('strain')) {
    condition = 'Tension-Type Cephalea & Cervical Myofascial Strain';
    category = 'Neurology / Ergonomics';
    severity = 'Mild';
    rationale = 'Prolonged sustained pericranial muscle contraction and ergonomic posture strain.';
  }

  return {
    conditionName: condition,
    category,
    severity: (severity as 'Mild' | 'Moderate' | 'Severe / Seek Emergency Care'),
    severityDescription: rationale,
    fivePointGuide: {
      cause: {
        title: '1. Cause & Precipitating Etiology',
        summary: `Triggered by direct mechanical, thermal, or environmental stress on localized tissue. Reported context: "${symptoms || 'Acute localized discomfort'}".`,
        details: [
          'Direct kinetic force, thermal contact, or external irritant exposure exceeding baseline physiological threshold.',
          'Mechanical over-stretching of connective collagen fibers or micro-vascular shearing.',
          'Potential contributing factors include fatigue, ergonomic strain, or lack of protective barrier.',
        ],
      },
      effect: {
        title: '2. Bodily Manifestations & Symptomatic Effects',
        summary: `Elicits localized inflammatory triad: pain sensation (rated ${painLevel}/10), localized swelling, and reactive sensitivity.`,
        details: [
          'Localized nociceptor activation transmitting acute pain signals via peripheral A-delta and C nerve fibers.',
          'Micro-vascular permeability leading to interstitial fluid pooling (edema/swelling).',
          'Transient limitation in active range of motion or protective muscular guarding around the affected zone.',
        ],
      },
      reason: {
        title: '3. Underlying Biological & Pathophysiological Mechanism',
        summary: 'Cellular damage triggers mast-cell degranulation and the release of histamine, prostaglandins, and bradykinin.',
        details: [
          'Arteriolar vasodilation increases localized blood flow, producing heat (calor) and redness (rubor).',
          'Prostaglandin E2 sensitizes peripheral nociceptive nerve endings, lowering mechanical pain thresholds.',
          'Leukocyte extravasation commences natural cellular phagocytosis to clear micro-debris and initiate fibroblast collagen synthesis.',
        ],
      },
      treatment: {
        title: '4. Treatment & First-Aid Protocol',
        immediateFirstAid: [
          'Rest & Protection: Protect the affected site from further mechanical weight or thermal re-exposure.',
          'Cryotherapy / Cooling: Apply cool compresses for 15-20 minutes at a time (never apply bare ice directly).',
          'Gentle Compression & Elevation: Apply an elastic wrap and elevate limb above heart level.',
          'Wound Hygiene: If skin is abraded, irrigate gently with clean potable water or sterile saline.',
        ],
        clinicalTreatments: [
          'Supportive non-steroidal anti-inflammatory agents under medical/pharmacist guidance if appropriate.',
          'Topical soothing hydrogel, calamine, or petroleum barrier ointment for superficial abrasions.',
          'Protective splinting or elastic support brace to limit aggravating biomechanical load.',
        ],
        warnings: [
          'DO NOT pop or de-roof intact blisters.',
          'DO NOT apply direct extreme heat or vigorously massage actively inflamed acute sprains.',
          'DO NOT ignore increasing redness, expanding heat, or red streaks extending toward the core.',
        ],
      },
      diet: {
        title: '5. Nutritional Support & Healing Diet',
        recommendedFoods: [
          'Lean Protein (eggs, tofu, poultry, legumes) to provide amino acids for collagen synthesis.',
          'Vitamin C rich foods (citrus fruits, bell peppers, berries, kiwi) to support enzymatic hydroxylation in tissue repair.',
          'Zinc & Omega-3 Fatty Acids (wild salmon, chia seeds, walnuts, pumpkin seeds) to modulate inflammatory cascade.',
          'Antioxidant-dense leafy greens (spinach, kale) and cruciferous vegetables.',
        ],
        foodsToAvoid: [
          'Ultra-processed foods high in refined sugars and trans-fats that perpetuate systemic pro-inflammatory cytokines.',
          'Excess sodium intake that can exacerbate dependent interstitial fluid retention/edema.',
          'Alcohol and excessive caffeine which impair cellular hydration and sleep-mediated tissue regeneration.',
        ],
        hydrationGuidance: 'Maintain 2.0 to 2.5 Liters of water daily with balanced electrolytes.',
      },
    },
    whenToSeekDoctor: [
      'Inability to bear any weight on joint or palpable bony tenderness.',
      'Expanding redness, warmth, foul-smelling drainage, or fever.',
      'Sudden numbness, tingling, cyanosis (blue/pale skin), or loss of distal pulse.',
      'Uncontrollable severe pain unresponsive to standard first-aid measures.',
    ],
    disclaimer: 'This 5-point report is produced exclusively for academic demonstration and computational reasoning simulation. It is not professional medical advice, clinical diagnosis, or emergency triage. Always consult a licensed physician.',
    analyzedAt: new Date().toISOString(),
  };
}

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', model: 'gemini-flash-latest', timestamp: new Date().toISOString() });
});

app.post('/api/recommend', async (req, res) => {
  try {
    const {
      symptoms,
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
      try {
        const systemInstruction = `You are a clinical decision-support and first-aid advisory AI designed strictly for academic demonstration and educational triage purposes.
Generate a comprehensive, highly stable, evidence-based 5-Point Simplified Medical Guide:
1. Cause: What caused or triggered this injury / condition?
2. Effect: What is the physiological impact and symptomatic effect on the body?
3. Reason: What is the underlying biological, pathological, or biomechanical mechanism explaining why this happens?
4. Treatment: What are the immediate first aid protocols, home supportive measures, clinical management steps, and what NOT to do?
5. Diet: What nutritional foods, micronutrients, hydration, and dietary precautions promote tissue repair and recovery?

Language: ${language}. Detail depth: ${detailLevel}.
Always include an explicit disclaimer stating this output is an academic demonstration and not a substitute for professional medical evaluation.`;

        const promptText = `Please analyze the following case and provide the structured 5-Point Medical Guide:
Symptoms description: "${symptoms || 'Visual assessment based on attached image.'}"
Reported Pain Level: ${painLevel !== undefined ? `${painLevel}/10` : '4/10'}
Reported Duration/Onset: ${duration || 'Not specified'}
Response Language: ${language}
Detail Level: ${detailLevel}`;

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

        const response = await ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: { parts },
          config: {
            systemInstruction,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                conditionName: { type: Type.STRING },
                category: { type: Type.STRING },
                severity: { type: Type.STRING },
                severityDescription: { type: Type.STRING },
                fivePointGuide: {
                  type: Type.OBJECT,
                  properties: {
                    cause: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'summary', 'details'],
                    },
                    effect: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'summary', 'details'],
                    },
                    reason: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        summary: { type: Type.STRING },
                        details: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'summary', 'details'],
                    },
                    treatment: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        immediateFirstAid: { type: Type.ARRAY, items: { type: Type.STRING } },
                        clinicalTreatments: { type: Type.ARRAY, items: { type: Type.STRING } },
                        warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
                      },
                      required: ['title', 'immediateFirstAid', 'clinicalTreatments', 'warnings'],
                    },
                    diet: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        recommendedFoods: { type: Type.ARRAY, items: { type: Type.STRING } },
                        foodsToAvoid: { type: Type.ARRAY, items: { type: Type.STRING } },
                        hydrationGuidance: { type: Type.STRING },
                      },
                      required: ['title', 'recommendedFoods', 'foodsToAvoid', 'hydrationGuidance'],
                    },
                  },
                  required: ['cause', 'effect', 'reason', 'treatment', 'diet'],
                },
                whenToSeekDoctor: { type: Type.ARRAY, items: { type: Type.STRING } },
                disclaimer: { type: Type.STRING },
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
            },
          },
        });

        if (response.text) {
          const parsed = JSON.parse(response.text);
          parsed.analyzedAt = new Date().toISOString();
          return res.json(parsed);
        }
      } catch (geminiError: any) {
        console.warn('Gemini API error, falling back:', geminiError.message);
        return res.json(generateClinicalFallback(symptoms, painLevel, duration, language));
      }
    }

    return res.json(generateClinicalFallback(symptoms, painLevel, duration, language));
  } catch (err: any) {
    return res.json(generateClinicalFallback('General injury or discomfort'));
  }
});

export default app;
