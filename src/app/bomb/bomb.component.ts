import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Colors } from '../colors.enum';

@Component({
  selector: 'app-bomb',
  templateUrl: './bomb.component.html',
  styleUrls: ['./bomb.component.scss']
})
export class BombComponent implements OnInit {
  @Input() cx: number;
  @Input() cy: number;
  @Input() color: Colors;
  @Input() time: number;
  @Output() notifyBombDrag: EventEmitter<Colors> = new EventEmitter<Colors>();
  @Output() explodeBomb: EventEmitter<number> = new EventEmitter<number>();
   radius = 40;
   timerRadius = 15;
   timerCx: number;
   timerCy: number;
   timerTextCx: string;
   timerTextCy: string;
   isVisible = true;

  constructor() {
  }

  ngOnInit() {
    this.timerCx = this.cx + this.cx / 2;
    this.timerCy = this.cy / 2;
    this.timerTextCx = this.timerCx + '%';
    this.timerTextCy = this.timerCy + '%';
    this.startBombTimer();
    console.log(this.cx, this.cy, this.timerCx, this.timerCy,this.timerTextCx, this.timerTextCy);
  }

  onDragBomb(e: DragEvent){
    this.notifyBombDrag.emit(this.color);
  }

  onTimerEnd(){
    this.isVisible = false;
    this.explodeBomb.emit();
  }

  startBombTimer(){
    setInterval(() => {
      this.time = this.time - 1;
      if(this.time === 0){
        this.onTimerEnd();
      }
    }, 1000);
  }
}
