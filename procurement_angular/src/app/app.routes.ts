import { Routes } from '@angular/router';
import { VendorListComponent } from './vendor-list/vendor-list.component';
import { EvaluationResultComponent } from './evaluation-result/evaluation-result.component';

export const routes: Routes = [
  { path: '', component: VendorListComponent },
  { path: 'evaluation-result', component: EvaluationResultComponent },
  { path: '**', redirectTo: '' },
];
