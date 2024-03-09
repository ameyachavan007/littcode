import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthDialogComponent } from '../auth-dialog/auth-dialog.component';
import { AuthServiceService } from '../auth-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.less'
})

export class NavbarComponent implements OnInit {
  title = "Littcode";
  isSignedIn:boolean = false;

  constructor (private _dialog: MatDialog, private _authService: AuthServiceService, private _router: Router) {
    this._authService.user$.subscribe(user => {
      this.isSignedIn = !!user;
    })
  }

  ngOnInit(): void {
    
  }

  openSignInDialog() {
    this._dialog.open(AuthDialogComponent, {
      width: '400px',
      // height: '300px',
      autoFocus: true,
      disableClose: false
    })
  }

  signOut(): void {
    this._authService.signOut().then(()=>{
      this._router.navigate(["/"]);
    }).catch(error => {
      console.log('Error signing out: ', error);
    })
  }

}
