import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HotelDataServiceService } from '../../Services/hotel-data-service.service';
import { Room } from '../../Models/room.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-room-cards',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './room-cards.component.html',
  styleUrls: ['./room-cards.component.css']
})
export class RoomCardsComponent implements OnInit {
  rooms: Room[] = [];
  loading = true;
  error = '';
  constructor(private router: Router){}
  ngOnInit(): void {
    this.loadRoomsFromLocalStorage();
  }

  loadRoomsFromLocalStorage(): void {
    const storedRooms = localStorage.getItem('rooms');
    console.log('Stored rooms:', storedRooms);
  
    if (storedRooms) {
      try {
        const parsedRooms: Room[] = JSON.parse(storedRooms);
  
        // 🔹 Filter out rooms that are marked as "Booked"
        this.rooms = parsedRooms.filter(room => room.availability !== 'Booked');
  
        console.log('Available rooms:', this.rooms);
  
        if (this.rooms.length === 0) {
          this.error = 'No available rooms. Please select another hotel.';
          console.warn('No available rooms found');
        }
        
      } catch (error) {
        this.error = 'Error parsing room data. Please refresh.';
        console.error('Error parsing rooms:', error);
      }
    } else {
      this.error = 'No rooms available. Please select a hotel.';
      console.error('No rooms found in localStorage');
    }
  
    this.loading = false;
  }
  
  onBookNow(roomId: number): void {
    const hotelId = localStorage.getItem('hotelId');
    localStorage.setItem('roomId', roomId.toString());
    if (hotelId) {
      this.router.navigate(['/booking', hotelId, roomId]);
    } else {
      this.error = 'Hotel information not found';
      console.error('Hotel ID not found in localStorage');
    }
  }
}