import { TestBed } from '@angular/core/testing';

import { HotelDataServiceService } from './hotel-data-service.service';

describe('HotelDataServiceService', () => {
  let service: HotelDataServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HotelDataServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
