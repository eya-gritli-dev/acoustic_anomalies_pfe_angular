import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardStats } from '../../models/prediction.model';
import { getAnomalyLabel, getAnomalyDescription, ANOMALY_META } from '../../models/anomaly_labels';

interface ChartBar {
  code: string;       // code brut ex: "S_THD_Bobine"
  label: string;      // label lisible ex: "THD — Désalignement bobine"
  description: string;
  count: number;
  pct: number;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnChanges {

  @Input() stats!: DashboardStats;

  anomalyBars: ChartBar[] = [];
  speakerBars: ChartBar[] = [];
  testBars: ChartBar[] = [];

  // Exposer les helpers au template
  getAnomalyLabel = getAnomalyLabel;
  getAnomalyDescription = getAnomalyDescription;

  private readonly ANOMALY_COLORS: Record<string, string> = {
    W_THD_Process_Jig:  '#ef4444',
    W_THD_General:      '#f87171',
    W_FR_Deficit:       '#f59e0b',
    W_FR_Exces:         '#fb923c',
    W_RB_Adhesif:       '#f97316',
    W_RB_Bobine:        '#dc2626',
    W_RB_LeadWire:      '#ea580c',
    S_THD_Aimant:       '#10b981',
    S_THD_Bobine:       '#34d399',
    S_THD_General:      '#6ee7b7',
    S_FR_Aimant_Fluide: '#8b5cf6',
    S_FR_Resonance:     '#a78bfa',
    S_FR_Anomalie:      '#c4b5fd',
    S_RB_Adhesif:       '#f97316',
    S_RB_LeadWire:      '#3b82f6',
    S_RB_Bobine_BF:     '#2563eb',
    S_RB_Anomalie:      '#93c5fd',
    INCONNU:            '#94a3b8',
  };

  readonly SPEAKER_COLORS: Record<string, string> = {
    Woofer: '#1a56db',
    Center: '#10b981',
    Left:   '#f59e0b',
    Right:  '#8b5cf6',
  };

  private readonly TEST_COLORS: Record<string, string> = {
    THD:                '#ef4444',
    RubBuzz:            '#1a56db',
    Frequency_Response: '#10b981',
  };

  get totalAtRisk(): number {
    return (this.stats as any)?.total_at_risk ?? 0;
  }

  ngOnChanges(): void {
    if (!this.stats) return;

    this.anomalyBars = this._toAnomalyBars(this.stats.anomaly_types || {});
    this.speakerBars = this._toBars(this.stats.by_speaker || {}, this.SPEAKER_COLORS);
    this.testBars    = this._toBars(this.stats.by_test    || {}, this.TEST_COLORS);
  }

  /** Barres pour les types d'anomalies — avec label lisible + description */
  private _toAnomalyBars(data: Record<string, number>): ChartBar[] {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({
        code,
        label:       getAnomalyLabel(code),
        description: getAnomalyDescription(code),
        count,
        pct:   Math.round((count / total) * 100),
        color: this.ANOMALY_COLORS[code.trim()] ?? '#94a3b8',
      }));
  }

  /** Barres génériques (speaker, test) — label = clé brute */
  private _toBars(
    data: Record<string, number>,
    colorMap: Record<string, string>
  ): ChartBar[] {
    const total = Object.values(data).reduce((a, b) => a + b, 0) || 1;

    return Object.entries(data)
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({
        code,
        label:       code,
        description: '',
        count,
        pct:   Math.round((count / total) * 100),
        color: colorMap[code.trim()] ?? '#94a3b8',
      }));
  }

  get passRateColor(): string {
    const r = this.stats?.pass_rate ?? 0;
    if (r >= 90) return '#16a34a';
    if (r >= 70) return '#f59e0b';
    return '#dc2626';
  }

  get passRateBg(): string {
    const r = this.stats?.pass_rate ?? 0;
    if (r >= 90) return '#f0fdf4';
    if (r >= 70) return '#fffbeb';
    return '#fef2f2';
  }

  get gaugeArc(): string {
    const r = this.stats?.pass_rate ?? 0;
    const radius = 28;
    const circ = 2 * Math.PI * radius;
    return `${(r / 100) * circ} ${circ}`;
  }
}