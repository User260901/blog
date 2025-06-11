import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {LoginResponseType} from '../../../types/login-response.type';
import {DefaultResponse} from '../../../types/default-response.type';
import {Observable, Subject, throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  accessTokenKey = 'accessToken'
  refreshTokenKey = 'refreshToken'
  userId = 'userId'

  isLoggedIn = false;
  isLoggedIn$: Subject<boolean> = new Subject<boolean>();

  constructor(private http: HttpClient) {
    this.isLoggedIn = !!localStorage.getItem(this.accessTokenKey)
  }

  login(email: string, password: string, remember: boolean):Observable<LoginResponseType | DefaultResponse> {
    return this.http.post<LoginResponseType | DefaultResponse>(environment.api + 'login', {
      email: email,
      password: password,
      rememberMe: remember
    })
  }

  signup(name: string, email: string, password: boolean):Observable<LoginResponseType | DefaultResponse> {
    return this.http.post<LoginResponseType | DefaultResponse>(environment.api + 'signup', {
      name: name,
      email: email,
      password: password
    })
  }

  logout():Observable<DefaultResponse> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponse>(environment.api + "logout", {
        refreshToken: tokens.refreshToken
      });
    }

    throw throwError(()=> "Can not find Token")
  }

  getIsLoggedIn(){
    return this.isLoggedIn;
  }

  removeTokens(){
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLoggedIn = false;
    this.isLoggedIn$.next(false);
  }

  setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLoggedIn = true;
    this.isLoggedIn$.next(true);
  }

  getTokens(){
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  refresh(): Observable<DefaultResponse | LoginResponseType> {
    const tokens = this.getTokens();
    if(tokens && tokens.refreshToken){
      return this.http.post<DefaultResponse | LoginResponseType>(environment.api + "refresh", {
        refreshToken: tokens.refreshToken
      });
    }
    throw throwError(()=> 'Can not use Token');
  }
}
