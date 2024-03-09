import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; 
import { AuthGuard } from './guards/auth-guard.guard';
import { ProblemsComponent } from './problems/problems.component';
import { PracticeComponent } from './practice/practice.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomrComponent } from './homr/homr.component';

const routes: Routes = [
  {path: '', component:HomrComponent},
  {path: 'practice', component:PracticeComponent,
  //  canActivate:[AuthGuard] uncomment to activate authentication
  },
  {path: 'problems', component: ProblemsComponent, 
  // canActivate:[AuthGuard] uncomment to activate authentication
  },
  {path: 'admin', component: AdminComponent, 
  // canActivate: [AuthGuard] uncomment to activate authentication
  },
  {path: '**', component: NotFoundComponent} 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
