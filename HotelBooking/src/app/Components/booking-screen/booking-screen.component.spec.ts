import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingScreenComponent } from './booking-screen.component';

describe('BookingScreenComponent', () => {
  let component: BookingScreenComponent;
  let fixture: ComponentFixture<BookingScreenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingScreenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
