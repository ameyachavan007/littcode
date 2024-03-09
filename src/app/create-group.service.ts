import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class CreateGroupService {

  constructor(private _auth: AngularFireAuth, private _firestore: AngularFirestore) { }

  createGroup(groupName:string, defaultParticipant: firebase.User): Promise<void> {
    return new Promise<any>((resolve, reject) => {
      this._auth.currentUser.then(currentUser => {
        if (currentUser) {
          const groupData = {
            name: groupName,
            participants: [{id: defaultParticipant.uid, name: currentUser.displayName}]
          };

          this._firestore.collection('groups').add(groupData)
            .then((groupRef) => {
              this.createQuestionsSubcollection(groupRef);

              resolve(groupRef);
            })
            .catch(error => {
              reject(error);
            });
        } else {
          reject(new Error('User is not signed in.'));
        }
      });
    });
  }
  createQuestionsSubcollection(groupRef: DocumentReference<any>) {
    groupRef.collection('questions');
  }

  deleteGroup(group:any): Promise<boolean> {
    return new Promise<any>((resolve, reject) => {
     
      const currentQuestionIds = group.questionIds;

      console.log("cuQQ", currentQuestionIds);
      
      this._firestore.collection("groups").doc(group.id).delete()
      .then(() => {
        console.log("Group deleted successfully");

        // now delete the questions

        if(!currentQuestionIds) {
          console.log("Group deleted successfully, no questions to delete");
          resolve(true);
        }

        const batch = this._firestore.firestore.batch();
        currentQuestionIds.forEach((questionId:string) => {

          const questionRef = this._firestore.collection("questions").doc(questionId).ref;
          batch.delete(questionRef);
          
        });

        batch.commit() 
        .then(() => {
          console.log("Questions associated with the group deleted successfully");
          resolve(true);
        })
        .catch((error) => {
          console.error("Error deleting questions:", error);
          reject(false);
        })   
      })
      .catch((error) => {
        console.error("Error deleting group:", error);
        reject(false); 
      });
    })
  }

  public removeObjectsByIds(arr:any, ids:any) {
    return arr.filter((item:any) => !ids.includes(item.id));
  }

  editGroup (group:any): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const removedParticipants = group.participants.filter((participant: any) => !participant.selected);
      const questionIds = group.questionIds;
      const pidsToRemove = removedParticipants.map((participant: any) => participant.id);

      console.log(pidsToRemove, questionIds)

      group.participants = group.participants.filter((participant:any) => participant.selected);
      group.participants.forEach((participant:any) => {
        delete participant.selected;
      });


      this._firestore.collection("groups").doc(group.id).update({
        name: group.name,
        participants: group.participants,
        questionIds: group.questionIds
      })
      .then(() => {
        console.log("Group updated successfully");
        questionIds.forEach((questionId: string) => {
          this._firestore.collection("questions").doc(questionId).get()
          .subscribe((quesDoc:any) => {
            const quesData = quesDoc.data();
            const solvedStatusArray = quesData.solvedStatus || [];
            
            const updatedDatedStatusArray = this.removeObjectsByIds(solvedStatusArray, pidsToRemove);

            console.log("------updated solved status---------", updatedDatedStatusArray);
          })
      });

        resolve(true);
      })
      .catch((error) => {
        console.error("Error updating group:", error);
        reject(false);
      });

    })
  }
}