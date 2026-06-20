import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { InterviewService } from '../../services/interview.service';
import { ChatMessage, INTERVIEW_ROLES, ASK_ROLES, RoleConfig } from '../../models/chat.model';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ChatMessageComponent } from '../chat-message/chat-message.component';

@Component({
  selector: 'app-interview',
  standalone: true,
  imports: [CommonModule, FormsModule, WelcomeComponent, ChatMessageComponent],
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

  askMode = false;
  askMessages: ChatMessage[] = [];
  askQuestionInput = '';
  askLoading = false;
  private askSubscription: Subscription | null = null;

  readonly interviewRoles = INTERVIEW_ROLES;
  readonly askRoles = ASK_ROLES;

  constructor(private interviewService: InterviewService) {}

  ngOnInit(): void {
    this.subscription = this.interviewService.messages$.subscribe((messages) => {
      this.messages = messages;
      this.scrollToBottom();
    });
    this.askSubscription = this.interviewService.askMessages$.subscribe((messages) => {
      this.askMessages = messages;
      this.scrollToBottom();
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
    this.askSubscription?.unsubscribe();
  }

  getRoleConfig(role: string, mode: 'interview' | 'ask'): RoleConfig {
    const roles = mode === 'interview' ? INTERVIEW_ROLES : ASK_ROLES;
    return roles[role] || { label: role, icon: '❓', align: 'left', variant: 'default' };
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
      },
    });
  }

  submitAnswer(): void {
    if (!this.currentAnswer.trim() || this.isLoading) return;

    const answer = this.currentAnswer.trim();
    this.currentAnswer = '';
    this.isLoading = true;

    const optimistic: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'answer',
      content: answer,
      timestamp: new Date(),
    };
    this.messages = [...this.messages, optimistic];
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
      },
    });
  }

  newSession(): void {
    this.interviewService.clearMessages();
    this.sessionStarted = false;
    this.messages = [];
    this.lastQuestion = '';
    this.askMode = false;
  }

  handleEnter(event: Event, mode: 'interview' | 'ask'): void {
    const keyboardEvent = event as KeyboardEvent;
    if (!keyboardEvent.shiftKey) {
      keyboardEvent.preventDefault();
      if (mode === 'ask') {
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
        timestamp: new Date(),
      },
    ];
  }

  submitAskQuestion(): void {
    if (!this.askQuestionInput.trim() || this.askLoading) return;

    const question = this.askQuestionInput.trim();
    this.askQuestionInput = '';
    this.askLoading = true;
    this.scrollToBottom();

    this.interviewService.askQuestionWithTrace(question).subscribe({
      next: () => {
        this.askLoading = false;
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Failed to ask question:', err);
        this.askLoading = false;
      },
    });
  }

  newAskSession(): void {
    this.interviewService.clearAskMessages();
    this.askMessages = [];
    this.askMode = false;
  }

  trackById(_index: number, msg: ChatMessage): string {
    return msg.id;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const container = this.askMode ? this.askMessagesContainer : this.messagesContainer;
      if (container) {
        const el = container.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    }, 100);
  }
}
