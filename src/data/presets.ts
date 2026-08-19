import { PresetCase } from '../types';

export const PRESET_CASES: PresetCase[] = [
  {
    id: 'ankle-sprain',
    name: 'Ankle Inversion Injury / Sprain',
    badge: 'Orthopedic / Trauma',
    symptoms: 'Stepped awkwardly off a curb while jogging 3 hours ago. Heard a faint popping sensation. Experiencing localized lateral ankle swelling, throbbing pain when bearing weight, and mild bruising around the outer malleolus.',
    painLevel: 6,
    duration: '3 hours ago',
  },
  {
    id: 'kitchen-burn',
    name: 'Superficial Steam Burn',
    badge: 'Dermatological / Thermal',
    symptoms: 'Accidentally exposed left index finger and thumb to hot steam from a boiling kettle. Area is erythemic (bright red), sensitive to light touch, and has a small superficial intact blister forming. No charred skin or loss of sensation.',
    painLevel: 5,
    duration: '30 minutes ago',
  },
  {
    id: 'contact-dermatitis',
    name: 'Contact Dermatitis / Skin Rash',
    badge: 'Allergy / Dermatology',
    symptoms: 'Red, itchy, bumpy maculopapular rash developed across both forearms after gardening without gloves yesterday afternoon. Intense pruritus (itching) with slight warmth, no pus or systemic fever.',
    painLevel: 4,
    duration: '1 day ago',
  },
  {
    id: 'scraped-knee',
    name: 'Abrasion / Scraped Knee',
    badge: 'Wound Care',
    symptoms: 'Slipped on gravel pathway while riding bicycle. Superficial skin abrasion on right knee measuring approx 4cm x 3cm with slight oozing and embedded fine dirt particles. Pain on bending the knee joint.',
    painLevel: 4,
    duration: '1 hour ago',
  },
  {
    id: 'tension-headache',
    name: 'Tension-Type Headache & Neck Strain',
    badge: 'Neurological / Ergonomic',
    symptoms: 'Dull, band-like tightening pressure around the temples and forehead after 10 hours of continuous computer monitor work. Accompanied by stiffness in upper trapezius muscles. No visual aura, nausea, or fever.',
    painLevel: 5,
    duration: '6 hours',
  }
];
