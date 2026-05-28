import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">

      <div class="nav-left">
      <div class="logo-block">
  <div class="logo">
    <img 
  src="https://logos-world.net/wp-content/uploads/2023/02/Sagemcom-Logo.png" 
  alt="Logo Sagemcom"
  class="logo-img"
/>
  </div>      <span class="logo-fallback" style="display:none">SAGEMCOM</span>
    </div>
        <div class="nav-divider"></div>
        <div class="nav-product">
          <span class="nav-product-name">Détection & prédiction d'anomalies acoustiques</span>
        </div>
      </div>

      <div class="nav-center">
        <a routerLink="/predict" routerLinkActive="active" class="nav-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Prédire
        </a>
        <a routerLink="/stats" routerLinkActive="active" class="nav-link">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M18 20V10M12 20V4M6 20v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Statistiques
        </a>
      </div>
      <a routerLink="/feedback" routerLinkActive="active" class="nav-link">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path d="M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
          stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
  </svg>
  Enrichissement
</a>

    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 28px;
      height: 125px;
      background: #0d0b26;
      border-bottom: 1px solid rgba(99,102,241,0.18);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .nav-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .nav-brand { text-decoration: none; display: flex; align-items: center; }
.logo-block { display: flex; align-items: center; }

.logo-pill {
  background: #ffffff;
  border-radius: 8px;
  padding: 5px 12px;
  height: 38px;
  display: flex;
  align-items: center;
}

.logo-img {
  height: 90px;
  width: auto;
  object-fit: contain;
  display: block;
}

.logo-fallback {
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 2px;
  color: #a5b4fc;
}
    .nav-divider {
      width: 1px;
      height: 30px;
      background: rgba(99,102,241,0.22);
    }

    .nav-product {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .nav-product-name {
      font-size: 18px;
      font-weight: 700;
      color: #e2e8f0;
      letter-spacing: 0.1px;
    }

    .nav-product-sub {
      font-size: 9px;
      color: rgba(148,163,184,0.5);
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .nav-center {
      display: flex;
      align-items: center;
      gap: 3px;
      background: rgba(99,102,241,0.08);
      border: 1px solid rgba(99,102,241,0.2);
      border-radius: 12px;
      padding: 4px;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 8px 22px;
      border-radius: 9px;
      font-size: 25px;
      font-weight: 500;
      color: rgba(148,163,184,0.7);
      text-decoration: none;
      transition: all 0.2s;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: #c4b5fd;
      background: rgba(99,102,241,0.12);
    }

    .nav-link.active {
    background: linear-gradient(135deg, #1a77ce, #07a1ac);

      color: #ffffff;
      font-weight: 600;
      box-shadow: 0 4px 16px rgba(99,102,241,0.45);
    }

    @media (max-width: 768px) {
      .nav-product { display: none; }
      .nav-link { padding: 7px 14px; font-size: 12px; }
    }
  `]
})
export class NavbarComponent {}