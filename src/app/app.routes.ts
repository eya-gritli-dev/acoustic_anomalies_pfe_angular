import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { StatsComponent } from './components/stats/stats.component';
import { FeedbackComponent } from './feedback/feedback.component';

export const routes: Routes = [
  { path: '', redirectTo: 'predict', pathMatch: 'full' },
  { path: 'predict', component: HomeComponent },
  { path: 'stats', component: StatsComponent },
  { path: 'feedback', component: FeedbackComponent },
];