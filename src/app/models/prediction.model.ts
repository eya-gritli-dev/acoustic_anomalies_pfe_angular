export interface Anomaly {
  speaker: string;
  type_test: string;
  frequence_min: number;
  frequence_max: number;
  valeur: number;
  excess: number;
  comparison_type: string;

  anomaly_type: string; // ML ou rule-based
  severity: 'FAILED' | 'AT_RISK' | 'PASSED';

  description?: string; // optionnel (si envoyé par backend)
}

export interface Produit {
  NS: string;
  status: 'PASSED' | 'FAILED' | 'AT_RISK';
  anomalies: Anomaly[];
}

export interface Machine {
  id_machine: string;
  produits: Produit[];
}

export interface DashboardStats {
  total_products: number;
  total_passed: number;
  total_failed: number;
  total_at_risk: number;

  pass_rate: number;

  anomaly_types: Record<string, number>;
  by_speaker: Record<string, number>;
  by_test: Record<string, number>;
  by_severity: Record<string, number>;
}

export interface PredictionResult {
  machines: Machine[];
  stats: DashboardStats;
}