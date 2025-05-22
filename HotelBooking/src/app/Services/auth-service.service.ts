import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  role: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private readonly apiUrl = 'https://localhost:7140/api/Auth';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  incomingData = signal<any[]>([]);
  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    if (token) {
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const loginData: LoginRequest = { email, password };

    console.log('Sending login request:', loginData);

    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, loginData, { headers })
      .pipe(
        tap(response => {
          console.log('Login response:', response);
          if (response.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userRole', response.role);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  signup(userData: any): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData)
      .pipe(
        tap(response => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.isAuthenticatedSubject.next(true);
          }
        }),
        catchError(this.handleError)
      );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    this.isAuthenticatedSubject.next(false);
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Auth service error:', error);
    let errorMessage = 'An error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status === 401) {
        errorMessage = 'Invalid email or password';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }

    return throwError(() => new Error(errorMessage));
  }
  fetchData() {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('https://jsonplaceholder.typicode.com/users', { headers }).subscribe(
      (result) => this.incomingData.set(result)
    );
  }
  getHotels(): Observable<any[]> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/Hotel`, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  // incomingData$ = this.incomingData.asObservable();
  // getBookings(): Observable<any[]> {
  //   this.http.get<any[]>(`{this.apiUrl}/Booking`).subscribe({
  //     next: (data) => {
  //       console.log('Fetched Data:', data);
  //       this.incomingData = data; // Store the response
  //     },
  //     error: (error) => {
  //       console.error('Error fetching data:', error);
  //     }
  //   });
  // }
}
