import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlanningComponent } from './planning/planning.component';
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'planning', component: PlanningComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'login' }
];
