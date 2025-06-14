import { Routes } from '@angular/router';
import {LayoutComponent} from './shared/layout/layout.component';
import {authGuard} from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: '', loadComponent: () => import('./views/main/main.component').then(c => c.MainComponent)
      },
      {
        path: 'login', loadComponent: () => import('./views/user/login/login.component').then(c => c.LoginComponent), canActivate: [authGuard]
      },
      {
        path: 'signup', loadComponent: () => import('./views/user/signup/signup.component').then(c => c.SignupComponent), canActivate: [authGuard]
      },
      {
        path: 'articles', loadComponent: () => import('./views/blogs/blogs.component').then(c => c.BlogsComponent)
      },
      {
        path: 'article/:url', loadComponent: () => import('./views/blog/blog.component').then(c => c.BlogComponent)
      },
      {
        path: 'policy', loadComponent: () => import('./views/policy/policy.component').then(c => c.PolicyComponent)
      },
    ]
  }
];
