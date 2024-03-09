import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';;
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  dialogRef: MatDialogRef<AuthDialogComponent> | null = null;
  constructor(private authService: AuthServiceService, private router: Router, private _dialog:MatDialog) { }

  canActivate(): Observable<boolean> {
    return this.authService.user$.pipe(
      map(user => {
        if ( !user) {
          this.router.navigate(["/"]);
          this.dialogRef = this._dialog.open(AuthDialogComponent, {
            width: '400px',
            autoFocus: true,
            disableClose: false
          })
          return false;
        } else {
          
          return true;
        }
      })
    );
  }
}
