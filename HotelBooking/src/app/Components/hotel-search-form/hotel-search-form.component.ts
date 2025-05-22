import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HotelDataServiceService } from '../../Services/hotel-data-service.service';
import { Hotel } from '../../Models/Hotel.model';

interface SearchCriteria {
  checkInDate: string;
  checkOutDate: string;
}

@Component({
  selector: 'app-hotel-search-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './hotel-search-form.component.html',
  styleUrls: ['./hotel-search-form.component.css']
})
export class HotelSearchComponent {
  searchForm: FormGroup;
  searchCriteria: SearchCriteria = {
    checkInDate: '',
    checkOutDate: ''
  };

  constructor(
    private fb: FormBuilder,
    private hotelService: HotelDataServiceService,
    private router: Router
  ) {
    this.searchForm = this.fb.group({
      checkInDate: ['', Validators.required],
      checkOutDate: ['', Validators.required],
      location: [''] // Added location field
    });
  }

  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchParams = {
        checkIn: this.searchForm.value.checkInDate,
        checkOut: this.searchForm.value.checkOutDate,
        location: this.searchForm.value.location
      };

      this.hotelService.fetchFilteredHotels(searchParams).subscribe({
        next: (hotels: Hotel[]) => {
          console.log('Filtered hotels:', hotels);
          // Navigate to hotels display with filtered results
          this.router.navigate(['/hotels'], { state: { hotels } });
        },
        error: (error: Error) => {
          console.error('Error fetching hotels:', error);
        }
      });
    }
  }

  exploreHotels(): void {
    this.router.navigate(['/hotels']);
  }
}