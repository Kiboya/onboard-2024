// src/app/app.routes.ts

// Angular Router
import { Routes } from '@angular/router';
// Components
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { PlanningComponent } from './planning/planning.component';
// Guards
import { LoginGuard } from './guards/login.guard';
import { AuthGuard } from './guards/auth.guard';
import { GroupPlanningComponent } from './planning/group-planning/group-planning.component';
import { RoomPlanningComponent } from './planning/room-planning/room-planning.component';

/**
 * Application Routes
 * @type {Routes}
 * @description Define the routes of the application.
 */
export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'login', component: LoginComponent, canActivate: [LoginGuard] },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'planning', component: PlanningComponent, canActivate: [AuthGuard] },
    { path: 'group-planning', component: GroupPlanningComponent, canActivate: [AuthGuard] },
    { path: 'room-planning', component: RoomPlanningComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: 'home' }
];
