import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EvaluationService, VendorScore } from '../Services/evaluation.service';

@Component({
  selector: 'app-vendor-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.scss',
})
export class VendorListComponent implements OnInit {
  vendors: VendorScore[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private evaluationService: EvaluationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Initialise vendor list with Pending state (no scores yet)
    this.vendors = this.evaluationService.vendorMap.map(({ name, scoreKey }) => ({
      name,
      scoreKey,
      score: null,
      status: 'Pending',
    }));
  }

  reviewEvaluation(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.evaluationService.getEvaluation().subscribe({
      next: (rows) => {
        this.isLoading = false;

        if (!rows.length) {
          this.errorMessage = 'Evaluation has not been completed yet.';
          return;
        }

        const scores = this.evaluationService.extractVendorScores(rows);
        const hasAnyScore = scores.some((v) => v.score !== null);

        if (!hasAnyScore) {
          this.errorMessage = 'Evaluation has not been completed yet.';
          return;
        }

        this.vendors = scores;

        // Navigate to evaluation result page, passing rows via router state
        this.router.navigate(['/evaluation-result'], { state: { rows } });
      },
      error: () => {
        this.isLoading = false;
        this.errorMessage = 'Unable to load evaluation results.';
      },
    });
  }
}
