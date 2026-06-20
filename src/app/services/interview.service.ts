import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, switchMap, map, tap } from 'rxjs';
import {
  ChatMessage,
  StartSessionResponse,
  AnswerRequest,
  AnswerResponse,
  AskQuestionResponse,
  TraceResponse,
} from '../models/chat.model';

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
    return this.http.post<StartSessionResponse>(`${this.apiUrl}/session/start`, {}).pipe(
      tap((response) => {
        this.sessionId = response.sessionId;
        const messages: ChatMessage[] = [
          this.createMessage('system', 'Interview session started. Ask me anything about Java, Spring'),
          this.createMessage('question', response.currentQuestion),
        ];
        this.messagesSubject.next(messages);
      })
    );
  }

  submitAnswer(currentQuestion: string, candidateAnswer: string): Observable<AnswerResponse> {
    if (!this.sessionId) {
      throw new Error('No active session. Start a session first.');
    }

    const request: AnswerRequest = {
      sessionId: this.sessionId,
      currentQuestion,
      candidateAnswer,
    };

    return this.http.post<AnswerResponse>(`${this.apiUrl}/session/answer`, request).pipe(
      tap((response) => {
        const messages = [...this.messagesSubject.value];
        messages.push(this.createMessage('feedback', response.feedback, response.score));

        if (response.nextQuestion) {
          messages.push(this.createMessage('question', response.nextQuestion));
        }

        this.messagesSubject.next(messages);
      })
    );
  }

  askQuestionWithTrace(question: string): Observable<TraceResponse> {
    return this.http.get<TraceResponse>(`${this.apiUrl}/interview/trace`, {
      params: { question },
    }).pipe(
      tap((trace) => {
        const messages = [...this.askMessagesSubject.value];
        messages.push(this.createMessage('answer', question));
        messages.push(this.createMessage('question', trace.aggregatorOutput, undefined, trace));
        this.askMessagesSubject.next(messages);
      })
    );
  }

  clearMessages(): void {
    this.messagesSubject.next([]);
    this.sessionId = null;
  }

  clearAskMessages(): void {
    this.askMessagesSubject.next([]);
  }

  private createMessage(
    role: ChatMessage['role'],
    content: string,
    score?: number,
    trace?: TraceResponse
  ): ChatMessage {
    return {
      id: crypto.randomUUID(),
      role,
      content,
      score,
      trace,
      timestamp: new Date(),
    };
  }
}
