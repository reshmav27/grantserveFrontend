import { Routes } from '@angular/router';
import { Login } from './features/Auth/component/login.component/login.component';
import { authGuard } from './core/guards/auth-guard';
import { ProgramComponent } from './features/program/program.component/program.component';
import { ProgramFormComponent } from './features/program/program-form.component/program-form.component';
import { AddBudgetComponent } from './features/program/add-budget.component/add-budget.component';
import { ReviewerDashboard } from './features/review/reviewer-dashboard/reviewer-dashboard.component';
import { ProgramListComponent } from './features/Applications/program-list.component/program-list.component';
import { ViewProgramComponent } from './features/program/view-program.component/view-program.component';
import { ResearcherDashboardComponent } from './features/researcher/researcher-dashboard/researcher-dashboard.component';

export const routes: Routes = [
    {
        path: '',
        component: Login
    },
    {
        path: 'home',
        canActivate: [authGuard],
        loadComponent: () => import('./features/home-layout/home-layout').then(m => m.HomeLayout)
    },
    {
        path: 'home/programs',
        canActivate: [authGuard],
        component: ProgramListComponent
    },
    {
        path: 'home/profile',
        canActivate: [authGuard],
        component: ResearcherDashboardComponent
    },
    {
        path: 'profile',
        canActivate: [authGuard],
        loadComponent: () => import('./features/user-profile/user-profile.component/user-profile.component').then(m => m.UserProfileComponent)
    },
    {
        path: 'register',
        loadComponent: () => import('./features/Auth/component/register.comoponent/register.comoponent').then(m => m.RegisterComoponent)
    },
    {
        path: 'applications',
        loadComponent: () => import('./features/Applications/applications.component/applications.component').then(m => m.ApplicationsComponent)
    },
    {
        path: 'proposals/:id',
        loadComponent: () => import('./features/Applications/proposal.component/proposal.component').then(m => m.ProposalComponent)
    },
    {
        path: 'programs',
        component: ProgramComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'programs/:id',
        component: ViewProgramComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN', 'RESEARCHER'] }
    },
    {
        path: 'program/new',
        component: ProgramFormComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'program/edit/:id',
        component: ProgramFormComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'programs/create',
        component: ProgramFormComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'programs/edit/:id',
        component: ProgramFormComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'add-budget',
        component: AddBudgetComponent,
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    },
    {
        path: 'reviewer-dashboard',
        component: ReviewerDashboard,
        canActivate: [authGuard],
        data: { roles: ['REVIEWER'] }
    },
    {
        path: 'disbursements',
        loadComponent: () => import('./features/disbursement/disbursement.component/disbursement.component')
            .then(m => m.DisbursementComponent),
        canActivate: [authGuard]
    },
    {
        path: 'manager/disbursements',
        loadComponent: () => import('./features/disbursement/manager-disbursement.component/manager-disbursement.component')
            .then(m => m.ManagerDisbursementComponent),
        canActivate: [authGuard],
        data: { roles: ['MANAGER', 'ADMIN'] }
    }

];
