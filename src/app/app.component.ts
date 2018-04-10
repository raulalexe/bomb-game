import { Component, ViewChild, ElementRef } from '@angular/core';
import { Colors } from './colors.enum';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  score = 0;
  bombsCount = 0;
  context: CanvasRenderingContext2D;

  colors = ['red', 'green', 'blue'];
  private draggedBombColor: Colors;
  private countdown;
  private rects: Array<Object>;

  handleDragStart(e: Colors){
    this.draggedBombColor = e;
  }

  handleBombExplode(e: any): void {
    this.score -= 1;
  }

  handleDrop(e: Colors): void {
    console.log(Colors[e], this.draggedBombColor);

    if (this.draggedBombColor === e){
       this.score += 1;
    }
    else {
      this.score -= 1;
    }
  }

  randomize(arr: Array<any>): Array<any> {
    return arr.sort(() => 0.5 - Math.random());
  }

  onTimerReset(e: any): void {
    this.colors = this.randomize(this.colors);
  }
}
