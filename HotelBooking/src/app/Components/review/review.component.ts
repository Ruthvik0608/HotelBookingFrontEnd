import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

interface Review {
  id: number;
  name: string;
  rating: number;
  comment: string;
  date: Date;
}
@Component({
  selector: 'app-review',
  imports: [RouterModule,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent {
  private ReviewUrl = 'https://localhost:7140/api/Review'
  reviews: Review[] = [];
  reviewForm: FormGroup;
  bookingId: number; // Initialize bookingId as null
  newReview: Partial<Review> = {};
  editingId: number | null = null;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.bookingId = Number(localStorage.getItem('bookingId'));// Retrieve bookingId from route
 
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required, Validators.min(1), Validators.max(5)]],
      comment: ['', [Validators.required, Validators.maxLength(500)]]
    });    
  }
    // Submit a new review
    submitReview(): void {
      console.log('Form Validity:', this.reviewForm.valid);
      console.log('Form Values:', this.reviewForm.value);

      if (this.reviewForm.valid) {
        const reviewData = {
          userID: Number(localStorage.getItem('userId')),
          hotelID: Number(localStorage.getItem('hotelId')),
          bookingID: this.bookingId,
          rating: this.reviewForm.value.rating,
          comment: this.reviewForm.value.comment,
          timestamp: new Date().toISOString() // Correct format
        };
    
        console.log('Review Data:', reviewData);
        debugger;
        this.http.post(this.ReviewUrl, reviewData).subscribe({

          next: () => {
            alert('Review submitted successfully!');
            this.router.navigate(['/home']);
          },
          error: (error) => {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
          }
        });
      } else {
        alert('Please provide a valid rating and comment!');
      }
    }
    
  
 
  
 
 
    setRating(rating: number) {
      this.reviewForm.patchValue({ rating: rating }); // ✅ Updates form value properly
    }
    
 
  generateStars(rating: number): string[] {
    return Array.from({ length: 5 }, (_, i) => i < rating ? '★' : '☆');
  }
 
  sortByRecent() {
this.reviews.sort((a, b) => b.date.getTime() - a.date.getTime());
  }
 
  sortByTopRated() {
this.reviews.sort((a, b) => b.rating - a.rating);
  }
 
  sortByLowestRated() {
this.reviews.sort((a, b) => a.rating - b.rating);
  }
 
  get averageRating(): number {
return this.reviews.length ? this.reviews.reduce((a, b) => a + b.rating, 0) / this.reviews.length : 0;
  }
}