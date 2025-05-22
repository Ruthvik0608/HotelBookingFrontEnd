import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface BookingData {
  hotelId: number;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
  name: string;
  email: string;
  phoneNumber?: string;
}

interface BookingResponse {
  bookingId: string;
}
@Injectable({
  providedIn: 'root'
})
export class BookingServiceService {
  private apiUrl = 'https://localhost:7140/api/Booking'; // Replace with actual backend API

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('authToken');
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  bookRoom(bookingData: BookingData): Observable<BookingResponse> {
    debugger;
    return this.http.post<BookingResponse>(this.apiUrl, bookingData, { headers: this.getHeaders() });
  }

  getUserBookings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user`, { headers: this.getHeaders() });
  }

  getBookingDetails(bookingId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${bookingId}`, { headers: this.getHeaders() });
  }

  cancelBooking(bookingId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${bookingId}`, { headers: this.getHeaders() });
  }
}