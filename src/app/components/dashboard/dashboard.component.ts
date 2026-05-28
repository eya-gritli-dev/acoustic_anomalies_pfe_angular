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
    'GA1-a':   '#ef4444',
    'GA1-b':   '#f87171',
    'GA2-a':   '#f59e0b',
    'GA2-b':   '#fbbf24',
    'GA4':     '#fb923c',
    'GF1-A':   '#f97316',
    'GF2-AB':  '#dc2626',
    'GF3':     '#10b981',
    'GF5-O':   '#8b5cf6',
    'GF5-W':   '#a78bfa',
    'GF6-A/B': '#3b82f6',
    'GT1':     '#34d399',
    'GT2':     '#f59e0b',
    'GT3':     '#6ee7b7',
    'GT4':     '#2563eb',
    'GT5-A':   '#93c5fd',
    
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