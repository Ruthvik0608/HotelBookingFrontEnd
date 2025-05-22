import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { LoginPageComponent } from './Components/login-page/login-page.component';
import { SignupComponent } from './Components/signup/signup.component';
import { HotelSearchComponent } from './Components/hotel-search-form/hotel-search-form.component';
import { BookingFormComponent } from './Components/booking-form/booking-form.component';
import { HotelCardDisplayComponent } from './Components/hotel-card-display/hotel-card-display.component';
import { AuthGuard } from './Services/auth.guard';
import { FilterComponent } from './Components/filter/filter.component';
import { RoomCardsComponent } from './Components/room-cards/room-cards.component';
// import { BookingStatusComponent } from './Components/booking-status/booking-status.component';
import { BookingScreenComponent } from './Components/booking-screen/booking-screen.component';
import { RecentBookingsComponent } from './Components/recentbookings/recentbookings.component';
import { AdmincomponentComponent } from './Components/admindashboard/admindashboard.component';
import { AdminGuard } from './Services/admin.guard';
import { ReviewComponent } from './Components/review/review.component';
import { CreateHotelComponent } from './Components/create-hotel/create-hotel.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'app-signup', component: SignupComponent },
  { path: 'hotels', component: HotelCardDisplayComponent },
  { 
    path: 'search', 
    component: HotelSearchComponent,
    canActivate: [AuthGuard]
  },
  { 
    path: 'booking/:hotelId/:roomId', 
    component: BookingFormComponent,
    canActivate: [AuthGuard]
  },
  // { path: 'booking-status/:hotelId/:roomId', component: BookingStatusComponent },  // ✅ Unique route name
  { path: 'filter', component: FilterComponent },  // ✅ Standardized naming
  { path: 'rooms/:id', component: RoomCardsComponent },
  { path: 'app-booking-screen', component: BookingScreenComponent },
  { 
    path: 'profile/recent-bookings', 
    component: RecentBookingsComponent,
    title: 'Recent Bookings'
  },
  { 
    path: 'admin',
    component: AdmincomponentComponent,
    canActivate: [AdminGuard],
    title: 'Admin Dashboard'
  },
  // { path: '**', redirectTo: '/home' },
  {
    path:'review',
    component:ReviewComponent
  },
  {
    path:'app-create-hotel',
    component:CreateHotelComponent,
    canActivate: [AdminGuard]
  }
];

