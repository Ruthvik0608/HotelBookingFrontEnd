import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Hotel } from '../../Models/Hotel.model';
import { FilterService } from '../../Services/filter.service';
import { HotelDataServiceService } from '../../Services/hotel-data-service.service';

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css']
})
export class FilterComponent implements OnInit {
  @Input() allHotels: Hotel[] = [];
  
  locations: string[] = [];
  amenities: string[] = [];
  selectedLocations = new Set<string>();
  selectedAmenities = new Set<string>();
  rating: number = 0;

  constructor(private filterService: FilterService,private hotelData: HotelDataServiceService) {}

  ngOnInit() {
    console.log('Filter Component Initialized with hotels:', this.allHotels);
  
    this.hotelData.fetchAllHotels().subscribe({
      next: (hotels: Hotel[]) => {
        this.allHotels = hotels;
        this.extractLocationsAndAmenities();
        this.filterService.updateFilteredHotels(this.allHotels);
      },
      error: (error) => console.error('Error fetching hotels:', error)
    });
  }
  

  ngOnChanges() {
    console.log('Hotels input changed:', this.allHotels);
    if (this.allHotels.length > 0) {
      this.extractLocationsAndAmenities();
    }
  }

  private extractLocationsAndAmenities() {
    const locationSet = new Set<string>();
    const amenitiesSet = new Set<string>();

    console.log('Extracting from hotels:', this.allHotels);

    this.allHotels.forEach(hotel => {
      // Add location
      locationSet.add(hotel.location);

      // Split and add amenities
      const amenityList = hotel.amenities.split(',');
      amenityList.forEach(amenity => {
        amenitiesSet.add(amenity.trim());
      });
    });

    this.locations = Array.from(locationSet).sort();
    this.amenities = Array.from(amenitiesSet).sort();

    console.log('Extracted locations:', this.locations);
    console.log('Extracted amenities:', this.amenities);
  }

  onFilterChange(type: string, value: string, event: any) {
    const isChecked = event.target.checked;
    const selectedSet = type === 'location' ? this.selectedLocations : this.selectedAmenities;

    if (isChecked) {
      selectedSet.add(value);
    } else {
      selectedSet.delete(value);
    }

    this.applyFilters();
  }

  onRatingChange(event: any) {
    this.rating = parseFloat(event.target.value);
    this.applyFilters();
  }

  resetFilters() {
    this.selectedLocations.clear();
    this.selectedAmenities.clear();
    this.rating = 0;
    this.applyFilters();
  }

  private applyFilters() {
    let filteredResults = [...this.allHotels];

    if (this.selectedLocations.size > 0) {
      filteredResults = filteredResults.filter(hotel => 
        this.selectedLocations.has(hotel.location)
      );
    }

    if (this.selectedAmenities.size > 0) {
      filteredResults = filteredResults.filter(hotel => {
        const hotelAmenities = hotel.amenities.split(',').map(a => a.trim());
        return Array.from(this.selectedAmenities).every(amenity => 
          hotelAmenities.includes(amenity)
        );
      });
    }

    if (this.rating > 0) {
      filteredResults = filteredResults.filter(hotel => 
        hotel.rating >= this.rating
      );
    }

    console.log('Applying filters, results:', filteredResults);
    this.filterService.updateFilteredHotels(filteredResults);
  }
}