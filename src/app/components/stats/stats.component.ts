import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [CommonModule],
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

  private api = 'http://localhost:8000';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    forkJoin({
      global: this.http.get(`${this.api}/stats/db`),
      machines: this.http.get(`${this.api}/stats/machines`),
      dates: this.http.get(`${this.api}/stats/by-date`),
      anomalies: this.http.get(`${this.api}/stats/anomalies`),
      multi: this.http.get(`${this.api}/stats/produits-multi-machines`),
    }).subscribe({
      next: (data: any) => {
        this.globalStats = data.global;
        this.machineStats = data.machines;
        this.dateStats = data.dates.slice(0, 14).reverse();
        this.anomalyStats = data.anomalies.slice(0, 10);
        this.multiMachineProducts = data.multi;
        this.loading = false;
      },
      error: () => { this.error = true; this.loading = false; }
    });
  }

  get topAnomalyTypes(): {type: string, count: number}[] {
    const map = new Map<string, number>();
    for (const a of this.anomalyStats) {
      map.set(a.type, (map.get(a.type) || 0) + a.count);
    }
    return Array.from(map.entries())
      .map(([type, count]) => ({ type, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }

  barWidth(value: number, max: number): string {
    return Math.round((value / max) * 100) + '%';
  }

  maxTests(): number {
    return Math.max(...this.machineStats.map(m => m.total), 1);
  }

  maxDate(): number {
    return Math.max(...this.dateStats.map(d => d.total), 1);
  }
}