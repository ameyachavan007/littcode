import { Component, Inject, OnInit } from '@angular/core';
import { AddFriendService } from '../add-friend.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Clipboard } from '@angular/cdk/clipboard';

@Component({
  selector: 'app-add-friend-dialog',
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.less'
})
export class AddFriendDialogComponent implements OnInit{

  public id:string = "";
  public friendCode:string = "";

  constructor(
    @Inject(MAT_DIALOG_DATA) public data:any,
    private _addFriendService: AddFriendService,
    private _dialogRef: MatDialogRef<AddFriendDialogComponent>,
    private _snackBar: MatSnackBar,
    private _clipboard: Clipboard
  ) {

  }
  ngOnInit(): void {
    this.id = this.data.group.id;
  }

  copyMyCode() {
    this._addFriendService.getMyCode().subscribe(
      uniqueCode => {
        if (uniqueCode) {
          this._clipboard.copy(uniqueCode);
        }
        else {
          console.error('Failed to retrieve unique code');
        }
      }, error => {
        console.error('Error retrieving unique code:', error);
      }
    )
  }

  addFriendToMyTeam() {
    this._addFriendService.addFriend(this.friendCode, this.id).subscribe({
      next: (data) => {
        this._snackBar.open('Friend added successfully!!', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
      this._dialogRef.close();
      },
      error: (e) => {
        this._snackBar.open(e, 'Close', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom'
        });
        this.friendCode = "";
      },
      complete: () => console.info('complete') 
    })
    }
    
  }
  
