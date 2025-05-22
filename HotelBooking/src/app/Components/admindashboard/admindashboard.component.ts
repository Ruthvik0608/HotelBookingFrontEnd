import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { NgChartsModule, BaseChartDirective } from 'ng2-charts';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

// ... (Interfaces remain the same)

@Component({
  selector: 'app-admindashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, NgChartsModule],
  templateUrl: './admindashboard.component.html',
  styleUrls: ['./admindashboard.component.css']
})
export class AdmincomponentComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  bookings: any[] = [];
  customers: any[] = [];
  hotels: any[] = [];
  reviews: any[] = [];

  visibleRows: number = 5;
  totalUsers: number = 0;
  totalHotels: number = 0;
  totalAdmins: number = 0;
  totalCustomers: number = 0;
  totalManagers: number = 0;
  private baseUrl = 'https://localhost:7140/api';

  // Bar Chart Configuration
  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    scales: {
      x: { display: true },
      y: { display: true, beginAtZero: true }
    }
  };

  public barChartType: ChartType = 'bar';
  public barChartData: ChartData<'bar'> = {
    labels: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    datasets: [{
      data: Array(12).fill(0),
      label: 'Monthly Bookings',
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      borderColor: 'rgb(54, 162, 235)',
      borderWidth: 1
    }]
  };

  // Doughnut Chart Configuration
  public doughnutChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 2, // Ensures proper sizing
    plugins: {
      legend: { position: 'top' }
    },
    animation: {
      duration: 0 // Disables animation delay
    }
  };
  

  public doughnutChartType: ChartType = 'doughnut';
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ['Pending', 'Confirmed'],
    datasets: [{
      data: [0, 0],
      backgroundColor: ['#ffc107', '#28a745']
    }]
  };

  // Ratings Chart Configuration
  public ratingsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' }
    }
  };

  public ratingsChartType: ChartType = 'pie';
  public ratingsChartData: ChartData<'pie'> = {
    labels: ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'],
    datasets: [{
      data: [0, 0, 0, 0, 0],
      backgroundColor: ['#ff6384', '#ff9f40', '#ffcd56', '#4bc0c0', '#36a2eb']
    }]
  };

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit(): void {
    this.getBookings();
    this.getCustomers();
    this.getHotels();
    this.getReviews();
    this.getUsersByRole();
  }

  private createHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  getUsersByRole(): void {
    this.http.get<any[]>(`${this.baseUrl}/User`, { headers: this.createHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching users:', error);
          return throwError(() => error);
        })
      )
      .subscribe({
        next: (users: any[]) => {
          this.totalAdmins = users.filter(user => user.role === 'Admin').length;
          this.totalManagers = users.filter(user => user.role === 'Manager').length;
          this.totalCustomers = users.filter(user => user.role === 'Customer').length;
          this.totalUsers = users.length;
        },
        error: (error) => {
          console.error('Error processing users:', error);
        }
      });
  }

  getBookings() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    this.http.get<any[]>('https://localhost:7140/api/Booking', { headers }).subscribe({
      next: (data) => {
        console.log('Fetched Bookings:', data);
        this.bookings = data;
        this.generateMonthlyBookingsChart(); // Call chart update after data is fetched
        this.updateDoughnutChart(); // Call doughnut chart update
      },
      error: (error) => {
        console.error('Error fetching bookings:', error);
      }
    });
  }


  seeMore(): void {
    this.visibleRows += 5;
  }

  getCustomers(): void {
    this.http.get<any[]>(`${this.baseUrl}/User`, { headers: this.createHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        this.customers = data;
        this.totalUsers = data.length;
      });
  }

  getHotels(): void {
    this.http.get<any[]>(`https://localhost:7140/api/Hotel`, { headers: this.createHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching customers:', error);
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        this.hotels = data;
        this.totalHotels = data.length;
      });

  }

  getReviews(): void {
    this.http.get<any[]>(`${this.baseUrl}/Review`, { headers: this.createHeaders() })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Error fetching reviews:', error);
          return throwError(() => error);
        })
      )
      .subscribe(data => {
        this.reviews = data;
        this.updateRatingsChart(); // Call ratings chart update after fetching reviews
      });
  }

  generateMonthlyBookingsChart(): void {
    const monthlyCounts = Array(12).fill(0);

    this.bookings.forEach(booking => {
      const month = new Date(booking.checkInDate).getMonth();
      monthlyCounts[month]++;
    });

    this.barChartData.datasets[0].data = monthlyCounts;
    this.chart?.update(); // Update the chart instance
  }

  updateRatingsChart(): void {
    const ratingsCount = [0, 0, 0, 0, 0];

    this.reviews.forEach(review => {
      if (review.rating >= 1 && review.rating <= 5) {
        ratingsCount[review.rating - 1]++;
      }
    });

    this.ratingsChartData.datasets[0].data = ratingsCount;
    this.chart?.update(); // Update the chart instance
  }

  updateDoughnutChart(): void {
    if (!this.bookings || this.bookings.length === 0) {
      console.warn("Bookings data is not yet available.");
      return;
    }
  
    const pendingBookings = this.bookings.filter(booking => booking.status.toLowerCase() === 'pending').length;
    const confirmedBookings = this.bookings.filter(booking => booking.status.toLowerCase() === 'confirmed').length;
  
    this.doughnutChartData.datasets[0].data = [pendingBookings, confirmedBookings];
  
    console.log("Updated Doughnut Chart Data:", this.doughnutChartData.datasets[0].data);
  }

  openAddHotelForm(): void {
    this.router.navigate(['/app-create-hotel']);

  }
  
}
