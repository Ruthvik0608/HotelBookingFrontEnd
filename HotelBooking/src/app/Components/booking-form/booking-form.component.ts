import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Booking } from '../../Models/booking.model';
import { jwtDecode } from 'jwt-decode'; // Ensure you have jwt-decode installed
import { BookingDetails } from '../../Models/BookingDetails.model';
interface DecodedToken {
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier': string;
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
  'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
  exp: number;
  iss: string;
  aud: string;
}

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [RouterModule,CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.css']
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  roomId!: number;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookingForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.roomId = Number(this.route.snapshot.paramMap.get('roomId'));
  }

  getUserIdFromToken(): number {
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }
    
    try {
      const decodedToken = jwtDecode<DecodedToken>(token);
      console.log('Decoded token:', decodedToken);
      
      const userId = Number(decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']);
      if (isNaN(userId)) {
        throw new Error('Invalid user ID in token');
      }
      localStorage.setItem('userId', userId.toString());
      return userId;
    } catch (error) {
      console.error('Error decoding token:', error);
      throw new Error('Failed to decode token');
    }
  }

  generateRandomId(): number {
    return Math.floor(Math.random() * 1000000);
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      try {
        const booking: Booking = {
          userID: this.getUserIdFromToken(),
          roomID: this.roomId,
          checkInDate: this.bookingForm.value.checkInDate,
          checkOutDate: this.bookingForm.value.checkOutDate,
          status: 'Confirmed', // Changed from 'Success' to 'Confirmed'
          paymentID: this.generateRandomId()
        };

        this.http.post('https://localhost:7140/api/Booking', booking, {
          observe: 'response',
          responseType: 'text'
        }).subscribe({
          next: (response) => {
            if (response.status === 200) {
              console.log('Booking successful');
              localStorage.setItem('bookingDetails', JSON.stringify(booking));
              // Update room availability after successful booking
              this.updateRoomAvailability(this.roomId);
            }
          },
          error: (error) => {
            console.error('Booking failed:', error);
            alert('An error occurred while processing your booking.');
          }
        });
      } catch (error) {
        if (error instanceof Error && error.message === 'No token found') {
          this.router.navigate(['/login']);
        }
      }
    }
  }

  updateRoomAvailability(roomId: number): void {
    if (!roomId) {
      console.error('Invalid Room ID');
      return;
    }

    const updatePayload = {
      roomId: roomId,
      isAvailable: false  // Setting room as unavailable when booked
    };

    this.http.put(`https://localhost:7140/api/Room/updateAvailability/${roomId}`, updatePayload, {
      observe: 'response',
      headers: {
        'Content-Type': 'application/json'
      }
    }).subscribe({
      next: (response) => {
        if (response.status === 200) {
          console.log(`Room ${roomId} availability updated to Booked.`);
          // Store the updated room status
          localStorage.setItem(`room_${roomId}_status`, 'booked');
          
          // After successful room update, proceed with booking flow
          const hotelID = Number(localStorage.getItem('hotelId'));
          if (!isNaN(hotelID)) {
            const userId = this.getUserIdFromToken();
            this.fetchAndStoreBookingId(userId, roomId, hotelID);
            this.router.navigate(['/app-booking-screen']);
          } else {
            console.error('Invalid Hotel ID in localStorage');
          }
        }
      },
      error: (error) => {
        console.error(`Failed to update availability for Room ${roomId}:`, error);
        if (error.status === 500) {
          // Retry logic
          this.retryRoomUpdate(roomId, updatePayload, 3);
        } else {
          alert('Failed to update room availability. Please try again.');
        }
      }
    });
  }

  private retryRoomUpdate(roomId: number, payload: any, retries: number): void {
    if (retries === 0) {
      alert('Failed to update room availability after multiple attempts.');
      return;
    }

    setTimeout(() => {
      this.http.put(`https://localhost:7140/api/Room/updateAvailability/${roomId}`, payload, {
        observe: 'response',
        headers: {
          'Content-Type': 'application/json'
        }
      }).subscribe({
        next: (response) => {
          if (response.status === 200) {
            console.log(`Room ${roomId} availability updated on retry.`);
            const hotelID = Number(localStorage.getItem('hotelId'));
            if (!isNaN(hotelID)) {
              const userId = this.getUserIdFromToken();
              this.fetchAndStoreBookingId(userId, roomId, hotelID);
              this.router.navigate(['/booking-screen']);
            }
          }
        },
        error: (error) => {
          console.error(`Retry failed for Room ${roomId}:`, error);
          this.retryRoomUpdate(roomId, payload, retries - 1);
        }
      });
    }, 1000); // Wait 1 second before retrying
  }

  private fetchAndStoreBookingId(userId: number, roomId: number, hotelId: number): void {

    const url = `https://localhost:7140/api/Booking/getBookingId/${userId}/${roomId}/${hotelId}`;
  
    this.http.get<{ bookingID: number }>(url).subscribe({
      next: (response) => {
        if (response?.bookingID) {
          localStorage.setItem('bookingId', response.bookingID.toString()); 
          // ✅ Store BookingID in local storage
          console.log('Stored Booking ID:', response.bookingID);
        }
      },
      error: (error) => {
        console.error('Error fetching Booking ID:', error);
      }
    });
  }
}