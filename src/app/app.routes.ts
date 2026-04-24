import { Routes } from '@angular/router';
import { Login } from './features/Auth/component/login.component/login.component';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Login },
    { path: 'home', 
      canActivate: [authGuard],
      loadComponent: () => import('./features/home-layout/home-layout').then(m => m.HomeLayout)},
    {
        path : 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user-profile/user-profile.component/user-profile.component').then(m => m.UserProfileComponent)
    },
    {
        path : 'register',
        loadComponent: () => import('./features/Auth/component/register.comoponent/register.comoponent').then(m => m.RegisterComoponent)
    },
    {
        path : 'applications',
        loadComponent : () => import('./features/Applications/applications.component/applications.component').then(m => m.ApplicationsComponent)
    },
    {
        path : 'proposals/:id',
        loadComponent : () => import('./features/Applications/proposal.component/proposal.component').then(m => m.ProposalComponent)
    }
    
];
