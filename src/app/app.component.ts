import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.less'
})
export class AppComponent {
  title = 'littcode';

  constructor(private _auth: AngularFireAuth){}

  async signInWithGoogle () {
    // throw new Error ("method not implemented");
    const credential = await this._auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
    const user = credential.user;
    console.log(user);
  }
}
