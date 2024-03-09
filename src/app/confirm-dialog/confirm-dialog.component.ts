import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddQuestionService } from '../add-question.service';
import { CreateGroupService } from '../create-group.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.less'
})
export class ConfirmDialogComponent implements OnInit{

  public fromWhat:string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _addQuestionService: AddQuestionService,
    private _groupService: CreateGroupService,
    private dialogRef: MatDialogRef<ConfirmDialogComponent> ,
  ) {



  }

  ngOnInit(): void {
    this.fromWhat = this.data.from;
  }

  confirmDelete() {

    if (this.data.from === "question") {
      console.info("questions", this.data.question, this.data.group)
        
      this._addQuestionService.deleteQuestions(this.data.question, this.data.group)
      .then((success: boolean) => {
        if (success) {
          console.info("Questions deleted successfully.")
          this.dialogRef.close(true);
        } else {
          console.log('Failed to delete questions.');
        }
      })
      .catch(error => {
        console.error('Error deleting questions:', error);
      });
    }

    else if (this.data.from === "group") {
      this._groupService.deleteGroup(this.data.group)
      .then((success: boolean) => {
        if (success) {
          console.info("Questions deleted successfully.")
          this.dialogRef.close(true);
        } else {
          console.log('Failed to delete questions.');
        }
      })
      .catch(error => {
        console.error('Error deleting questions:', error);
      });

    }

  }

}
