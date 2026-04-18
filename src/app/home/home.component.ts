import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from '../components/upload/upload.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { PredictionResult } from '../models/prediction.model';
import { PredictionService } from '../services/prediction.service';
import { getAnomalyDescription, getAnomalyLabel } from '../models/anomaly_labels';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  result: PredictionResult | null = null;
  apiOnline = false;
  apiChecked = false;
  getAnomalyLabel = getAnomalyLabel;
  getAnomalyDescription = getAnomalyDescription;

  constructor(private predictionService: PredictionService) {
    this.predictionService.checkHealth().subscribe({
      next: res => { this.apiOnline = res.status === 'ok'; this.apiChecked = true; },
      error: ()  => { this.apiOnline = false; this.apiChecked = true; },
    });
  }

  onResultReady(result: PredictionResult): void {
    this.result = result;
    // Scroll automatique vers les résultats
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

  // ── Helpers pour le tableau des produits FAILED ──────────────────────────
  get failedProducts() {
    if (!this.result) return [];
    const rows: {
      machine: string;
      serial: string;
      anomalyType: string;
      speaker: string;
      test: string;
      freqMin: number;
      freqMax: number;
      excess: number;
    }[] = [];

    for (const machine of this.result.machines) {
      for (const produit of machine.produits) {
        if (produit.status !== 'FAILED') continue;
        for (const anomaly of produit.anomalies) {
          rows.push({
            machine:    machine.id_machine,
            serial:     produit.NS,
            anomalyType: anomaly.anomaly_type,
            speaker:    anomaly.speaker,
            test:       anomaly.type_test,
            freqMin:    anomaly.frequence_min,
            freqMax:    anomaly.frequence_max,
            excess:     anomaly.excess,
          });
        }
      }
    }
    return rows;
  }

  anomalyColor(type: string): string {
  const colors: Record<string, string> = {
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
  return colors[type] ?? '#94a3b8';
}

  reset(): void {
    this.result = null;
  }
}