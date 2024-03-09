import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable, forkJoin } from 'rxjs';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AddFriendService {

  constructor(private _firestore: AngularFirestore, private _auth:AngularFireAuth) { }

  getMyCode(): Observable<string | null>{
    
    return new Observable(observer => {
      this._auth.currentUser.then(
        (user) => {
          if(user) {
            this._firestore.collection("users").doc(user.uid).get()
            .subscribe((docSnapShot) => {
              if (docSnapShot) {
                const userData:any = docSnapShot.data();
                console.log(userData);
                const uniqueCode = userData.uniqueCode || null;
                observer.next(uniqueCode);
                observer.complete();
              }
              else {
                observer.next(null);
                observer.complete();
              }
            }, error => {
              observer.error(error);
            });
          } else {
            observer.next(null);
            observer.complete();
          }
        }
      ).catch(err => {
        observer.error(err);
      })

    })
  }

  addFriend(friendCode: string, groupId: string): Observable<boolean> {
    console.log(friendCode, groupId);
    return new Observable<boolean>(observer => {
      this._firestore.collection("users", ref => ref.where("uniqueCode", "==", friendCode))
        .get()
        .subscribe((userSnapShot) => {
          if (!userSnapShot.empty) {
            const friendDoc = userSnapShot.docs[0];
            const friendData = friendDoc.data() as any;
            const friendId = friendDoc.id;
            const friendName = friendData.name;
  
            const groupRef = this._firestore.collection("groups").doc(groupId);
            groupRef.get().subscribe((groupDoc) => {
              if (groupDoc.exists) {
                const groupData = groupDoc.data() as any;
                const participants: any[] = groupData.participants || [];
                if (participants.find(participant => participant.id === friendId)) {
                  observer.error('Member is already present in the team');
                } else {
                  participants.push({ id: friendId, name: friendName });
                  groupRef.update({ participants: participants }).then(() => {
                    // Update the solvedStatus of each question in the group
                    const questionIds: string[] = groupData.questionIds || [];
                    const updateObservables: Observable<void>[] = [];
  
                    questionIds.forEach((questionId: string) => {
                      const questionRef = this._firestore.collection("questions").doc(questionId);
                      updateObservables.push(this.updateFriendStatusInQuestion(questionRef, friendId));
                    });
                    
                   
                    forkJoin(updateObservables).subscribe({
                      next: () => {
                        observer.next(true);
                        observer.complete();
                      },
                      error: (error) => {
                        observer.error(error);
                      },
                      complete: () => {
                        observer.next(true);
                        observer.complete();
                      }

                    });
                    // Wait for all updates to complete
                  }).catch(error => {
                    observer.error(error);
                  });
                }
              } else {
                observer.error(`Group with ID ${groupId} not found`);
              }
            }, error => {
              observer.error(error);
            });
          } else {
            observer.error(`User with code ${friendCode} not found`);
          }
        }, error => {
          observer.error(error);
        });
    });
  }
  
  updateFriendStatusInQuestion(questionRef: any, friendId: string): Observable<void> {
    return new Observable<void>(observer => {
      questionRef.get().subscribe((questionDoc:any) => {
        const questionData = questionDoc.data();
        const solvedStatus = questionData.solvedStatus || [];
        solvedStatus.push({ pid: friendId, status: false }); // Add the friend with a status of false
        questionRef.update({ solvedStatus: solvedStatus }).then(() => {
          observer.next();
          observer.complete();
        }).catch((error:any) => {
          observer.error(error);
        });
      }, (error:any) => {
        observer.error(error);
      });
    });
  }

  
}
