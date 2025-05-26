import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', loadComponent: () => import('./views/main/main.component').then(c => c.MainComponent)
      },
      {
        path: 'login', loadComponent: () => import('./views/user/login/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'signup', loadComponent: () => import('./views/user/signup/signup.component').then(c => c.SignupComponent)
      },
    ]
  }
];
