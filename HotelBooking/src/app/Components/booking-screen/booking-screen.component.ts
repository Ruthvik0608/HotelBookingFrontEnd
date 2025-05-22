import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';

export interface BookingResponse {
  bookingID: number;
  userID: number;
  roomID: number;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  paymentID: number;
}

@Component({
  selector: 'app-booking-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './booking-screen.component.html',
  styleUrls: ['./booking-screen.component.css']
})
export class BookingScreenComponent implements OnInit {
  bookingDetails: any = null;
  loading = true;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchBookingDetails();
  }

  private fetchBookingDetails(): void {
    const bookingId = localStorage.getItem('bookingId');

    if (!bookingId) {
      this.error = 'No booking ID found';
      this.loading = false;
      return;
    }

    this.http.get<BookingResponse>(`https://localhost:7140/api/Booking/${bookingId}`)
      .subscribe({
        next: (response) => {
          console.log('Raw API Response:', response);

          if (!response) {
            this.error = 'No booking data received';
            this.loading = false;
            return;
          }

          try {
            // Store the API response directly
            this.bookingDetails = response;
            this.loading = false;
            console.log('Processed booking details:', this.bookingDetails);
          } catch (error) {
            console.error('Data processing error:', error);
            this.error = 'Failed to process booking data';
            this.loading = false;
          }
        },
        error: (error) => {
          console.error('API error:', error);
          this.error = 'Failed to fetch booking details';
          this.loading = false;
        }
      });
  }
}
