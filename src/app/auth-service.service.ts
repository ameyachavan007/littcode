import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { Observable, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  user$:Observable<firebase.User|null>;

  constructor(private _auth: AngularFireAuth, private _firestore: AngularFirestore) {
    this.user$ = this._auth.authState.pipe(
      switchMap(user => {
        if (user) {
          return of(user);
        } else {
          return of(null);
        }
      })
    );
  }


  signInWithGoogle(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this._auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((result) => {
          console.log("Signed In!!");
          const user = result.user;
          const uniqueCode = this.generateUniqueCode();
          this._firestore.collection("users").doc(user?.uid).set({
            name: user?.displayName,
            email: user?.email,
            uniqueCode: uniqueCode
          })
          .then(() => {
            console.log("User data stored successfully!");
          })
          .catch(error => {
            console.error("Error storing user data:", error);
          })
          resolve();
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    });
  }

  signOut() {
    return this._auth.signOut();
  }

  generateUniqueCode(): string {
    // Generate a random alphanumeric code
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 8;
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  }
}
