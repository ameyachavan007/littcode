import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from './guards/auth-guard.guard';
import { ProblemsComponent } from './problems/problems.component';
import { PracticeComponent } from './practice/practice.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {path: '', redirectTo: '/practice', pathMatch: 'full'},
  {path: 'practice', component:PracticeComponent, canActivate:[AuthGuard]},
  {path: 'problems', component: ProblemsComponent, canActivate:[AuthGuard]},
  {path: 'admin', component: AdminComponent, canActivate: [AuthGuard]},
  {path: '**', component: NotFoundComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
