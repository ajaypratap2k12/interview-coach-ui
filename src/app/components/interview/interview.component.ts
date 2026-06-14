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
  @ViewChild('askMessagesContainer') private askMessagesContainer!: ElementRef;

  messages: ChatMessage[] = [];
  currentAnswer = '';
  isLoading = false;
  sessionStarted = false;
  lastQuestion = '';
  private subscription: Subscription | null = null;

  // Ask Question mode
  askMode = false;
  askMessages: ChatMessage[] = [];
  askQuestionInput = '';
  askLoading = false;
  private askSubscription: Subscription | null = null;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.subscription = this.interviewService.messages$.subscribe(messages => {
      this.messages = messages;
      this.scrollToBottom();
    });
    this.askSubscription = this.interviewService.askMessages$.subscribe(messages => {
      this.askMessages = messages;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.askSubscription?.unsubscribe();
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
    this.askMode = false;
  }

  handleEnter(event: Event): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      if (this.askMode) {
        this.submitAskQuestion();
      } else {
        this.submitAnswer();
      }
    }
  }

  startAskMode(): void {
    this.askMode = true;
    this.askMessages = [
      {
        id: crypto.randomUUID(),
        role: 'system',
        content: 'Ask any question about Java, Spring, or AWS',
        timestamp: new Date()
      }
    ];
  }

  submitAskQuestion(): void {
    if (!this.askQuestionInput.trim() || this.askLoading) return;

    const question = this.askQuestionInput.trim();
    this.askQuestionInput = '';
    this.askLoading = true;
    this.scrollToBottom();

    this.interviewService.askQuestion(question).subscribe({
      next: () => {
        this.askLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Failed to ask question:', err);
        this.askLoading = false;
        alert('Failed to get answer. Please try again.');
      }
    });
  }

  newAskSession(): void {
    this.interviewService.clearAskMessages();
    this.askMessages = [];
    this.askMode = false;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.askMode ? this.askMessagesContainer : this.messagesContainer;
      if (container) {
        const element = container.nativeElement;
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
