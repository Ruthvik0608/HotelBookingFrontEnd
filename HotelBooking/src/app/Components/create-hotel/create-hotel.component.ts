import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-create-hotel',
  imports: [RouterModule,FormsModule],
  templateUrl: './create-hotel.component.html',
  styleUrls: ['./create-hotel.component.css']
})
export class CreateHotelComponent {
  hotel = {
    id: 0,
    name: '',
    location: '',
    managerID: 0,
    amenities: '',
    rating: 0,
    imageURL: ''
  };

  constructor(private http: HttpClient) {}

  onSubmit(form: any) {
    debugger;
    if (form.invalid) {
      alert('Please fill in all required fields.');
      return;
    }

    const headers = this.createHeaders();
    
    this.http.post('https://localhost:7140/api/Hotel', this.hotel, { headers })
      .subscribe({
        next: (response) => {
          console.log('Hotel Form Submitted:', response);
          alert('Hotel details submitted successfully!');
        },
        error: (error) => {
          console.error('Error submitting hotel details:', error);
          alert('Failed to submit hotel details.');
        }
      });
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
