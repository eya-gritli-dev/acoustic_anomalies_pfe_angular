import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-logo">
        <img src="https://logos-world.net/wp-content/uploads/2023/02/Sagemcom-Logo.png" 
             alt="Sagemcom" class="nav-logo-img"/>
        <div class="nav-divider"></div>
        <span class="nav-title">Acoustic QC</span>
      </div>
      <div class="nav-links">
        <a routerLink="/predict" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">⚡</span> Prédire
        </a>
        <a routerLink="/stats" routerLinkActive="active" class="nav-link">
          <span class="nav-icon">📊</span> Statistiques
        </a>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex; align-items: center; justify-content: space-between;
      padding: 0 28px; height: 58px; background: #fff;
      border-bottom: 1px solid #e8ecf4;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
      position: sticky; top: 0; z-index: 100;
    }
    .nav-logo { display: flex; align-items: center; gap: 14px; }
    .nav-logo-img { height: 40px; width: auto; object-fit: contain; }
    .nav-divider { width: 1px; height: 26px; background: #dde3f0; }
    .nav-title { font-size: 13px; font-weight: 600; color: #1e293b; }
    .nav-links { display: flex; gap: 4px; }
    .nav-link {
      display: flex; align-items: center; gap: 6px;
      padding: 7px 16px; border-radius: 8px;
      font-size: 13px; font-weight: 500; color: #64748b;
      text-decoration: none; transition: all 0.18s;
    }
    .nav-link:hover { background: #f1f5f9; color: #1e293b; }
    .nav-link.active { background: #eff6ff; color: #1a56db; font-weight: 600; }
    .nav-icon { font-size: 14px; }
  `]
})
export class NavbarComponent {}