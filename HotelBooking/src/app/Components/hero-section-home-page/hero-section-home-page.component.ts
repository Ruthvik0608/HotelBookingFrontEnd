import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { HotelDataServiceService } from '../../Services/hotel-data-service.service';


@Component({
  selector: 'app-hero-section-home-page',
  imports: [RouterModule],
  templateUrl: './hero-section-home-page.component.html',
  styleUrls: ['./hero-section-home-page.component.css']
})

export class HeroSectionHomePageComponent {
  hotels: any[] = [];
  private GetAllHotelsUrl = 'https://localhost:7140/api/Hotel';

  constructor(private http: HttpClient, public router:Router,public hotelDataService: HotelDataServiceService) {}

  getAllHotels(): void {
    this.http.get<any[]>(this.GetAllHotelsUrl).subscribe({
      next: (data) => {
        console.log('API Response:', data); // Debugging
        this.hotels = data; // Store API response
        this.router.navigate(['/app-hotel-card-display'])
      },
      error: (error) => {
        console.error('Error fetching hotels:', error);
      }
    });
  }
}