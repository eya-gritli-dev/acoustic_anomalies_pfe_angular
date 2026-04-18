// src/app/components/upload/upload.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PredictionService } from '../../services/prediction.service';
import { PredictionResult } from '../../models/prediction.model';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent {
  @Output() resultReady = new EventEmitter<PredictionResult>();

  selectedFiles: File[] = [];
  isLoading = false;
  errorMessage = '';
  isDragOver = false;

  constructor(private predictionService: PredictionService) {}

 onFileSelected(event: Event): void {
  const input = event.target as HTMLInputElement;

  if (input.files) {
    this.selectedFiles = Array.from(input.files).filter(f =>
      f.name.endsWith('.txt')
    );
  }
}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = true;
  }

  onDragLeave(): void {
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragOver = false;
    const files = event.dataTransfer?.files;
    if (files) {
      this.selectedFiles = Array.from(files).filter(f => f.name.endsWith('.txt'));
    }
  }

  runPrediction(): void {
    if (!this.selectedFiles.length) return;

    this.isLoading = true;
    this.errorMessage = '';

    this.predictionService.predict(this.selectedFiles).subscribe({
      next: result => {
        this.isLoading = false;
        this.resultReady.emit(result);
      },
      error: err => {
        this.isLoading = false;
        this.errorMessage =
          err?.error?.detail ?? 'Erreur lors de la prédiction.';
      },
    });
  }

  clearFiles(): void {
    this.selectedFiles = [];
    this.errorMessage = '';
  }


 
   

}
