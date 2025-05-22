import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthServiceService } from '../../Services/auth-service.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  private authSubscription?: Subscription;

  constructor(private authService: AuthServiceService,private router: Router) {}

  ngOnInit(): void {
    this.authSubscription = this.authService.isAuthenticated$.subscribe(
      (status: boolean) => {
        this.isLoggedIn = status;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']); 
  }
  navigateToHome(): void {
    this.router.navigate(['/home']); 
  }
  navigateToRecentBookings():void{
    this.router.navigate(['/profile/recent-bookings']);
  }
}