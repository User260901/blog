import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {MatMenu, MatMenuItem, MatMenuTrigger} from '@angular/material/menu';
import {MatAnchor, MatButton} from '@angular/material/button';
import {AuthService} from '../../services/auth.service';
import {NgIf} from '@angular/common';
import {Subject} from 'rxjs';
import {UserInfoType} from '../../../../types/user-info.type';
import {DefaultResponse} from '../../../../types/default-response.type';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    MatMenu,
    MatMenuTrigger,
    MatMenuItem,
    MatAnchor,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './header.component.html',
  standalone: true,
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  user: UserInfoType = {
    id: '',
    name: '',
    email: '',
  }
  constructor(private AuthService: AuthService, public router: Router) {
    this.isLoggedIn = this.AuthService.getIsLoggedIn()
  }


  ngOnInit() {
    this.AuthService.isLoggedIn$.subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
      this.getUserInfo()
    })
    this.getUserInfo()
  }

  logOut(){
    this.AuthService.logout().subscribe({
      next: ()=> {
        this.AuthService.removeTokens();
        this.router.navigate(['login']);
      },
      error: (e) =>{
        this.AuthService.removeTokens();
      }
    })
  }

  getUserInfo(){
    if (this.isLoggedIn) {
      this.AuthService.getUserInfo()
        .subscribe((userInfo: UserInfoType | DefaultResponse) => {
          if((userInfo as DefaultResponse).error !== undefined){
            throw new Error((userInfo as DefaultResponse).message)
          }
          this.user = userInfo as UserInfoType;
        })
    }
  }

}
