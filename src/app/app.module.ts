import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment.prod';
import { FormsModule } from '@angular/forms';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuthModule} from '@angular/fire/compat/auth';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { NavbarComponent } from './navbar/navbar.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthDialogComponent } from './auth-dialog/auth-dialog.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';
import {MatDividerModule} from '@angular/material/divider';
import {MatCardModule} from '@angular/material/card';
import {MatChipsModule} from '@angular/material/chips';
import {MatCheckboxModule} from '@angular/material/checkbox';
import { AuthServiceService } from './auth-service.service';
import { ProblemOfTheDayComponent } from './problem-of-the-day/problem-of-the-day.component';
import { DateFormatPipe } from './date-format.pipe';
import { DailyProblemService } from './daily-problem.service';
import { ProblemsComponent } from './problems/problems.component';
import { AuthGuard } from './guards/auth-guard.guard';
import { PracticeComponent } from './practice/practice.component';
import { CreateGroupService } from './create-group.service';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatIconModule} from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip'; 
import {MatDatepickerModule} from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';
import { AddQuestionDialogComponent } from './add-question-dialog/add-question-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from './edit-dialog/edit-dialog.component';
import { AdminComponent } from './admin/admin.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HomrComponent } from './homr/homr.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AuthDialogComponent,
    ProblemOfTheDayComponent,
    DateFormatPipe,
    ProblemsComponent,
    PracticeComponent,
    AddFriendDialogComponent,
    AddQuestionDialogComponent,
    ConfirmDialogComponent,
    EditDialogComponent,
    AdminComponent,
    NotFoundComponent,
    HomrComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatCardModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatDatepickerModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule 
  ],
  providers: [
    provideAnimationsAsync(),
    AuthServiceService,
    DailyProblemService,
    CreateGroupService,
    DateFormatPipe,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
