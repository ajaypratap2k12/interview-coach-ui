import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InterviewService, ChatMessage } from '../../services/interview.service';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './interview.component.html',
  styleUrls: ['./interview.component.scss']
})
export class InterviewComponent implements OnInit, OnDestroy {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentAnswer = '';
  isLoading = false;
  sessionStarted = false;
  lastQuestion = '';
  private subscription: Subscription | null = null;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.subscription = this.interviewService.messages$.subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  startSession(): void {
    this.isLoading = true;
    this.interviewService.startSession().subscribe({
      next: (response) => {
        this.sessionStarted = true;
        this.lastQuestion = response.currentQuestion;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to start session:', err);
        this.isLoading = false;
        alert('Failed to start session. Please try again.');
      }
    });
  }

  submitAnswer(): void {
    if (!this.currentAnswer.trim() || this.isLoading) return;

    const answer = this.currentAnswer.trim();
    this.currentAnswer = '';
    this.isLoading = true;

    // Add user's answer to chat
    const messages = [...this.messages, {
      id: crypto.randomUUID(),
      role: 'answer' as const,
      content: answer,
      timestamp: new Date()
    }];
    this.messages = messages;
    this.scrollToBottom();

    this.interviewService.submitAnswer(this.lastQuestion, answer).subscribe({
      next: (response) => {
        this.lastQuestion = response.nextQuestion;
        this.isLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Failed to submit answer:', err);
        this.isLoading = false;
        alert('Failed to submit answer. Please try again.');
      }
    });
  }

  newSession(): void {
    this.interviewService.clearMessages();
    this.sessionStarted = false;
    this.messages = [];
    this.lastQuestion = '';
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      this.submitAnswer();
    }
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.messagesContainer) {
        const element = this.messagesContainer.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }

  getScoreColor(score: number): string {
    if (score >= 8) return '#10b981';
    if (score >= 6) return '#f59e0b';
    return '#ef4444';
  }

  formatScore(score: number): string {
    return `${score}/10`;
  }
}
