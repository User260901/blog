import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, finalize, Observable, switchMap, throwError} from 'rxjs';
import {Injectable} from '@angular/core';
import {LoginResponseType} from '../../../types/login-response.type';
import {Router} from '@angular/router';
import {DefaultResponse} from '../../../types/default-response.type';
import {AuthService} from '../../shared/services/auth.service';
import {LoaderService} from '../../shared/services/loader.service';



@Injectable()

export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService, private router: Router, private LoaderService: LoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokens = this.authService.getTokens()
    if(tokens && tokens.accessToken){
      const authRequest = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken),
      });
      if(!authRequest.url.includes('/comments')) {
        this.LoaderService.show()
      }
      return next.handle(authRequest)
        .pipe(
          catchError((error) => {
            if(error.status === 401 && !authRequest.url.includes('/login') && !authRequest.url.includes('/refresh')){
              return this.handle404Error(authRequest, next)
            }
            return throwError(()=> error);
          }),
          finalize(()=>{
            setTimeout(()=>{
              this.LoaderService.hide()
            }, 500)
          })
        )
    }
    return next.handle(req)
      .pipe(finalize(()=>{
        setTimeout(()=>{
          this.LoaderService.hide()
        }, 500)
      }));

  }
  handle404Error(req: HttpRequest<any>, next: HttpHandler){
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponse | LoginResponseType) => {
          let error = '';
          if((result as DefaultResponse).error !== undefined){
            error = (result as DefaultResponse).message;
          }

          const refreshResult = result as LoginResponseType;
          if(!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId){
            error = "Authorization Error"
          }

          if(error){
            return throwError(()=> new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authRequest = req.clone({
            headers: req.headers.set('x-access-token', refreshResult.accessToken),
          });

          return  next.handle(authRequest)
        }),
        catchError( (error) => {
          this.authService.removeTokens();
          this.router.navigate(['/login'])
          return throwError(()=> error);
        })

      )
  }
}
