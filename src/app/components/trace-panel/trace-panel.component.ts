import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TraceResponse } from '../../models/chat.model';

@Component({
  selector: 'app-trace-panel',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="trace">
      <button class="trace__toggle" (click)="toggle.emit()">
        <svg class="trace__chevron" [class.trace__chevron--open]="isOpen" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="m9 18 6-6-6-6"/>
        </svg>
        <span class="trace__label">Execution Trace</span>
        <span class="trace__meta">
          <span class="trace__duration">{{ formatDuration(trace.totalDurationMs) }}</span>
          <span class="trace__score" [style.color]="getScoreColor(trace.evaluatorScore)">
            {{ trace.evaluatorScore }}/10
          </span>
        </span>
      </button>

      <div class="trace__details" *ngIf="isOpen">
        <!-- Execution Plan -->
        <div class="trace__section">
          <span class="trace__section-label">Execution Plan</span>
          <div class="trace__plan">
            <ng-container *ngFor="let agent of trace.executionPlan; let last = last; let i = index">
              <span class="trace__agent">{{ formatAgentName(agent) }}</span>
              <svg *ngIf="!last" class="trace__arrow" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
              </svg>
            </ng-container>
          </div>
        </div>

        <!-- Node Timings -->
        <div class="trace__section">
          <span class="trace__section-label">Agent Timing</span>
          <div class="trace__nodes">
            <div class="trace__node" *ngFor="let node of trace.nodeTraces">
              <span class="trace__node-icon">{{ getNodeIcon(node.nodeName) }}</span>
              <span class="trace__node-name">{{ getNodeDisplayName(node.nodeName) }}</span>
              <div class="trace__bar">
                <div class="trace__bar-fill" [style.width.%]="(node.durationMs / trace.totalDurationMs) * 100"></div>
              </div>
              <span class="trace__node-time">{{ formatDuration(node.durationMs) }}</span>
            </div>
          </div>
        </div>

        <!-- Evaluator Feedback -->
        <div class="trace__section" *ngIf="trace.evaluatorFeedback">
          <span class="trace__section-label">Evaluator Feedback</span>
          <p class="trace__feedback">{{ trace.evaluatorFeedback }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .trace {
      margin-top: 0.625rem;
    }

    .trace__toggle {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      background: rgba(15, 23, 42, 0.4);
      border: 1px solid var(--border);
      border-radius: 8px;
      padding: 0.5rem 0.75rem;
      color: var(--text-muted);
      font-family: inherit;
      font-size: 0.72rem;
      cursor: pointer;
      transition: all 0.2s;

      &:hover {
        background: rgba(15, 23, 42, 0.6);
        color: var(--text-secondary);
        border-color: var(--text-muted);
      }
    }

    .trace__chevron {
      transition: transform 0.2s;
      flex-shrink: 0;

      &--open {
        transform: rotate(90deg);
      }
    }

    .trace__label {
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }

    .trace__meta {
      margin-left: auto;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .trace__duration {
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
    }

    .trace__score {
      font-weight: 700;
      font-variant-numeric: tabular-nums;
    }

    .trace__details {
      margin-top: 0.5rem;
      padding: 0.875rem;
      background: rgba(15, 23, 42, 0.5);
      border: 1px solid var(--border);
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      animation: traceIn 0.25s ease;
    }

    .trace__section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .trace__section-label {
      font-size: 0.65rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: var(--text-muted);
    }

    .trace__plan {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: 0.35rem;
    }

    .trace__agent {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.6rem;
      background: var(--primary);
      color: white;
      border-radius: 6px;
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.02em;
    }

    .trace__arrow {
      color: var(--text-muted);
      flex-shrink: 0;
    }

    .trace__nodes {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    .trace__node {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.72rem;
    }

    .trace__node-icon {
      width: 1.25rem;
      text-align: center;
      flex-shrink: 0;
    }

    .trace__node-name {
      width: 110px;
      color: var(--text-secondary);
      flex-shrink: 0;
      font-weight: 500;
    }

    .trace__bar {
      flex: 1;
      height: 5px;
      background: var(--bg-input);
      border-radius: 3px;
      overflow: hidden;
    }

    .trace__bar-fill {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, var(--primary), var(--secondary));
      border-radius: 3px;
      min-width: 2px;
      transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .trace__node-time {
      width: 48px;
      text-align: right;
      color: var(--text-muted);
      font-variant-numeric: tabular-nums;
      flex-shrink: 0;
      font-weight: 500;
    }

    .trace__feedback {
      font-size: 0.78rem;
      color: var(--text-secondary);
      line-height: 1.6;
      white-space: pre-wrap;
      padding: 0.5rem 0.75rem;
      background: rgba(16, 185, 129, 0.06);
      border: 1px solid rgba(16, 185, 129, 0.15);
      border-radius: 8px;
    }

    @keyframes traceIn {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class TracePanelComponent {
  @Input({ required: true }) trace!: TraceResponse;
  @Input() isOpen = false;
  @Output() toggle = new EventEmitter<void>();

  private nodeNames: Record<string, string> = {
    planner: 'Planner',
    supervisor: 'Supervisor',
    java_agent: 'Java Expert',
    spring_agent: 'Spring Expert',
    aws_agent: 'AWS Expert',
    microservice_agent: 'Microservices',
    kafka_agent: 'Kafka Expert',
    aggregator: 'Aggregator',
    evaluator: 'Evaluator',
  };

  private nodeIcons: Record<string, string> = {
    planner: '📋',
    supervisor: '👁',
    java_agent: '☕',
    spring_agent: '🌱',
    aws_agent: '☁️',
    microservice_agent: '🔗',
    kafka_agent: '📨',
    aggregator: '🔀',
    evaluator: '📊',
  };

  formatDuration(ms: number): string {
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }

  getNodeDisplayName(name: string): string {
    return this.nodeNames[name] || name;
  }

  getNodeIcon(name: string): string {
    return this.nodeIcons[name] || '⚙️';
  }

  formatAgentName(name: string): string {
    return this.nodeNames[name] || name;
  }

  getScoreColor(score: number): string {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  }
}
