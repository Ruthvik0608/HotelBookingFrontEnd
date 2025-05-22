import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelSearchFormComponent } from './hotel-search-form.component';

describe('HotelSearchFormComponent', () => {
  let component: HotelSearchFormComponent;
  let fixture: ComponentFixture<HotelSearchFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelSearchFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HotelSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
