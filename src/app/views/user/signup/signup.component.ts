import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {NgIf, NgStyle} from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import {AuthService} from '../../../shared/services/auth.service';
import {LoginResponseType} from '../../../../types/login-response.type';
import {DefaultResponse} from '../../../../types/default-response.type';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [
    ReactiveFormsModule,
    RouterLink,
  ],
  templateUrl: './signup.component.html',
  standalone: true,
  styleUrl: './signup.component.scss'
})
export class SignupComponent implements OnInit {

  signUpForm!: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private AuthService: AuthService, private _snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.signUpForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^([А-ЯЁ][а-яё]+)(\s[А-ЯЁ][а-яё]+)*$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      agree: [false, Validators.required],
    })
  }

  signup(){
    if(this.signUpForm.valid && this.signUpForm.value.name && this.signUpForm.value.email && this.signUpForm.value.password && this.signUpForm.value.agree){
      this.AuthService.signup(this.signUpForm.value.name, this.signUpForm.value.email, this.signUpForm.value.password)
        .subscribe({
          next: (success:LoginResponseType | DefaultResponse) => {
            let error = null
            if((success as DefaultResponse).error != undefined){
              error = (success as DefaultResponse).message
            }

            let response = success as LoginResponseType;
            if(!response.accessToken || !response.refreshToken || !response.userId){
              error = 'Ошибка авторизации';
            }

            if(error){
              this._snackBar.open(error, 'закрыть', {duration: 4000});
              throw new Error(error);
            }

            this.AuthService.setTokens(response.accessToken, response.refreshToken)
            this.AuthService.userId = response.userId
            this._snackBar.open("Вы успешно зарегистрировалсь", 'закрыть', {duration: 3000});
            this.router.navigate(['/']);

          },
          error: (error: HttpErrorResponse) => {
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
