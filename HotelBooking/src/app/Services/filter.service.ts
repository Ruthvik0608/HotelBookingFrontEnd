import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Hotel } from '../Models/Hotel.model';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filteredHotelsSource = new BehaviorSubject<Hotel[]>([]);
  filteredHotels$ = this.filteredHotelsSource.asObservable();

  updateFilteredHotels(hotels: Hotel[]) {
    this.filteredHotelsSource.next(hotels);
  }
}