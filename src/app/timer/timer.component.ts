import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {
  @Output() timerReset: EventEmitter<any> = new EventEmitter<any>();
  @Input() bombsCount: number;
  private changeTimeDefault = 15;
  private countdown: any;
  changeTimeLeft = this.changeTimeDefault;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.startTimer();
  }

  startTimer(){
    this.countdown = setInterval(() => {
      this.changeTimeLeft = this.changeTimeLeft - 1;
      if (this.bombsCount === 120) {
        clearInterval(this.countdown);
        return;
      }
      if (this.changeTimeLeft === 0){
        this.timerReset.emit();
        this.changeTimeLeft = this.changeTimeDefault;
      }
    }, 1000);
  }
}
