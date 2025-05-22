import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

export interface RecentBooking {
  BookingID: number;
  HotelName: string;
  RoomType: string;
  CheckInDate: string;
  CheckOutDate: string;
  TotalCost: number;
  Status: string;
}

@Component({
  selector: 'app-recentbookings',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './recentbookings.component.html',
  styleUrls: ['./recentbookings.component.css']
})
export class RecentBookingsComponent implements OnInit {
  recentBookings: RecentBooking[] = []; // Changed to array
  loading = true;
  error: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchRecentBookings();
  }

  addReview(bookingId: number): void {
    this.router.navigate(['/review']);
  }

  private fetchRecentBookings(): void {
    const userId = this.getUserIdFromToken();

    if (!userId) {
      this.error = 'User ID not found.';
      this.loading = false;
      return;
    }

    this.http.get<RecentBooking[]>(`https://localhost:7140/api/Booking/recentBookings/${userId}`)
      .subscribe({
        next: (response) => {
          console.log('Recent Bookings API Response:', response);
          this.recentBookings = response;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error fetching recent bookings:', error);
          this.error = 'Failed to fetch recent bookings.';
          this.loading = false;
        }
      });
  }

  private getUserIdFromToken(): string | null {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decodedToken = jwtDecode<any>(token);
      return decodedToken["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"];
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
}