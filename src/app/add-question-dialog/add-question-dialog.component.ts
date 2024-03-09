import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AddQuestionService } from '../add-question.service';

@Component({
  selector: 'app-add-question-dialog',
  templateUrl: './add-question-dialog.component.html',
  styleUrls: ['./add-question-dialog.component.less'] // Corrected 'styleUrl' to 'styleUrls'
})
export class AddQuestionDialogComponent {
  public title: string = "";
  public currDifficulty: string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _addQuestionService: AddQuestionService,
    private dialogRef: MatDialogRef<AddQuestionDialogComponent> 
  ) {}

  addQuestion() {
    
    this._addQuestionService.addQuestionToGroup(this.data.group, this.title, this.currDifficulty)
      .then((success: boolean) => {
        if (success) {
          console.log('Questions added successfully.');
          this.dialogRef.close(true);
          // Optionally, you can close the dialog or perform other actions here.
        } else {
          console.log('Failed to add questions.');
          // Handle failure, if needed.
        }
      })
      .catch(error => {
        console.error('Error adding questions:', error);
        // Handle error if necessary
      });
  }

  selectDifficulty(difficulty: string): void {
    this.currDifficulty = difficulty;
  }
}
