import { Component, OnInit } from '@angular/core';
import { interval } from 'rxjs';
import { QuestionsService } from '../service/questions.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name:string ="";
  public questionlist :any =[];
  public currentquestion : number = 0;
  public points : number = 0;

  counter=60;
  
  correctAnswer : number =0;
  incorrectAnswer : number =0

  interval$:any=0;
  progress: any =0;

  isquizCompleted : boolean = false;

  constructor(private questionserv:QuestionsService) { }

  ngOnInit(): void
  {
    this.name = localStorage.getItem("name")!;
    this.getallQuestions();
    this.startcounter()
  }

  getallQuestions()
  {
      this.questionserv.getQuestionJSON()
      .subscribe(res=>{
        this.questionlist=res.questions;
      })
  }

  nextquestion()
  {
    this.currentquestion++;
  }

  previousquestion()
  {
    this.currentquestion--;
  }

  answers(currentQno:number , option:any)
  { 
    if(currentQno == this.questionlist.length)
    {
      this.isquizCompleted = true;
      this.stopcounter()
    }

    if(option.correct)
    {
      this.points+=10; // this.points =this.points +10 ;
      this.correctAnswer++
      
      setTimeout(() =>
      {
        this.currentquestion++  //go to next question
        this.resetcounter()
        this.getProgressPercent()
      }, 1000);
     
    }
    else
    {
      setTimeout(() => 
      {
        this.currentquestion++
        this.incorrectAnswer++
        this.resetcounter()
        this.getProgressPercent()
      }, 1000);

      this.points -=10;
    }

  }
  startcounter()
  {
    this.interval$ = interval(1000).subscribe(val=>{
      this.counter--;

      if(this.counter === 0)
      {
        this.currentquestion++
        this.counter=60;
        this.points-=10
      }
    });
    setTimeout(() => {
      this.interval$.unsubscribe()
    }, 6000000);
  }
  stopcounter()
  {
    this.interval$.unsubscribe();
    this.counter=0;
  }
  resetcounter()
  {
    this.stopcounter();
    this.counter=60
    this.startcounter()
  }

  resetquiz()
  {
   this.resetcounter();
   this.getallQuestions();
   this.points=0;
   this.counter=60;
   this.currentquestion=0;
   this.progress=0
  }

  getProgressPercent()
  {
    this.progress = ((this.currentquestion/this.questionlist.length) *100).toString()
    return this.progress
  }
}
