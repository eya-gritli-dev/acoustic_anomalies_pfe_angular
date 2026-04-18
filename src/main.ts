import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// Démarre l'application Angular
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),  // Fournit un client HTTP pour effectuer des requêtes
    provideRouter(routes)  // Fournit le routeur pour la navigation dans l'application
  ]
}).catch(err => console.error(err)); // Gère les erreurs lors du démarrage
