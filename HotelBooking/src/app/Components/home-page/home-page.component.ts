import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { HeroSectionHomePageComponent } from "../hero-section-home-page/hero-section-home-page.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-home-page',
  imports: [HeroSectionHomePageComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {

}
