import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface EvaluationRow {
  [key: string]: string;
}

export interface VendorScore {
  name: string;
  scoreKey: string;
  score: number | null;
  status: 'Pending' | 'Completed';
}

@Injectable({ providedIn: 'root' })
export class EvaluationService {
  private readonly apiUrl = 'http://127.0.0.1:5000/evaluate';

  // Maps vendor display names to their score column keys in the API response
  readonly vendorMap: { name: string; scoreKey: string }[] = [
    { name: 'Accenture',         scoreKey: '1_Accenture Proposal.txt Score' },
    { name: 'Deloitte',          scoreKey: '2_Deloitte Proposal.txt Score' },
    { name: 'Kaar Technologies', scoreKey: '3_KaarTech Proposal.txt Score' },
  ];

  constructor(private http: HttpClient) {}

  getEvaluation(): Observable<EvaluationRow[]> {
    return this.http
      .post<{ evaluation_table: EvaluationRow[] }>(this.apiUrl, {})
      .pipe(map((res) => res.evaluation_table ?? []));
  }

  extractVendorScores(rows: EvaluationRow[]): VendorScore[] {
    const totalRow = rows.find(
      (r) =>
        r['Main Criterion']?.replace(/\*/g, '').trim().toLowerCase() === 'total score'
    );

    return this.vendorMap.map(({ name, scoreKey }) => {
      const raw = totalRow?.[scoreKey];
      const score = raw ? parseInt(raw.replace(/\*/g, '').trim(), 10) : null;
      return {
        name,
        scoreKey,
        score: isNaN(score as number) ? null : score,
        status: score != null && !isNaN(score as number) ? 'Completed' : 'Pending',
      };
    });
  }
}
