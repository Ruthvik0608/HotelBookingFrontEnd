import { Injectable , signal} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HotelServiceService {

  hotelsData = signal<any[]>([]); // Using signal to store API response

  constructor(private http: HttpClient) { }
  getAvailableHotels(startDate: string, endDate: string): Observable<any[]> {
    const url = `https://localhost:7140/api/Hotel/availability?startDate=${startDate}&endDate=${endDate}`;
    return this.http.get<any[]>(url);
  }
  
  
}