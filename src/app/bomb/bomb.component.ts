import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Colors } from '../colors.enum';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-bomb',
  templateUrl: './bomb.component.html',
  styleUrls: ['./bomb.component.scss']
})
export class BombComponent implements OnInit {
  radius = 40;
  timerRadius = 15;
  svgSize = this.radius * 2 + this.radius / 2;
  isVisible = true;
  @Input() color: string;
  @Input() time: number;
  @Input() left: string;
  @Input() top: string;
  notifyBombDrag: Subject<BombComponent> = new Subject();
  explodeBomb: Subject<any> = new Subject();
  timerCx: number;
  timerCy: number;
  timerTextCx: string;
  timerTextCy: string;
  bombInterval: any;

  constructor() {
  }

  ngOnInit() {
    this.timerCx = this.radius + this.radius / 1.5;
    this.timerCy = this.radius / 2;
    this.timerTextCx = this.timerCx + '%';
    this.timerTextCy = this.timerCy + '%';
    this.startBombTimer();
  }

  onDragBomb(e: DragEvent): void {
    this.notifyBombDrag.next(this);
  }

  onTimerEnd(): void {
    this.isVisible = false;
    this.stopBombTimer();
    this.explodeBomb.next();
  }

  startBombTimer(): void {
    this.bombInterval = setInterval(() => {
      this.time = this.time - 1;
      if(this.time === 0){
        this.onTimerEnd();
      }
    }, 1000);
  }

  stopBombTimer(): void{
    clearInterval(this.bombInterval);
  }
}
