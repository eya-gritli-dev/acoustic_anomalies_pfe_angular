import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface FeedbackRow {
  id?: number;
  speaker: string;
  type_test: string;
  freq_min: number;
  freq_max: number;
  excess: number;
  label_original: string;
  label_corrige: string;
  expert: string;
  date?: string;
  used_in_training?: boolean;
}

@Component({
  selector: 'app-feedback',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit {

  private api = 'http://localhost:8000';

  // ── Formulaire ──────────────────────────────────────────────────────────────
  form: FeedbackRow = {
    speaker: '', type_test: '', freq_min: 0,
    freq_max: 0, excess: 0,
    label_original: 'INCONNU', label_corrige: '', expert: 'expert'
  };
  editingId: number | null = null;
  prefilled = false;

  // ── Stats & listes ──────────────────────────────────────────────────────────
  retrainStats: any       = null;
  pendingFeedbacks: FeedbackRow[] = [];

  // ── États UI formulaire ─────────────────────────────────────────────────────
  submitting  = false;
  submitMsg   = '';
  submitOk    = false;
  loadingList = false;
  deleteConfirmId: number | null = null;

  // ── Réentraînement ──────────────────────────────────────────────────────────
  retraining        = false;
  retrainMsg        = '';
  retrainOk         = false;
  retrainResult: any = null;
  confusionMatrixUrl: string | null = null;
  showReport        = false;   // toggle classification report

  // ── Import JSON auto ────────────────────────────────────────────────────────
  importingJson     = false;
  importMsg         = '';
  importOk          = false;
  importPreview: any = null;   // résultat dry-run avant insertion réelle
  showImportConfirm = false;

  // ── Labels connus du modèle ML ──────────────────────────────────────────────
knownTypes = [

  'GA1-a', 'GA1-b', 'GA2-a', 'GA2-b', 'GA4',

  'GF1-A', 'GF2-AB', 'GF3',                 // ← v2

  'GF5-O', 'GF5-W', 'GF6-A/B',              // ← v2

  'GT1',   'GT2',   'GT3',   'GT4',   'GT5-A'

];

  constructor(private http: HttpClient, private router: Router) {
    const nav     = this.router.getCurrentNavigation();
    const prefill = nav?.extras?.state?.['prefill'];
    if (prefill) {
      this.form = {
        speaker:        prefill.speaker        ?? '',
        type_test:      prefill.type_test      ?? prefill.typeTest ?? '',
        freq_min:       prefill.freq_min       ?? prefill.freqMin  ?? 0,
        freq_max:       prefill.freq_max       ?? prefill.freqMax  ?? 0,
        excess:         prefill.excess         ?? 0,
        label_original: prefill.cause_label    ?? prefill.label_original ?? 'INCONNU',
        label_corrige:  '',
        expert:         'expert',
      };
      this.prefilled = true;
    }
  }

  ngOnInit() {
    this.loadStats();
    this.loadPending();
  }

  loadStats() {
    this.http.get<any>(`${this.api}/retrain/stats`).subscribe({
      next: s  => this.retrainStats = s,
      error: () => {}
    });
  }

  loadPending() {
    this.loadingList = true;
    this.http.get<FeedbackRow[]>(`${this.api}/feedback/pending`).subscribe({
      next: rows => { this.pendingFeedbacks = rows; this.loadingList = false; },
      error: ()  => { this.loadingList = false; }
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  // FORMULAIRE MANUEL
  // ════════════════════════════════════════════════════════════════════════════

  submitFeedback() {
  if (!this.form.label_corrige || !this.form.speaker) {
    this.submitMsg = 'Remplissez au moins le Speaker et le Label correct.';
    this.submitOk  = false;
    return;
  }
  this.submitting = true;
  this.submitMsg  = '';

  const url  = this.editingId !== null
    ? `${this.api}/feedback/${this.editingId}`
    : `${this.api}/feedback`;

  const req$ = this.editingId !== null
    ? this.http.put<any>(url, this.form)
    : this.http.post<any>(url, this.form);

  req$.subscribe({
    next: (res: any) => {
      this.submitMsg  = this.editingId !== null
        ? '✓ Correction mise à jour.'
        : `✓ Feedback enregistré. ${res.pending_feedbacks ?? ''} en attente.`;
      this.submitOk   = true;
      this.submitting = false;
      this.editingId  = null;
      this.prefilled  = false;
      this.resetForm();
      this.loadStats();
      this.loadPending();
    },
    error: () => {
      this.submitMsg  = "Erreur lors de l'envoi.";
      this.submitOk   = false;
      this.submitting = false;
    }
  });
}

  startEdit(f: FeedbackRow) {
    this.editingId = f.id ?? null;
    this.form = { ...f };
    this.submitMsg = '';
    setTimeout(() => document.getElementById('feedback-form')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }

  cancelEdit() {
    this.editingId = null;
    this.prefilled = false;
    this.resetForm();
    this.submitMsg = '';
  }

  askDelete(id: number)    { this.deleteConfirmId = id; }
  cancelDelete()           { this.deleteConfirmId = null; }

  confirmDelete(id: number) {
    this.http.delete(`${this.api}/feedback/${id}`).subscribe({
      next: () => { this.deleteConfirmId = null; this.loadStats(); this.loadPending(); },
      error: () => { this.deleteConfirmId = null; }
    });
  }

  resetForm() {
    this.form = { speaker: '', type_test: '', freq_min: 0, freq_max: 0,
                  excess: 0, label_original: 'INCONNU', label_corrige: '', expert: 'expert' };
  }

  // ════════════════════════════════════════════════════════════════════════════
  // IMPORT JSON AUTOMATIQUE  (dry-run → confirmation → insertion)
  // ════════════════════════════════════════════════════════════════════════════

  /** Étape 1 : dry-run pour voir combien de divergences il y a */
  previewJsonImport() {
    this.importingJson     = true;
    this.importMsg         = '';
    this.importPreview     = null;
    this.showImportConfirm = false;

    this.http.post<any>(`${this.api}/feedback/import-json`, { auto_insert: false }).subscribe({
      next: res => {
        this.importPreview     = res;
        this.showImportConfirm = true;
        this.importingJson     = false;
      },
      error: err => {
        this.importMsg     = 'Erreur : ' + (err.error?.detail || 'inconnue');
        this.importOk      = false;
        this.importingJson = false;
      }
    });
  }

  /** Étape 2 : confirmer et vraiment insérer */
  confirmJsonImport() {
    this.importingJson     = true;
    this.showImportConfirm = false;

    this.http.post<any>(`${this.api}/feedback/import-json`, { auto_insert: true }).subscribe({
      next: res => {
        this.importMsg     = res.message;
        this.importOk      = res.success;
        this.importingJson = false;
        this.importPreview = null;
        this.loadStats();
        this.loadPending();
      },
      error: err => {
        this.importMsg     = 'Erreur : ' + (err.error?.detail || 'inconnue');
        this.importOk      = false;
        this.importingJson = false;
      }
    });
  }

  cancelJsonImport() {
    this.showImportConfirm = false;
    this.importPreview     = null;
    this.importMsg         = '';
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RÉENTRAÎNEMENT  +  MATRICE DE CONFUSION
  // ════════════════════════════════════════════════════════════════════════════

  triggerRetrain() {
    this.retraining        = true;
    this.retrainMsg        = '';
    this.confusionMatrixUrl = null;
    this.retrainResult     = null;
    this.showReport        = false;

    this.http.post<any>(`${this.api}/retrain`, {}).subscribe({
      next: res => {
        this.retrainMsg    = res.message;
        this.retrainOk     = res.success;
        this.retrainResult = res;
        this.retraining    = false;
        this.loadStats();

        // Charger l'image avec cache-buster
        if (res.success) {
          this.confusionMatrixUrl = `${this.api}/retrain/confusion-matrix?t=${Date.now()}`;
        }
      },
      error: err => {
        this.retrainMsg = 'Erreur : ' + (err.error?.detail || 'inconnue');
        this.retrainOk  = false;
        this.retraining = false;
      }
    });
  }

  // ── Helpers rapport ────────────────────────────────────────────────────────
  get reportRows(): { label: string; precision: number; recall: number; f1: number; support: number }[] {
    if (!this.retrainResult?.classification_report) return [];
    const rep = this.retrainResult.classification_report;
    return Object.entries(rep)
      .filter(([k]) => !['accuracy','macro avg','weighted avg'].includes(k))
      .map(([label, v]: [string, any]) => ({
        label,
        precision: v.precision ?? 0,
        recall:    v.recall    ?? 0,
        f1:        v['f1-score'] ?? 0,
        support:   v.support   ?? 0,
      }))
      .sort((a, b) => b.support - a.support);
  }

  f1Color(f1: number): string {
    if (f1 >= 0.80) return '#34d399';
    if (f1 >= 0.60) return '#fbbf24';
    return '#f87171';
  }

  // ── Helpers UI ─────────────────────────────────────────────────────────────
  get formTitle(): string {
    if (this.editingId !== null) return 'Modifier la correction';
    if (this.prefilled)          return 'Correction pré-remplie depuis Prédire';
    return 'Nouvelle anomalie / Correction';
  }

  get submitLabel(): string {
    return this.editingId !== null ? 'Mettre à jour' : 'Enregistrer le feedback';
  }
}