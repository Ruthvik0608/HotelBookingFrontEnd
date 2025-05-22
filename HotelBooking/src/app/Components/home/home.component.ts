import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-section position-relative d-flex flex-column justify-content-center align-items-center text-center vh-100">
      
      <!-- Background Slideshow -->
      <div class="slideshow-container">
        <div class="slideshow-item" style="background-image: url('https://images.pexels.com/photos/18524069/pexels-photo-18524069/free-photo-of-a-hotel-sign-with-the-word-hotel-in-silver.jpeg');"></div>
        <div class="slideshow-item" style="background-image: url('https://images.pexels.com/photos/19947936/pexels-photo-19947936/free-photo-of-interior-of-a-modern-hotel-restaurant.jpeg');"></div>
        <div class="slideshow-item" style="background-image: url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg');"></div>
        <div class="slideshow-item" style="background-image: url('https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg');"></div>
      </div>

      <!-- Main Content -->
      <div class="content-container">
        <h1 class="display-3 fw-bold text-white mb-3" style="text-shadow: 2px 2px 5px rgba(0,0,0,0.7);">
          Welcome to Smart Hotel Booking
        </h1>
        <p class="fs-4 text-white mb-4">Find the perfect stay with us</p>
        <button (click)="exploreHotels()" class="btn btn-light btn-lg px-5 py-2 shadow-sm border-0 rounded-pill">
          <i class="bi bi-building me-2"></i> Explore Now
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* Slideshow Container */
    .slideshow-container {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: -1;
    }

    /* Individual Slide */
    .slideshow-item {
      position: absolute;
      width: 100%;
      height: 100%;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      animation: fade 16s infinite;
      opacity: 0;
    }

    /* Fade Effect */
    @keyframes fade {
      0% { opacity: 1; }
      25% { opacity: 0; }
      50% { opacity: 1; }
      75% { opacity: 0; }
      100% { opacity: 1; }
    }

    .slideshow-item:nth-child(1) { animation-delay: 0s; }
    .slideshow-item:nth-child(2) { animation-delay: 4s; }
    .slideshow-item:nth-child(3) { animation-delay: 8s; }
    .slideshow-item:nth-child(4) { animation-delay: 12s; }

    /* Content Container */
    .content-container {
      position: relative;
      z-index: 1;
    }
  `]
})
export class HomeComponent {
  constructor(private router: Router) {}

  exploreHotels() {
    this.router.navigate(['/hotels']);
  }
}
