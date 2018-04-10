import { Component, ViewChild, ElementRef, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory } from '@angular/core';
import { Colors } from './colors.enum';
import { BombComponent } from './bomb/bomb.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  bombCreateInterval = 3000;
  @ViewChild('bombContainer', {read: ViewContainerRef}) container;
  bombTime = 10;
  score = 0;
  colors = ['red', 'green', 'blue'];
  gameOver = false;
  gameStarted = false;
  bombsCount = 0;
  bombsOnScreen = 0;
  maxBombs = 120;
  private bombInterval: any;
  private componentRef: ComponentRef<BombComponent>;
  private draggedBomb: BombComponent;
  private rects: Array<Object>;

  constructor(private resolver: ComponentFactoryResolver) { }

  handleDragStart(e: BombComponent): void {
    this.draggedBomb = e;
  }

  handleBombExplode(): void {
    this.score -= 1;
    this.bombsOnScreen -= 1;
  }

  handleDrop(e: string): void {
    this.bombsOnScreen -= 1;
    if (this.draggedBomb.color === e) {
       this.score += 1;
       this.draggedBomb.isVisible = false;
       this.draggedBomb.stopBombTimer();
    }
    else {
      this.score -= 1;
    }
    if(this.bombsCount === this.maxBombs && this.bombsOnScreen === 0) {
      this.endGame(false);
    }
  }

  randomize(arr: Array<any>): Array<any> {
    return arr.sort(() => 0.5 - Math.random());
  }

  onTimerReset(e: any): void {
    this.colors = this.randomize(this.colors);
  }

  getRandomInRange(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  startGame(): void {
    this.resetGameData();
    this.bombInterval = setInterval(() => {
      if (this.bombsCount === this.maxBombs) {
        this.endGame();
      }
      else {
        this.createBomb(this.bombTime);
      }
    }, this.bombCreateInterval);
  }

  private resetGameData(){
    this.gameStarted = true;
    this.gameOver = false; // set to false in case of game restart
    this.bombsCount = 0;
    this.bombsOnScreen = 0;
    this.score = 0;
  }

  private endGame(waitForLastBomb = true){
    clearInterval(this.bombInterval);
    if (waitForLastBomb){
      // Before ending the game wait for the last bomb to explode
      setTimeout(() => this.gameOver = true, this.bombTime * 1000);
    }
    else {
      this.gameOver = true;
    }
  }

  private createBomb(bombTime: number): void{
    const factory: ComponentFactory<BombComponent> = this.resolver.resolveComponentFactory(BombComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.color = this.colors[this.getRandomInRange(0, this.colors.length - 1)];
    this.componentRef.instance.time = this.getRandomInRange(5, 10);
    this.componentRef.instance.left = this.getRandomInRange(100, 800) + 'px';
    this.componentRef.instance.top = this.getRandomInRange(100, 500) + 'px';
    this.componentRef.instance.notifyBombDrag.subscribe(e => this.handleDragStart(e));
    this.componentRef.instance.explodeBomb.subscribe(e => this.handleBombExplode());
    this.bombsCount++;
    this.bombsOnScreen++;
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
  }
}
