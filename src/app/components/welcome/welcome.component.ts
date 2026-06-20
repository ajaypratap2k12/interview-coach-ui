import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-welcome',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="welcome-screen">
      <div class="welcome-header">
        <h2>Welcome to Interview Coach</h2>
        <p>AI-powered practice for Java, Spring Boot, and AWS interviews</p>
      </div>
      <div class="welcome-cards">
        <div class="welcome-card" (click)="startInterview.emit()">
          <div class="welcome-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Interview Session</h3>
          <p class="card-desc">Practice mock interviews with AI-powered feedback and scoring</p>
          <div class="features">
            <span class="feature-badge"><span class="dot java"></span>Java</span>
            <span class="feature-badge"><span class="dot spring"></span>Spring Boot</span>
            <span class="feature-badge"><span class="dot aws"></span>AWS</span>
          </div>
          <div class="card-action">
            <span>Start Interview</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
        </div>

        <div class="welcome-card secondary" (click)="startAsk.emit()">
          <div class="welcome-icon secondary">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>Ask a Question</h3>
          <p class="card-desc">Get instant expert answers about Java, Spring, and AWS</p>
          <div class="features">
            <span class="feature-badge"><span class="dot java"></span>Java</span>
            <span class="feature-badge"><span class="dot spring"></span>Spring Boot</span>
            <span class="feature-badge"><span class="dot aws"></span>AWS</span>
          </div>
          <div class="card-action">
            <span>Ask Question</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-screen {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      gap: 3rem;
    }

    .welcome-header {
      text-align: center;

      h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
        letter-spacing: -0.02em;
      }

      p {
        color: var(--text-secondary);
        font-size: 1.05rem;
      }
    }

    .welcome-cards {
      display: flex;
      gap: 1.5rem;
      max-width: 900px;
      width: 100%;
      flex-wrap: wrap;
      justify-content: center;
    }

    .welcome-card {
      background: var(--bg-card);
      border: 1px solid var(--border);
      border-radius: 16px;
      padding: 2.5rem 2rem;
      text-align: center;
      flex: 1;
      min-width: 300px;
      max-width: 400px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, var(--primary), var(--primary-light));
        opacity: 0;
        transition: opacity 0.3s;
      }

      &:hover {
        border-color: var(--primary);
        transform: translateY(-4px);
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);

        &::before {
          opacity: 1;
        }

        .card-action {
          background: var(--primary);
          color: white;
        }
      }

      &.secondary::before {
        background: linear-gradient(90deg, var(--secondary), #34d399);
      }

      &.secondary:hover {
        border-color: var(--secondary);

        .card-action {
          background: var(--secondary);
          color: white;
        }
      }
    }

    .welcome-icon {
      width: 80px;
      height: 80px;
      background: linear-gradient(135deg, rgba(99, 102, 241, 0.15), rgba(99, 102, 241, 0.05));
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 1.5rem;
      color: var(--primary);
      border: 1px solid rgba(99, 102, 241, 0.2);

      &.secondary {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
        color: var(--secondary);
        border-color: rgba(16, 185, 129, 0.2);
      }
    }

    h3 {
      font-size: 1.35rem;
      font-weight: 700;
      margin-bottom: 0.5rem;
      color: var(--text-primary);
      letter-spacing: -0.01em;
    }

    .card-desc {
      color: var(--text-secondary);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }

    .features {
      display: flex;
      justify-content: center;
      gap: 0.75rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .feature-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      background: var(--bg-input);
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--text-secondary);
      border: 1px solid transparent;
    }

    .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;

      &.java { background: #f89820; }
      &.spring { background: #6db33f; }
      &.aws { background: #ff9900; }
    }

    .card-action {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.7rem 1.5rem;
      background: var(--bg-input);
      border: 1px solid var(--border);
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      color: var(--text-primary);
      transition: all 0.3s;
    }

    @media (max-width: 640px) {
      .welcome-cards {
        flex-direction: column;
        align-items: center;
      }

      .welcome-card {
        max-width: 100%;
        min-width: 0;
        width: 100%;
      }

      .welcome-header h2 {
        font-size: 1.5rem;
      }
    }
  `]
})
export class WelcomeComponent {
  @Output() startInterview = new EventEmitter<void>();
  @Output() startAsk = new EventEmitter<void>();
}
