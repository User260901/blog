import {Component, OnInit} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatAnchor, MatButton} from '@angular/material/button';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatAnchor,
    NgIf
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  constructor(private AuthService: AuthService) {
    this.isLoggedIn = this.AuthService.getIsLoggedIn()
  }


  ngOnInit() {
    this.AuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    })
  }

  logOut(){
    this.AuthService.logout().subscribe((response) => {
      this.AuthService.removeTokens();
    })
  }

}
