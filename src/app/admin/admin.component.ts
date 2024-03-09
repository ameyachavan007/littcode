import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.less'
})
export class AdminComponent {
  problemForm!: FormGroup;

  constructor(private fb: FormBuilder){
    this.createForm();
  }

  createForm() {
    this.problemForm = this.fb.group({
      id: ['', Validators.required],
      title: ['', Validators.required],
      difficulty: ['', Validators.required],
      description: ['', Validators.required],
      tags: [''],
      dateAdded: [new Date()]
    });
  }

  onSubmit() {
    console.log(this.problemForm.value);
  }


}
