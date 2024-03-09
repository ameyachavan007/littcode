import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddQuestionService } from '../add-question.service';
import { CreateGroupService } from '../create-group.service';

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.less'
})
export class EditDialogComponent implements OnInit {


  public fromWhat:string = "";
  public question:any = {};
  public group:any = {};

  constructor(
    public dialogRef: MatDialogRef<EditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _questionService: AddQuestionService,
    private _groupService: CreateGroupService,
  ){}

  ngOnInit(): void {
    this.fromWhat = this.data.from;
    if(this.data.from === "question"){
      this.question = { ...this.data.question }
      this.group = { ...this.data.group }
    } 
    if(this.data.from === "group") {
      this.group = { ...this.data.group}
      this.group.participants.forEach((participant:any) => {
        participant.selected = true;
      });
    }
  }

  saveEdit(){
    if (this.data.from === "question") {
      this._questionService.editQuestion(this.question)
      .then((success: boolean) => {
        if (success) {
          console.info("Question edited successfully.")
          this.dialogRef.close(true);
        } else {
          console.log('Failed to edit question.');
        }
      })
      .catch(error => {
        console.error('Error editing question:', error);
      });
    }

    if (this.data.from == "group") {
      this._groupService.editGroup(this.group)
      .then((success: boolean) => {
        if (success) {
          console.info("Group edited successfully.")
          this.dialogRef.close(true);
        } else {
          console.log('Failed to edit group.');
        }
      })
      .catch(error => {
        console.error('Error editing group:', error);
      });
      
    }
  }

  selectDifficulty(difficulty: string): void {
    // Update the difficulty of the edited question
    this.question.difficulty = difficulty;

  }

  getDifficultyCellStyle(difficulty: string) {
    console.log(difficulty);
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

}
