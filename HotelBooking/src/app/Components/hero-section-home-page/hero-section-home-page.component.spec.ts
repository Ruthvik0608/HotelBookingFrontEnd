import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroSectionHomePageComponent } from './hero-section-home-page.component';

describe('HeroSectionHomePageComponent', () => {
  let component: HeroSectionHomePageComponent;
  let fixture: ComponentFixture<HeroSectionHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroSectionHomePageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroSectionHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
