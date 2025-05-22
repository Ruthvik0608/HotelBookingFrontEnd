import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../Models/room.model';
import { Hotel } from '../Models/Hotel.model';

interface SearchParams {
  checkIn?: string;
  checkOut?: string;
  location?: string;
}

@Injectable({
  providedIn: 'root'
})
export class HotelDataServiceService {
  private baseUrl = 'https://localhost:7140/api';

  constructor(private http: HttpClient) {}

  fetchAllHotels(): Observable<Hotel[]> {
    const headers = this.createHeaders();
    return this.http.get<Hotel[]>(`${this.baseUrl}/Hotel`, { headers });
  }
  private createHeaders(): HttpHeaders { 
    const token = localStorage.getItem('token'); 
    return new HttpHeaders({ Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' });
   }  

  fetchFilteredHotels(searchParams: SearchParams): Observable<Hotel[]> {
    let params = new HttpParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key as keyof SearchParams]) {
        params = params.append(key, searchParams[key as keyof SearchParams]!);
      }
    });
    return this.http.get<Hotel[]>(`${this.baseUrl}/Hotel/search`, { params });
  }

  getRoomsByHotelId(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/Room/Hotel/${hotelId}`);
  }
}
