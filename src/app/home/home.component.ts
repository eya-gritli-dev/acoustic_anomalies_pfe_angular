import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UploadComponent } from '../components/upload/upload.component';
import { DashboardComponent } from '../components/dashboard/dashboard.component';
import { PredictionResult } from '../models/prediction.model';
import { PredictionService } from '../services/prediction.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, UploadComponent, DashboardComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

  result: PredictionResult | null = null;
  apiOnline  = false;
  apiChecked = false;

  constructor(
    private predictionService: PredictionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.result = this.predictionService.lastResult;

    this.predictionService.checkHealth().subscribe({
      next: res => { this.apiOnline = res.status === 'ok'; this.apiChecked = true; },
      error: ()  => { this.apiOnline = false; this.apiChecked = true; },
    });
  }

  onResultReady(result: PredictionResult): void {
    this.result = result;
    this.predictionService.setResult(result);
    setTimeout(() => {
      document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }

navigateToFeedback(row: any): void {
  this.router.navigate(['/feedback'], {
    state: {
      prefill: {
        speaker:        row.speaker,        // ← déjà ajouté dans failedProducts
        type_test:      row.typeTest,        // ← déjà ajouté
        freq_min:       row.freqMin  ?? 0,
        freq_max:       row.freqMax  ?? 0,
        excess:         row.excess   ?? 0,
        label_original: row.causeLabel ?? row.causeCode ?? 'INCONNU',
        cause_code:     row.causeCode,
        cause_full:     row.causeFull,
        confidence:     row.confidence,
        machine:        row.machine,
        serial:         row.serial,
      }
    }
  });
}
get failedProducts() {
  if (!this.result) return [];
  const rows: any[] = [];
  for (const machine of this.result.machines) {
    for (const produit of machine.produits) {
      if (produit.status !== 'FAILED') continue;
      for (const anomaly of produit.anomalies) {

        // ← FIX : extraire depuis anomaly_type (dict retourné par predict_cause)
       const pred = (anomaly as any).anomaly_type ?? anomaly;

rows.push({
  machine:    machine.id_machine,
  serial:     produit.NS,
  causeCode:  pred.cause_code  ?? '—',
  causeFull:  pred.cause_full  ?? '—',
  causeLabel: pred.cause_label ?? '—',
  confidence: pred.confidence  ?? null,
  severity:   produit.status,
  top3:       pred.top3        ?? [],
  speaker:    (anomaly as any).speaker       ?? '—',
  typeTest:   (anomaly as any).type_test     ?? '—',
  freqMin:    (anomaly as any).frequence_min ?? 0,   // ← ajouter
  freqMax:    (anomaly as any).frequence_max ?? 0,   // ← ajouter
  excess:     (anomaly as any).excess        ?? 0,   // ← ajouter
});
      }
    }
  }
  return rows;
}
  

  /** Retourne la couleur associée au cause_code du nouveau modèle ML. */
  anomalyColor(causeCode: string): string {
    const colors: Record<string, string> = {
      'GA1-a':   '#ef4444',   // Mousse HF center
      'GA1-b':   '#f87171',   // Mousse acrylique woofer
      'GA2-a':   '#f59e0b',   // FNC basse fréquence
      'GA2-b':   '#fbbf24',   // Tunneur mal soudé
      'GA4':     '#fb923c',   // Bavure particules
      'GF1-A':   '#f97316',   // Soudure froide — classe v2 (manquait)
      'GF2-AB':  '#dc2626',   // Désalignement mécanique — classe v2
// SUPPRI      'GF5-O':   '#8b5cf6',   // Cause physique  // THD matière tweeter/mid
      'GF5-W':   '#a78bfa',   // Défaut bobine BF
      'GF6-A/B': '#3b82f6',   // Coat PCBA — classe v2
   // Coat PCBA
      'GT1':     '#34d399',   // Fuite vérin caisson
      'GT2':     '#f59e0b',   // Vis plateau banc de test
      'GT3':     '#6ee7b7',   // Cable coax micro
      'GT4':     '#2563eb',   // Calibration offset
      'GT5-A':   '#93c5fd',   // Capteur défaillant
    };
    return colors[causeCode] ?? '#94a3b8';
  }

  /** Retourne un libellé court lisible à partir du cause_full. */
  causeShortLabel(causeFull: string): string {
    if (!causeFull) return '—';
    const parts = causeFull.split('—');
    return parts.length > 1 ? parts[1].trim() : causeFull.trim();
  }

  /** Formate la confiance en pourcentage lisible. */
  formatConfidence(confidence: number | null | undefined): string {
    if (confidence == null) return '—';
    return (confidence * 100).toFixed(1) + '%';
  }

  reset(): void {
    this.result = null;
    this.predictionService.setResult(null);
  }
}