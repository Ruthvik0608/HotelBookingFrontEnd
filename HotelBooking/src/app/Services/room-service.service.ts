import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room } from '../Models/room.model';

@Injectable({
  providedIn: 'root'
})
export class RoomServiceService {
  private baseUrl = 'https://localhost:7140/api/Room/Hotel';

  constructor(private http: HttpClient) {}

  getRoomsByHotel(hotelId: number): Observable<Room[]> {
    return this.http.get<Room[]>(`${this.baseUrl}/${hotelId}`);
  }
}
