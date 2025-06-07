import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgStyle} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {LoginResponseType} from '../../../../types/login-response.type';
import {DefaultResponse} from '../../../../types/default-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    NgStyle,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  standalone: true,
  styleUrl: './login.component.scss'
})

export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  private _snackBar: MatSnackBar = inject(MatSnackBar)

  constructor(private fb: FormBuilder, private AuthService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false]
    })
  }

  login(){
    if(this.loginForm.valid && this.loginForm.value.email && this.loginForm.value.password){
      this.AuthService.login(this.loginForm.value.email, this.loginForm.value.password, this.loginForm.value.rememberMe)
        .subscribe({
          next: (result: LoginResponseType | DefaultResponse) => {
            let error = null;
            if((result as DefaultResponse).error !== undefined){
              error = (result as DefaultResponse).message;
            }
            let response = result as LoginResponseType;
            if(!response.accessToken || !response.refreshToken || !response.userId){
              error = 'Ошибка авторизации'
              throw new Error(error)
            }
            if(error){
              this._snackBar.open(error, "закрыть", {duration: 4000});
            }
            this.AuthService.setTokens(response.accessToken, response.accessToken);
            this.AuthService.userId = response.userId
            this._snackBar.open("Вы успешно авторизовались", 'закрыть', {duration: 3000});
            this.router.navigate(['/']);

          },
          error: (error:HttpErrorResponse) => {
            if(error.error && error.error.message){
              this._snackBar.open(error.error.message, 'закрыть', {duration: 3000});
            }else {
              this._snackBar.open('Ошибка авторизации', 'закрыть', {
                duration: 3000
              });
            }
          }
        })
    }


  }
}
