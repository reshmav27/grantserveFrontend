import { Routes } from '@angular/router';
import { Login } from './features/Auth/login.component/login.component';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', 
      loadComponent: () => import('./features/home-layout/home-layout').then(m => m.HomeLayout)}
    
];
