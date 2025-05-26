import { Component } from '@angular/core';
import {FooterComponent} from './footer/footer.component';
import {RouterOutlet} from '@angular/router';
import {HeaderComponent} from './header/header.component';

@Component({
  selector: 'app-layout',
  imports: [
    FooterComponent,
    RouterOutlet,
    HeaderComponent
  ],
  templateUrl: './layout.component.html',
  standalone: true,
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

}
