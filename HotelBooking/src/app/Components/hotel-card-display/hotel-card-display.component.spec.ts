import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelCardDisplayComponent } from './hotel-card-display.component';

describe('HotelCardDisplayComponent', () => {
  let component: HotelCardDisplayComponent;
  let fixture: ComponentFixture<HotelCardDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelCardDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelCardDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
