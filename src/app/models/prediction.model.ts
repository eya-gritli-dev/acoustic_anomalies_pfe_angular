// APRÈS — nouveau modèle
export interface Anomaly {
  // Features brutes (colonnes CSV)
  spk_woofer: number;
  spk_center: number;
  spk_right: number;
  spk_left: number;
  spk_mid_any: number;
  test_thd_ok: number; test_thd_pic: number; test_thd_chute: number;
  test_thd_decalage: number; test_thd_absence: number;
  test_rb_ok: number;  test_rb_pic: number;  test_rb_chute: number;
  test_rb_decalage: number; test_rb_absence: number;
  test_fr_ok: number;  test_fr_pic: number;  test_fr_chute: number;
  test_fr_decalage: number; test_fr_absence: number;
  freq_basse: number; freq_med: number; freq_haute: number;
  flag_multi_spk: number; flag_all_freq: number; flag_aberrant: number;
  val_thd: number; val_rb: number; val_freq: number;
  pct_dep_thd: number; pct_dep_rb: number; pct_dep_fr: number;
  pct_dep_max: number;

  speaker?: string;    // ex: "Woofer", "Center", "Left", "Right"
  type_test?: string;  
  // Résultat ML
  cause_full: string;    // "GA1-a — Mousse HF center"
  cause_code: string;    // "GA1-a"
  cause_label: string;   // "Mousse HF center"
  confidence: number;    // 0.0 – 1.0
  top3?: { cause: string; code: string; label: string; prob: number }[];

  severity: 'FAILED' | 'AT_RISK' | 'PASSED';
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