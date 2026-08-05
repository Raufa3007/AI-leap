import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EvaluationRow } from '../Services/evaluation.service';

@Component({
  selector: 'app-evaluation-result',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './evaluation-result.component.html',
  styleUrl: './evaluation-result.component.scss',
})
export class EvaluationResultComponent implements OnInit {
  evaluationRows: EvaluationRow[] = [];
  tableHeaders: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    const state = this.router.getCurrentNavigation()?.extras.state as
      | { rows: EvaluationRow[] }
      | undefined;

    // Router state is only available during navigation; read from history.state as fallback
    const rows: EvaluationRow[] =
      state?.rows ?? (history.state as { rows?: EvaluationRow[] })?.rows ?? [];

    if (!rows.length) {
      this.router.navigate(['/']);
      return;
    }

    this.evaluationRows = rows;
    this.tableHeaders = Object.keys(rows[0]);
  }

  isTotalScoreRow(row: EvaluationRow): boolean {
    return row['Main Criterion']?.replace(/\*/g, '').trim().toLowerCase() === 'total score';
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
