import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthServiceService } from '../../Services/auth-service.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-signup',
  imports: [RouterModule,FormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  userData = { name: '', email: '', password: '', contactNumber: '' };
  errorMessage = '';

  constructor(private authService: AuthServiceService, private router: Router) {}

  signup() {
    this.errorMessage = ''; // Clear previous errors

    this.authService.signup(this.userData).subscribe({
      next: (response) => {
        console.log('Signup Successful:', response);
        alert('Signup completed successfully!');
        this.router.navigate(['/app-hero-section-home-page']); // Redirect user after signup
      },
      error: (error) => {
        console.error('Signup error:', error);
        console.log('Error details:', error.error);

        this.errorMessage = error.error?.message || this.getErrorMessage(error.status);
      }
    });
  }

  private getErrorMessage(status: number): string {
    switch (status) {
      case 400: return 'Invalid input. Please check your details.';
      case 500: return 'Server error. Please try again later.';
      default: return 'Signup failed. Please try again.';
    }
  }
}