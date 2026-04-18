// src/app/models/anomaly-labels.ts

export interface AnomalyMeta {
  label: string;
  description: string;
}

export const ANOMALY_META: Record<string, AnomalyMeta> = {

  // ── WOOFER ────────────────────────────────────────────────────────────────
  W_THD_Process_Jig: {
    label: 'THD — Outillage / Collage',
    description:
      'THD élevé (jusqu\'à 3,4 %) causé par des gabarits (jigs) usés, ' +
      'mal calibrés ou un processus de collage non automatisé sans vérification formelle.',
  },
  W_THD_General: {
    label: 'THD — Défaut mécanique',
    description: 'Distorsion THD due à un défaut mécanique ou process non identifié précisément.',
  },
  W_FR_Deficit: {
    label: 'Réponse en fréquence faible',
    description:
      'FR insuffisante : aimant de taille insuffisante (force BL trop faible) ' +
      'ou fluide magnétique de viscosité inadaptée.',
  },
  W_FR_Exces: {
    label: 'Réponse en fréquence excessive',
    description: 'FR excessive causée par une résonance mécanique ou un problème de montage.',
  },
  W_RB_Adhesif: {
    label: 'Rub & Buzz — Adhésif manquant',
    description:
      'Absence ou insuffisance d\'adhésif sur le fil conducteur (lead wire) : ' +
      'le fil vibre librement dans l\'entrefer → résonance 4–5 kHz.',
  },
  W_RB_Bobine: {
    label: 'Rub & Buzz — Désalignement bobine',
    description:
      'Désalignement de la bobine vocale (voice coil), souvent dû à un jig usé ' +
      'ou mal remplacé → frottement mécanique en basses fréquences (< 500 Hz).',
  },
  W_RB_LeadWire: {
    label: 'Rub & Buzz — Position fil conducteur',
    description:
      'Distance excessive entre le point de sortie du fil et l\'encoche du support : ' +
      'le fil touche la bobine → contact mécanique.',
  },

  // ── SATELLITE (MIDRANGE) ──────────────────────────────────────────────────
  S_THD_Aimant: {
    label: 'THD — Aimant insuffisant',
    description:
      'Champ magnétique (force BL) trop faible dû à un aimant sous-dimensionné → ' +
      'distorsion THD à basse fréquence (< 1 kHz). Solution : aimant agrandi.',
  },
  S_THD_Bobine: {
    label: 'THD — Désalignement bobine',
    description:
      'Désalignement du cache-poussière (dust cap) avec hauteur NG moyenne de 0,317 mm ' +
      '(vs < 0,06 mm pour les pièces conformes) → distorsion en médium/haute fréquence.',
  },
  S_THD_General: {
    label: 'THD — Distorsion générale',
    description: 'Distorsion THD sans cause racine identifiée précisément.',
  },
  S_FR_Aimant_Fluide: {
    label: 'FR faible — Aimant / Fluide magnétique',
    description:
      'Réponse en fréquence insuffisante sous 1 kHz : aimant insuffisant ' +
      'ou fluide magnétique trop fluide (nécessite version haute viscosité).',
  },
  S_FR_Resonance: {
    label: 'FR excessive — Résonance mécanique',
    description: 'Réponse en fréquence excessive causée par une résonance mécanique.',
  },
  S_FR_Anomalie: {
    label: 'FR — Anomalie non classifiée',
    description: 'Anomalie de réponse en fréquence sans classification précise.',
  },
  S_RB_Adhesif: {
    label: 'Rub & Buzz — Adhésif manquant (4–5 kHz)',
    description:
      'Absence d\'adhésif sur le fil conducteur → vibration libre dans l\'entrefer ' +
      '→ résonance localisée entre 4 et 5 kHz.',
  },
  S_RB_Bobine_BF: {
    label: 'Rub & Buzz — Désalignement bobine BF',
    description:
      'Désalignement de la bobine vocale → frottement mécanique en basse fréquence.',
  },
  S_RB_LeadWire: {
    label: 'Rub & Buzz — Fil conducteur sur bobine',
    description:
      'Le fil conducteur (lead wire) touche la bobine en raison d\'un mauvais ' +
      'positionnement → vibration mécanique en médium fréquence.',
  },
  S_RB_Anomalie: {
    label: 'Rub & Buzz — Anomalie non classifiée',
    description: 'Rub & Buzz sans cause racine identifiée précisément.',
  },

  INCONNU: {
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