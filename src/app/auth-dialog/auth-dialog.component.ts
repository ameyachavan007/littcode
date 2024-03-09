import { Component } from '@angular/core';
import { AuthServiceService } from '../auth-service.service';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth-dialog',
  templateUrl: './auth-dialog.component.html',
  styleUrl: './auth-dialog.component.less'
})
export class AuthDialogComponent {
  constructor(
    private _auth: AuthServiceService,
    private _dialogRef:MatDialogRef<AuthDialogComponent>,
    private _router: Router
  ){}

  signInWithGoogle() {
    this._auth.signInWithGoogle().then(() => {
      this._dialogRef.close();
      this._router.navigate(['/problems']);
    }).catch(error => {
      console.error('Error signing in with Google: ', error);
    })
  }

  signInWithGithub() {
    throw new Error ("method not implemented");
  }
}
