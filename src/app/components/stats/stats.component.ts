import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class StatsComponent implements OnInit {
  loading = true;
  error = false;

  globalStats: any = null;
  machineStats: any[] = [];
  dateStats: any[] = [];
  anomalyStats: any[] = [];
  multiMachineProducts: any[] = [];
  monthlyAnomalies: any[] = [];

  // Search
  searchQuery = '';
  searchType: 'serie' | 'machine' = 'serie';
  searchResults: any[] = [];
  searchLoading = false;
  searchError = false;
  hasSearched = false;

  private searchSubject = new Subject<string>();
  private api = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    forkJoin({
      global: this.http.get(`${this.api}/stats/db`),
      machines: this.http.get(`${this.api}/stats/machines`),
      dates: this.http.get(`${this.api}/stats/by-date`),
      anomalies: this.http.get(`${this.api}/stats/anomalies`),
      multi: this.http.get(`${this.api}/stats/produits-multi-machines`),
      monthly: this.http.get(`${this.api}/stats/anomalies-by-month`),
    }).subscribe({
      next: (data: any) => {
        this.globalStats = data.global;
        this.machineStats = data.machines;
        this.dateStats = data.dates.slice(0, 14).reverse();
        this.anomalyStats = data.anomalies.slice(0, 10);
        this.multiMachineProducts = data.multi;
        this.monthlyAnomalies = data.monthly;
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.searchResults = [];
      this.hasSearched = false;
      return;
    }
    this.searchLoading = true;
    this.searchError = false;
    this.hasSearched = true;

    const url = this.searchType === 'serie'
      ? `${this.api}/search/produit?ns=${encodeURIComponent(this.searchQuery.trim())}`
      : `${this.api}/search/machine?machine_id=${encodeURIComponent(this.searchQuery.trim())}`;

    this.http.get<any[]>(url).subscribe({
      next: (res) => { this.searchResults = res; this.searchLoading = false; },
      error: () => { this.searchError = true; this.searchLoading = false; }
    });
  }

  clearSearch() {
    this.searchQuery = '';
    this.searchResults = [];
    this.hasSearched = false;
    this.searchError = false;
  }

  get topAnomalyTypes(): { type: string; count: number }[] {
    const map = new Map<string, number>();
    for (const a of this.anomalyStats) {
      map.set(a.type, (map.get(a.type) || 0) + a.count);
    }
    return Array.from(map.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  get maxMonthlyCount(): number {
    return Math.max(...this.monthlyAnomalies.map(m => m.count), 1);
  }

  barWidth(value: number, max: number): string {
    return Math.round((value / max) * 100) + '%';
  }

  maxDate(): number {
    return Math.max(...this.dateStats.map(d => d.total), 1);
  }

  statusClass(statut: string): string {
    if (statut === 'passed') return 'badge-passed';
    if (statut === 'failed') return 'badge-failed';
    return 'badge-risk';
  }
}