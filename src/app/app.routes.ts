import { Routes } from '@angular/router';
import { InterviewComponent } from './components/interview/interview.component';

export const routes: Routes = [
  { path: '', component: InterviewComponent },
  { path: '**', redirectTo: '' }
];
