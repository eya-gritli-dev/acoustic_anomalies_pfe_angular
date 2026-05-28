// src/app/models/anomaly-labels.ts

export interface AnomalyMeta {
  label: string;
  description: string;
}

export const ANOMALY_META: Record<string, AnomalyMeta> = {

  'GA1-a': {
    label: 'Mousse HF center/mid',
    description:
      'Mousse haute fréquence mal positionnée ou absente sur le speaker center/mid ' +
      '→ anomalie de réponse en fréquence en haute fréquence (> 2 kHz).',
  },
  'GA1-b': {
    label: 'Mousse acrylique woofer',
    description:
      'Mousse acrylique du woofer absente ou mal collée ' +
      '→ résonance mécanique en basse fréquence (< 500 Hz).',
  },
  'GA2-a': {
    label: 'FNC basse fréquence',
    description:
      'Défaut de fond de caisson (FNC) générant une anomalie acoustique ' +
      'localisée en basse fréquence (< 500 Hz).',
  },
  'GA2-b': {
    label: 'Tunneur mal soudé',
    description:
      'Soudure défectueuse sur le tunneur → perturbation électromécanique ' +
      'se manifestant par un pic ou décalage sur THD ou Rub & Buzz.',
  },
  'GA4': {
    label: 'Bavure / particules',
    description:
      'Présence de particules ou bavures dans l\'entrefer ' +
      '→ frottement mécanique, souvent détecté en Rub & Buzz basse fréquence.',
  },
  'GF1-A': {
    label: 'Soudure froide',
    description:
      'Mauvaise soudure (cold solder) sur les connexions électriques du speaker ' +
      '→ chute profonde de la réponse en fréquence (val_fr élevé).',
  },
  'GF2-AB': {
    label: 'Désalignement mécanique',
    description:
      'Désalignement de la bobine vocale ou du cache-poussière ' +
      '→ frottement mécanique détecté en THD ou Rub & Buzz, ' +
      'souvent en basse ou moyenne fréquence.',
  },
  'GF3': {
    label: 'Lead wire résonance',
    description:
      'Fil conducteur (lead wire) mal fixé ou sans adhésif ' +
      '→ résonance localisée entre 4 et 5 kHz sur le test Rub & Buzz.',
  },
  'GF5-O': {
    label: 'Cause physique à confirmer',
    description:
      'Anomalie détectée par le modèle ML mais cause physique non confirmée ' +
      '→ nécessite inspection manuelle du speaker.',
  },
  'GF5-W': {
    label: 'Défaut bobine / aimant BF',
    description:
      'Défaut de la bobine vocale ou de l\'aimant générant une distorsion THD ' +
      'en basse fréquence (< 500 Hz) sur le woofer.',
  },
  'GF6-A/B': {
    label: 'Coat PCBA',
    description:
      'Vernis de protection (coat) sur la carte électronique (PCBA) mal appliqué ' +
      '→ perturbation électrique affectant le signal acoustique.',
  },
  'GT1': {
    label: 'Fuite vérin caisson',
    description:
      'Fuite d\'air au niveau du vérin du caisson de test ' +
      '→ anomalie de type test (bruit ambiant), non liée au speaker lui-même.',
  },
  'GT2': {
    label: 'Vis plateau banc de test',
    description:
      'Vis du plateau du banc de test desserrée ou absente ' +
      '→ vibration parasite affectant tous les speakers du produit (flag_multi_spk).',
  },
  'GT3': {
    label: 'Cable coax micro',
    description:
      'Câble coaxial du microphone de test défectueux ou mal connecté ' +
      '→ signal bruité affectant la mesure acoustique.',
  },
  'GT4': {
    label: 'Calibration offset',
    description:
      'Décalage de calibration du banc de test (offset global) ' +
      '→ tous les speakers du produit présentent un décalage uniforme (flag_multi_spk).',
  },
  'GT5-A': {
    label: 'Capteur défaillant',
    description:
      'Capteur acoustique (microphone) du banc de test défaillant ' +
      '→ valeurs aberrantes ou absence de signal sur un ou plusieurs speakers.',
  },

  'INCONNU': {
    label: 'Défaut non classifié',
    description: 'Anomalie détectée mais non classifiée par le système.',
  },
};

/** Retourne le label lisible, ou le code brut si inconnu */
export function getAnomalyLabel(code: string): string {
  return ANOMALY_META[code]?.label ?? code;
}

/** Retourne la description complète */
export function getAnomalyDescription(code: string): string {
  return ANOMALY_META[code]?.description ?? 'Aucune description disponible.';
}