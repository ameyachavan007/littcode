import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DateFormatPipe } from './date-format.pipe';
import { LeetCodeProblem } from './interfaces/problem-card';

@Injectable({
  providedIn: 'root'
})
export class DailyProblemService {

  constructor(
    private _firestore: AngularFirestore,
    private _datePipe: DateFormatPipe,
  ) {}

  getDailyProblems(): Observable<LeetCodeProblem[]> {
    const currentDate = new Date();
    const formatedDate = this._datePipe.transform(currentDate);
    return this._firestore.collection("problems-of-the-day")
      .snapshotChanges()
      .pipe(
        map(actions => {
          return actions.map(a => {
            const data = a.payload.doc.data() as LeetCodeProblem;
            return { ...data, id: a.payload.doc.id};
          });
        })
      );
  }
}
