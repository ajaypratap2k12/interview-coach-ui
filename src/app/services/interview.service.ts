import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface StartSessionResponse {
  sessionId: string;
  currentQuestion: string;
}

export interface AnswerRequest {
  sessionId: string;
  currentQuestion: string;
  candidateAnswer: string;
}

export interface AnswerResponse {
  feedback: string;
  score: number;
  nextQuestion: string;
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'question' | 'answer' | 'feedback';
  content: string;
  score?: number;
  timestamp: Date;
}

export interface AskQuestionResponse {
  question: string;
  answer: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterviewService {
  private apiUrl = 'http://localhost:8080';
  private sessionId: string | null = null;
  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  private askMessagesSubject = new BehaviorSubject<ChatMessage[]>([]);

  messages$ = this.messagesSubject.asObservable();
  askMessages$ = this.askMessagesSubject.asObservable();

  constructor(private http: HttpClient) {}

  startSession(): Observable<StartSessionResponse> {
    return new Observable(observer => {
      this.http.post<StartSessionResponse>(`${this.apiUrl}/session/start`, {}).subscribe({
        next: (response) => {
          this.sessionId = response.sessionId;
          const messages = [
            this.createMessage('system', 'Interview session started. Ask me anything about Java, Spring'),
            this.createMessage('question', response.currentQuestion)
          ];
          this.messagesSubject.next(messages);
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  submitAnswer(currentQuestion: string, candidateAnswer: string): Observable<AnswerResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Start a session first.');
    }

    const request: AnswerRequest = {
      sessionId: this.sessionId,
      currentQuestion,
      candidateAnswer
    };

    return new Observable(observer => {
      this.http.post<AnswerResponse>(`${this.apiUrl}/session/answer`, request).subscribe({
        next: (response) => {
          const messages = [...this.messagesSubject.value];
          messages.push(this.createMessage('feedback', response.feedback, response.score));
          
          if (response.nextQuestion) {
            messages.push(this.createMessage('question', response.nextQuestion));
          }
          
          this.messagesSubject.next(messages);
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  askQuestion(question: string): Observable<AskQuestionResponse> {
    return new Observable(observer => {
      this.http.get<AskQuestionResponse>(`${this.apiUrl}/interview`, {
        params: { question }
      }).subscribe({
        next: (response) => {
          const messages = [...this.askMessagesSubject.value];
          messages.push(this.createMessage('answer', question));
          messages.push(this.createMessage('question', response.answer));
          this.askMessagesSubject.next(messages);
          observer.next(response);
          observer.complete();
        },
        error: (err) => observer.error(err)
      });
    });
  }

  clearAskMessages(): void {
    this.askMessagesSubject.next([]);
  }

  private createMessage(role: ChatMessage['role'], content: string, score?: number): ChatMessage {
    return {
      id: crypto.randomUUID(),
      role,
      content,
      score,
      timestamp: new Date()
    };
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.sessionId = null;
  }
}
