import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from '../filter/filter.component';
import { HotelDataServiceService } from '../../Services/hotel-data-service.service';
import { FilterService } from '../../Services/filter.service';
import { Hotel } from '../../Models/Hotel.model';
import { Room } from '../../Models/room.model';

@Component({
  selector: 'app-hotel-card-display',
  standalone: true,
  imports: [CommonModule, FilterComponent, RouterModule, HttpClientModule],
  templateUrl: './hotel-card-display.component.html',
  styleUrls: ['./hotel-card-display.component.css']
})
export class HotelCardDisplayComponent implements OnInit {
  private hotelService = inject(HotelDataServiceService);
  private filterService = inject(FilterService);
  private router = inject(Router);

  allHotels: Hotel[] = [];
  displayedHotels: Hotel[] = [];
  roomsByHotel: { [key: number]: Room[] } = {};
  loading = false;

  ngOnInit() {
    this.getHotels();
    this.setupFilterSubscription();
  }

  private setupFilterSubscription() {
    this.filterService.filteredHotels$.subscribe(hotels => {
      this.displayedHotels = hotels;
      // Store filtered hotels in localStorage
      localStorage.setItem('filteredHotels', JSON.stringify(hotels));
    });
  }

  private getHotels(): void {
    this.loading = true;
    
    // First try to get from localStorage
    const cachedHotels = localStorage.getItem('allHotels');
    
    if (cachedHotels) {
      try {
        const hotels = JSON.parse(cachedHotels);
        this.allHotels = hotels;
        this.displayedHotels = hotels;
        this.loading = false;
        console.log('Loaded hotels from cache:', this.displayedHotels);
      } catch (error) {
        console.error('Error parsing cached hotels:', error);
        this.fetchHotelsFromAPI();
      }
    } else {
      this.fetchHotelsFromAPI();
    }
  }

  private fetchHotelsFromAPI(): void {
    this.hotelService.fetchAllHotels().subscribe({
      next: (hotels: Hotel[]) => {
        this.allHotels = [...hotels];
        this.displayedHotels = [...hotels];
        // Store in localStorage
        localStorage.setItem('allHotels', JSON.stringify(hotels));
        console.log('Loaded hotels from API:', this.displayedHotels);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading hotels:', error);
        this.loading = false;
      }
    });
  }

  getRoomsForHotel(hotelId: number): void {
    // Store selected hotel details
    const selectedHotel = this.allHotels.find(h => h.hotelID === hotelId);
    if (selectedHotel) {
      localStorage.setItem('selectedHotel', JSON.stringify(selectedHotel));
    }
    
    localStorage.setItem('hotelId', hotelId.toString());
    
    // Check if rooms are already in cache
    const cachedRooms = localStorage.getItem(`rooms_${hotelId}`);
    if (cachedRooms) {
      try {
        const rooms = JSON.parse(cachedRooms);
        this.handleRoomsData(hotelId, rooms);
      } catch (error) {
        console.error('Error parsing cached rooms:', error);
        this.fetchRoomsFromAPI(hotelId);
      }
    } else {
      this.fetchRoomsFromAPI(hotelId);
    }
  }

  private fetchRoomsFromAPI(hotelId: number): void {
    this.hotelService.getRoomsByHotelId(hotelId).subscribe({
      next: (rooms: Room[]) => {
        this.handleRoomsData(hotelId, rooms);
      },
      error: (error) => {
        console.error(`Error loading rooms for hotel ${hotelId}:`, error);
        // Navigate anyway but show error message
        this.router.navigate(['/rooms', hotelId], { 
          queryParams: { error: 'Failed to load rooms' }
        });
      }
    });
  }

  private handleRoomsData(hotelId: number, rooms: Room[]): void {
    this.roomsByHotel[hotelId] = rooms;
    // Store rooms with hotel-specific key
    localStorage.setItem(`rooms_${hotelId}`, JSON.stringify(rooms));
    // Store general rooms data
    localStorage.setItem('rooms', JSON.stringify(rooms));
    
    // Navigate to rooms page
    this.router.navigate(['/rooms', hotelId]);
  }

  updateHotels(hotels: Hotel[]): void {
    this.displayedHotels = hotels;
    localStorage.setItem('filteredHotels', JSON.stringify(hotels));
  }
}