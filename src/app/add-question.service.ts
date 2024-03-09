import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IGroup, IQuestions } from './interfaces/questions';
import { ISolvedStatus } from './interfaces/questions';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AddQuestionService {

  constructor(private _auth: AngularFireAuth, private _firestore: AngularFirestore) { }

  getQuestionsByGroup(group: any): Promise<IQuestions[]> {
    console.log("called")
    return new Promise((resolve, reject) => {
      if (!group || !group.id) {
        reject('Invalid group data');
      } else {
        this._firestore.collection('groups').doc(group.id).get()
          .subscribe((groupDoc: any) => {
            console.log("-----------------------",groupDoc)
            const groupData = groupDoc.data();
            console.log("===============", groupData);
            const questionIds = groupData.questionIds || [];
            const questions: IQuestions[] = [];

            questionIds.forEach((questionId: string) => {
              this._firestore.collection('questions').doc(questionId).get()
                .subscribe((questionDoc: any) => {
                  const questionData = questionDoc.data();
                  if (questionData) {
                    questions.push(questionData);
                  }
                  // Resolve the promise when all questions are fetched
                  if (questions.length === questionIds.length) {
                    resolve(questions);
                  }
                }, error => {
                  reject('Error fetching question: ' + error);
                });
            });

            if (questionIds.length === 0) {
              resolve(questions); // If there are no questions, resolve immediately
            }
          }, error => {
            reject('Error fetching group: ' + error);
          });
      }
    });
  }

  addQuestionToGroup(group: any, title: string, difficulty: string): Promise<boolean> {
    console.log(group, title, difficulty);
    return new Promise((resolve, reject) => {
      const solvedStatus: ISolvedStatus[] = [];

      group.participants.forEach((element: any) => {
        solvedStatus.push({ pid: element.id, status: false })
      });

      const questionData: IQuestions = {
        title: title,
        difficulty: difficulty,
        solvedStatus: solvedStatus
      };

      this._firestore.collection("questions")
        .add(questionData)
        .then((questionRef) => {
          let questionId = questionRef.id;
          this._firestore.collection("groups").doc(group.id).update({
            questionIds: firebase.firestore.FieldValue.arrayUnion(questionId)
          }).then(() => {
            console.log("Question added to group successfully");

            this._firestore.collection("groups").doc(group.id).snapshotChanges()
              .subscribe((groupSS: any) => {
                const groupData = groupSS.payload.data();
                const questionIds = groupData.questionIds || [];
                const questions: any[] = [];
                const uniqueQuestionsSet = new Set();

                questionIds.forEach((questionId: string) => {
                  this._firestore.collection('questions').doc(questionId).snapshotChanges()
                    .subscribe((question: any) => {
                      const questionData = question.payload.data();
                      if (!uniqueQuestionsSet.has(questionData)) {
                        questions.push(questionData);
                        uniqueQuestionsSet.add(questionData);
                      }
                      // Check if all questions have been added
                      if (questions.length === questionIds.length) {
                        resolve(true); // Resolve the promise when all questions have been added
                      }
                    });
                });
              });
          });
        })
        .catch(error => {
          reject(error); // Reject the promise if there's an error
        });
    });
  }

  deleteQuestions(question: any, group: any): Promise<boolean> {
    return new Promise<any>((resolve, reject) => {
        // Fetch the group document using the groupId
        const groupId = group.id;
        this._firestore.collection("groups").doc(groupId).get()
        .subscribe((groupSnapshot: any) => {
            if (groupSnapshot.exists) {
                const group = groupSnapshot.data();

                // Ensure that group.questionIds is an array before filtering
                if (Array.isArray(group.questionIds)) {
                    const updatedQuestionIds = group.questionIds.filter((id: string) => id !== question.id);

                    // Update the group document with the updated questionIds array
                    this._firestore.collection("groups").doc(groupId).update({
                        questionIds: updatedQuestionIds
                    })
                    .then(() => {
                        console.info(`Question ID removed from group: ${groupId}`);

                        // Delete the question document from the 'questions' collection
                        this._firestore.collection("questions").doc(question.id).delete()
                        .then(() => {
                            console.info("Question deleted successfully");
                            resolve(true); // Resolve the promise indicating successful deletion
                        })
                        .catch((error: any) => {
                            console.error("Error deleting question", error);
                            reject(false); // Reject the promise if there's an error deleting the question
                        });
                    })
                    .catch((error: any) => {
                        console.error(`Error removing question ID from group: ${groupId}`, error);
                        reject(false); // Reject the promise if there's an error updating the group document
                    });
                } else {
                    console.error(`group.questionIds is not an array.`);
                    reject(false); // Reject the promise if group.questionIds is not an array
                }
            } else {
                console.error(`Group with ID ${groupId} does not exist.`);
                reject(false); // Reject the promise if the group does not exist
            }
        }, (error: any) => {
          console.error(`Error fetching group with ID ${groupId}`, error);
          reject(false); // Reject the promise if there's an error fetching the group document
      })
        
    });
}


  editQuestion(question:any):Promise<boolean>{
    console.log(question)
    return new Promise<any>((resolve, reject) => {
      // Update the question details in the Firestore database
      this._firestore.collection("questions").doc(question.id).update({
        title: question.title,
        difficulty: question.difficulty,
        // Update other fields if needed
    })
    .then(() => {
        console.info("Question edited successfully");

        // If the question details have been updated successfully, resolve the promise
        resolve(true);
    })
    .catch((error: any) => {
        console.error("Error editing question", error);
        reject(false); // Reject the promise if there's an error
    });
    })
  }
}
