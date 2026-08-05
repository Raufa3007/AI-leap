import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  template: `
    <section class="header-section">
      <div class="header-logo">
        <img src="../../assets/logo.png" alt="Logo" />
      </div>
      <div class="header-title">
        <span>Procurement Portal — Technical Evaluation Committee</span>
      </div>
    </section>
  `,
  styles: [`
    .header-section {
      display: flex;
      align-items: center;
      padding: 12px 24px;
      background-color: #fff;
      border-bottom: 2px solid #1b8354;
      gap: 16px;
    }
    .header-logo img {
      height: 40px;
    }
    .header-title span {
      font-size: 16px;
      font-weight: 600;
      color: #08594d;
    }
  `],
})
export class HeaderComponent {}
