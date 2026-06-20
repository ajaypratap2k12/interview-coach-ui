import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage, RoleConfig } from '../../models/chat.model';
import { MarkdownPipe } from '../../pipes/markdown.pipe';
import { TracePanelComponent } from '../trace-panel/trace-panel.component';

@Component({
  selector: 'app-chat-message',
  standalone: true,
  imports: [CommonModule, MarkdownPipe, TracePanelComponent],
  template: `
    <div class="chat-msg" [class]="'chat-msg--' + roleConfig.align" [class.chat-msg--system]="roleConfig.variant === 'system'">
      <!-- Avatar (left-aligned messages) -->
      <div class="chat-msg__avatar" *ngIf="roleConfig.align !== 'right'">
        <span>{{ roleConfig.icon }}</span>
      </div>

      <div class="chat-msg__body">
        <!-- Header -->
        <div class="chat-msg__header" [class.chat-msg__header--rtl]="roleConfig.align === 'right'">
          <span class="chat-msg__role">{{ roleConfig.label }}</span>
          <span class="chat-msg__time">{{ message.timestamp | date:'shortTime' }}</span>
        </div>

        <!-- Content -->
        <div class="chat-msg__bubble" [class]="'chat-msg__bubble--' + roleConfig.variant">
          <div class="chat-msg__text markdown-body" [innerHTML]="message.content | markdown"></div>
        </div>

        <!-- Score badge -->
        <div class="chat-msg__score" *ngIf="message.score !== undefined && message.score !== null">
          <div class="score-pill" [style.--score-color]="getScoreColor(message.score)">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            <span>{{ message.score }}/10</span>
          </div>
        </div>

        <!-- Trace panel -->
        <app-trace-panel
          *ngIf="message.trace"
          [trace]="message.trace"
          [isOpen]="!!message.__traceOpen"
          (toggle)="onToggleTrace()">
        </app-trace-panel>
      </div>

      <!-- Avatar (right-aligned messages) -->
      <div class="chat-msg__avatar" *ngIf="roleConfig.align === 'right'">
        <span>{{ roleConfig.icon }}</span>
      </div>
    </div>
  `,
  styles: [`
    .chat-msg {
      display: flex;
      gap: 0.75rem;
      max-width: 80%;
      animation: msgIn 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .chat-msg--left { align-self: flex-start; }
    .chat-msg--right { align-self: flex-end; flex-direction: row-reverse; }
    .chat-msg--center {
      align-self: center;
      max-width: 85%;
    }

    .chat-msg__avatar {
      width: 34px;
      height: 34px;
      border-radius: 10px;
      background: var(--bg-input);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
      flex-shrink: 0;
      border: 1px solid var(--border);
    }

    .chat-msg--system .chat-msg__avatar {
      background: linear-gradient(135deg, var(--primary), var(--primary-dark));
      border-color: transparent;
    }

    .chat-msg__body {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      min-width: 0;
    }

    .chat-msg__header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0 0.25rem;

      &--rtl {
        flex-direction: row-reverse;
      }
    }

    .chat-msg__role {
      font-size: 0.7rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .chat-msg__time {
      font-size: 0.65rem;
      color: var(--text-muted);
      opacity: 0.7;
    }

    .chat-msg__bubble {
      padding: 0.875rem 1rem;
      border-radius: 14px;
      border-top-left-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    .chat-msg--right .chat-msg__bubble {
      border-top-left-radius: 14px;
      border-top-right-radius: 4px;
    }

    .chat-msg--center .chat-msg__bubble {
      border-radius: 14px;
      text-align: center;
    }

    .chat-msg__bubble--default {
      background: var(--bg-card);
      border: 1px solid var(--border);
    }

    .chat-msg__bubble--primary {
      background: var(--primary);
      color: white;
    }

    .chat-msg__bubble--accent {
      background: var(--bg-card);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-left: 3px solid var(--secondary);
    }

    .chat-msg__bubble--system {
      background: linear-gradient(135deg, var(--primary-dark), var(--primary));
      color: white;
    }

    .chat-msg__text {
      color: var(--text-primary);
      line-height: 1.65;
      font-size: 0.9rem;

      .chat-msg__bubble--primary & {
        color: white;
      }

      .chat-msg__bubble--system & {
        color: white;
      }
    }

    .chat-msg--right .chat-msg__text {
      text-align: right;
    }

    .chat-msg__score {
      padding: 0 0.25rem;
    }

    .score-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.3rem 0.75rem;
      background: color-mix(in srgb, var(--score-color) 15%, transparent);
      color: var(--score-color);
      border: 1px solid color-mix(in srgb, var(--score-color) 30%, transparent);
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
    }

    @keyframes msgIn {
      from { opacity: 0; transform: translateY(8px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 640px) {
      .chat-msg { max-width: 92%; }
    }
  `]
})
export class ChatMessageComponent {
  @Input({ required: true }) message!: ChatMessage;
  @Input({ required: true }) roleConfig!: RoleConfig;

  onToggleTrace(): void {
    this.message.__traceOpen = !this.message.__traceOpen;
  }

  getScoreColor(score: number): string {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  }
}
