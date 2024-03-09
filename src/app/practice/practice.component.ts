import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Subscription } from 'rxjs';
import { CreateGroupService } from '../create-group.service';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from '../add-friend-dialog/add-friend-dialog.component';
import { IGroup, IQuestions } from '../interfaces/questions';
import { AddQuestionDialogComponent } from '../add-question-dialog/add-question-dialog.component';
import { firstValueFrom } from 'rxjs';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';

@Component({
  selector: 'app-practice',
  templateUrl: './practice.component.html',
  styleUrls: ['./practice.component.less']
})
export class PracticeComponent implements OnInit, OnDestroy {

  groups: IGroup[] = [];
  currentQuestions: IQuestions[] = [];
  public groupName = "";
  currentGroup: any = {};
  private subscriptions: Subscription[] = [];

  constructor(
    private _firestore: AngularFirestore, 
    private _auth: AngularFireAuth, 
    private _createGroupService: CreateGroupService, 
    public _dialog: MatDialog,
    private _router: Router
  ){}

  ngOnInit(): void {
    
    this.loadGroups();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  getDifficultyCellStyle(difficulty: string) {
    let style = {};
    switch (difficulty.toLowerCase()) {
      case 'easy':
        style = { 'color': 'green' };
        break;
      case 'medium':
        style = { 'color': 'yellow' };
        break;
      case 'hard':
        style = { 'color': 'red' };
        break;
      default:
        style = {};
        break;
    }
    return style;
  }

  loadGroups(): void {
    this._auth.currentUser.then(user => {
      if (user) {
        this.subscriptions.push(
          this._firestore.collection('groups', ref => ref.where("participants", 'array-contains', {id: user.uid, name: user.displayName}))
          .snapshotChanges()
          .subscribe((groups: any[]) => {
            this.groups = groups.map(group => {
              const data = group.payload.doc.data();
              const id = group.payload.doc.id;
              return { id, ...data };
            });
          })
        );
      } else {
        console.error('User is not authenticated.');
      }
    })
    .catch(error => {
      console.error('Error getting current user:', error);
    });
  }

  selectCurrentGroup(group: any) {
    this.currentGroup = group as IGroup;
    this.loadGroups();
    this.loadQuestions(group);
  }

  loadQuestions(group: any): void {
    
    const groupDoc = this._firestore.collection("groups").doc(group.id);
    
    // Clear previous subscriptions
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];

    const questionsCollection = this._firestore.collection('questions');

    // Subscribe to changes in the group document
    this.subscriptions.push(
        groupDoc.valueChanges().subscribe((groupData: any) => {
          if(!groupData) {
            this.currentGroup = {}
            this.currentQuestions = [];
            return;
          }
            const questionIds = groupData.questionIds || [];
            
            // Fetch details of questions
            const promises = questionIds.map((questionId: string) => {
                const questionDoc = questionsCollection.doc(questionId);
                return firstValueFrom(questionDoc.get());
            });

            Promise.all(promises)
                .then(questionSnapshots => {
                    const questions: any[] = [];
                    const uniqueQuestionsSet = new Set();

                    questionSnapshots.forEach(question => {
                        const questionData = question.data();
                        const questionId = question.id;
                        if (!uniqueQuestionsSet.has(questionData)) {
                            questions.push({id: questionId, ...questionData});
                            uniqueQuestionsSet.add(questionData);
                        }
                    });
                    this.currentQuestions = questions;
                })
                .catch(error => {
                    console.error("Error fetching questions:", error);
                });
        })
    );
}

openAddFriendDialog(group: any){
  const dialogRef = this._dialog.open(AddFriendDialogComponent, {
    width: '400px',
    data: {group: group}
  });
  
    dialogRef.afterClosed().subscribe(async ()=>{ 
     await this._firestore.collection("groups").doc(group.id).get().subscribe({
        next: (snapshot) => {
          const groupData:any = snapshot.data();
          const id = snapshot.id;
          const currentGroup = { id, ...groupData };
          this.currentGroup = currentGroup;
        },
        error(err) {
          console.error("Group does not exist:", group.id);
        },
        complete() {
          console.info("add friend dialog closed")
        },
      });
      
    });
}

  addNewTeam(): void {
    const currentUser = this._auth.currentUser;
    
    if (currentUser !== null) {
      currentUser.then(user => {
        if (user && this.groupName != "") {
          this._createGroupService.createGroup(this.groupName, user)
            .then((groupRef: any) => {
              // Additional operations if needed
              this.groupName = "";
            })
            .catch(error => {
              console.error('Error creating group:', error);
              this.groupName = "";
            });
        } else {
          console.error('Current user is null.');
          this.groupName = "";
        }
      });
    } else {
      console.error('User is not signed in.');
      this.groupName = "";
    }
  }
  
  

  addNewQuestion(): void {
    const dialogRef = this._dialog.open(AddQuestionDialogComponent, {
      width: '400px',
      data: {group: this.currentGroup}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadGroups();
        this.loadQuestions(this.currentGroup);
      }
    });
  }

  onCheckboxClicked(question: any, participantId: string) {
    const index = question.solvedStatus.findIndex((status: any) => status.pid === participantId);

    if (index !== -1) {
      question.solvedStatus[index].status = !question.solvedStatus[index].status;

      this._firestore.collection("questions").doc(question.id).update({
          solvedStatus: question.solvedStatus
      }).then(() => {
          console.log("Solved status updated successfully.");
      }).catch((error) => {
          console.error("Error updating solved status:", error);
      });
    } else {
        console.error("Participant's solved status not found.");
    }
  }

  deleteQuestion(question:any) {
    
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {question: question, group: this.currentGroup, from: "question"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.loadQuestions(this.currentGroup);
      }
    });
    
  }

  deleteGroup(group:any) {
    const dialogRef = this._dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {group: group, from: "group"}
    });

    dialogRef.afterClosed().subscribe(result => {
      
      console.info("group dialog closed");
      if (result) {
        // this._router.navigate(['/practice']);
      } 
    });
    
  }

  editGroup(group:any){
    this._firestore.collection("groups").doc(group.id).get().subscribe({
      next: (snapshot) => {
        const groupData:any = snapshot.data();
        const id = snapshot.id;
        const currentGroup = { id, ...groupData };
        this.currentGroup = currentGroup;
        const dialogRef = this._dialog.open(EditDialogComponent, {
          width: '400px',
          data: {group: this.currentGroup, from:"group"}
        });
      },
      error(err) {
        console.error("Group does not exist:", group.id);
      },
      complete() {
        console.info("add friend dialog closed")
      },
    });
  }

  editQuestion(question:any) {
    const dialogRef = this._dialog.open(EditDialogComponent, {
      width: '400px',
      data: {group: this.currentGroup, question: question, from:"question"}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadQuestions(this.currentGroup);
      }
    });


  }

  isCurrentGroupEmpty(): boolean {
    return Object.keys(this.currentGroup).length === 0;
  }
}
