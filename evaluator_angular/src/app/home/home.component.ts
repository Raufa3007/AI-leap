import { Component } from '@angular/core';
import { ServiceService } from '../Services/service.service';
import { finalize, forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgxSpinnerModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  rfpFiles: File[] = [];
  proposalFiles: File[] = [];
  evaluationResults: any[] = [];

  savedRfpName: string | null = null;
  savedProposalNames: string[] = [];
  usingDefaultFiles = false;

  dynamicHeaders: string[] = [];

  constructor(
    private ncgrService: ServiceService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // Always load default files from backend on init
    this.ncgrService.getDefaultFiles().subscribe({
      next: (res) => {
        if (res.rfp || res.proposals?.length) {
          this.usingDefaultFiles = true;
          this.savedRfpName = res.rfp || null;
          this.savedProposalNames = res.proposals || [];
        }
      }
    });
  }

  // Combined table headers
  get tableHeaders(): string[] {
    return this.dynamicHeaders;
  }

  private norm(name: string) {
    return name.normalize('NFC').trim();
  }

  onFileSelect(event: any, type: 'rfp' | 'proposals') {
    const input = event.target as HTMLInputElement;
    const files: FileList | null = input.files;
    if (!files || !files.length) return;

    for (const file of Array.from(files)) {
      if (!this.isValidFileType(file)) {
        alert(`Invalid format: ${file.name}. Please upload only TEXT files (.txt)`);
        continue;
      }

      if (type === 'rfp') {
        this.rfpFiles = [file]; // only 1 RFP
        this.savedRfpName = file.name;
      } else {
        const nameN = this.norm(file.name);
        const idx = this.proposalFiles.findIndex(f => this.norm(f.name) === nameN);
        if (idx > -1) {
          this.proposalFiles[idx] = file; // replace
        } else {
          this.proposalFiles.push(file);
        }
        if (!this.savedProposalNames.includes(file.name)) {
          this.savedProposalNames.push(file.name);
        }
      }
    }

    this.persistFileNames();

    input.value = '';
  }

  isValidFileType(file: File): boolean {
    return file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt');
  }

  removeFile(file: File | string, type: 'rfp' | 'proposals') {
    if (type === 'rfp') {
      this.rfpFiles = [];
      this.savedRfpName = null;
    } else {
      const fileName = typeof file === 'string' ? file : file.name;
      this.proposalFiles = this.proposalFiles.filter(f => this.norm(f.name) !== this.norm(fileName));
      this.savedProposalNames = this.savedProposalNames.filter(n => this.norm(n) !== this.norm(fileName));
    }

    this.persistFileNames();
  }

  get canEvaluate(): boolean {
    if (this.usingDefaultFiles) {
      return !!this.savedRfpName && this.savedProposalNames.length > 0;
    }
    return this.rfpFiles.length > 0 && this.proposalFiles.length > 0;
  }

  disableFieldsOnEvaluate = false;
  evaluate() {
    this.disableFieldsOnEvaluate = true;

    if (this.usingDefaultFiles) {
      // Files already exist on server — skip upload, go straight to evaluate
      this.ncgrService.evaluateDocs(new FormData()).pipe(
        finalize(() => this.spinner.hide())
      ).subscribe({
        next: (evalRes) => this.handleEvalResult(evalRes),
        error: (err) => {
          console.error('Evaluation Error:', err);
          this.toastr.error('Evaluation failed', 'Error', { positionClass: 'toast-top-right' });
          this.disableFieldsOnEvaluate = false;
        }
      });
      return;
    }

    const formData = new FormData();
    formData.append('rfp', this.rfpFiles[0], this.rfpFiles[0].name);
    this.proposalFiles.forEach(f => formData.append('proposals', f, f.name));

    this.ncgrService.clearDocs().pipe(
      switchMap(() => this.ncgrService.uploadFiles(formData)),
      switchMap(() => this.ncgrService.evaluateDocs(formData)),
      finalize(() => this.spinner.hide())
    ).subscribe({
      next: (evalRes) => this.handleEvalResult(evalRes),
      error: (err) => {
        console.error('Evaluation Error:', err);
        this.toastr.error('Evaluation failed', 'Error', { positionClass: 'toast-top-right' });
        this.disableFieldsOnEvaluate = false;
      }
    });
  }

  private handleEvalResult(evalRes: any) {
    this.toastr.success('Evaluation completed successfully', 'Success', { positionClass: 'toast-top-right' });
    this.disableFieldsOnEvaluate = false;
    this.evaluationResults = evalRes?.evaluation_table || [];

    if (this.evaluationResults.length) {
      this.dynamicHeaders = Object.keys(this.evaluationResults[0]);
    }
  }

  clearDocs() {
    this.disableFieldsOnEvaluate = false;
    this.spinner.show();

    this.ncgrService.clearDocs().pipe(
      finalize(() => this.spinner.hide())
    ).subscribe({
      next: () => {
        this.rfpFiles = [];
        this.proposalFiles = [];
        this.savedRfpName = null;
        this.savedProposalNames = [];
        this.evaluationResults = [];
        this.dynamicHeaders = [];
        this.usingDefaultFiles = false;

        this.toastr.success('Documents are cleared', 'Success', { positionClass: 'toast-top-right' });
      },
      error: (err) => {
        console.error('Clear Error:', err);
        this.toastr.error('Failed to clear documents', 'Error', { positionClass: 'toast-top-right' });
      }
    });
  }

  private persistFileNames() {}

  trackByName = (_: number, f: File) => this.norm(f.name);

}
