import { Component, OnInit } from '@angular/core';
import { LeetCodeProblem } from '../interfaces/problem-card';
import { DailyProblemService } from '../daily-problem.service';

@Component({
  selector: 'app-problem-of-the-day',
  templateUrl: './problem-of-the-day.component.html',
  styleUrls: ['./problem-of-the-day.component.less']
})
export class ProblemOfTheDayComponent implements OnInit {
  problemsOfTheDay: LeetCodeProblem[] = [];

  difficultyClasses: { [key: string]: string } = {
    Easy: 'problem-cards-easy',
    Medium: 'problem-cards-medium',
    Hard: 'problem-cards-hard',
  };

  constructor(private _dailyProblemsService: DailyProblemService){}

  ngOnInit(): void {
    this.fetchDailyProblems();
  }

  fetchDailyProblems() {
    this._dailyProblemsService.getDailyProblems().subscribe(data => {
      this.problemsOfTheDay = data.sort((a, b) => {
        const difficultyOrder = ['Easy', 'Medium', 'Hard'];
        return difficultyOrder.indexOf(a.difficulty) - difficultyOrder.indexOf(b.difficulty);
      });
    });
  }

  openProblemInLeetCode(linkToLeetCode: string) {
    window.open(linkToLeetCode, '_blank');
  }
}
