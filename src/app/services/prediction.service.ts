// src/app/services/prediction.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PredictionResult, DashboardStats } from '../models/prediction.model';

@Injectable({ providedIn: 'root' })
export class PredictionService {
  private readonly API = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  /** GET /health — vérifie que l'API et les modèles sont prêts */
  checkHealth(): Observable<{ status: string; models_loaded: boolean }> {
    return this.http
      .get<{ status: string; models_loaded: boolean }>(`${this.API}/health`)
      .pipe(catchError(this._handleError));
  }

  /**
   * POST /predict — envoie les fichiers .txt et retourne le résultat complet.
   *
   * Le back FastAPI attend :
   *   - un multipart/form-data
   *   - champ : "files" (répété autant de fois qu'il y a de fichiers)
   *   - uniquement des .txt (les autres sont ignorés côté back)
   *
   * Le filename envoyé est webkitRelativePath si disponible (upload de dossier),
   * sinon simplement f.name.
   */
  predict(files: File[]): Observable<PredictionResult> {
    const formData = new FormData();

    files.forEach(f => {
      // webkitRelativePath conserve la structure "dossier/fichier.txt"
      const filename = (f as any).webkitRelativePath || f.name;
      formData.append('files', f, filename);
    });

    return this.http
      .post<PredictionResult>(`${this.API}/predict`, formData)
      .pipe(catchError(this._handleError));
  }

  /** GET /stats — stats du dernier run sans re-uploader */
  getStats(): Observable<DashboardStats> {
    return this.http
      .get<DashboardStats>(`${this.API}/stats`)
      .pipe(catchError(this._handleError));
  }

  private _handleError(err: HttpErrorResponse): Observable<never> {
    const message =
      err.error?.detail ?? err.message ?? 'Erreur réseau inconnue';
    return throwError(() => new Error(message));
  }
}