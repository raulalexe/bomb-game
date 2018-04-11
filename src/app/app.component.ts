import { Component, ViewChild, ElementRef, ViewContainerRef, ComponentRef, ComponentFactoryResolver, ComponentFactory, ViewChildren, HostListener } from '@angular/core';
import { Colors } from './colors.enum';
import { BombComponent } from './bomb/bomb.component';
import { BinComponent } from './bin/bin.component';
import { DragInfoService } from './drag-info.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  bombDragSubscription: Subscription;
  bombExplodeSubscription: Subscription;
  bombMinTime = 5;
  bombMaxTime = 10;
  occupiedCoords: Array<Coords> = new Array<Coords>();
  bombCreateIntervalDefault = 5000;
  bombCreateInterval = this.bombCreateIntervalDefault;
  @ViewChild('bombContainer', {read: ViewContainerRef}) container: ViewContainerRef;
  @ViewChild('bombContainer') containerElem: ElementRef;
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

  constructor(private resolver: ComponentFactoryResolver, private dragInfoService: DragInfoService) { }

  handleDragStart(e: BombComponent): void {
    this.draggedBomb = e;
    this.dragInfoService.emitDragStartData(this.draggedBomb.color);
  }

  handleBombExplode(e: BombComponent): void {
    this.score -= 1;
    this.bombsOnScreen -= 1;
    this.deleteOccupiedCoords(e);
  }

  handleDrop(binColor: string): void {
    this.bombsOnScreen -= 1;
    this.deleteOccupiedCoords(this.draggedBomb);
    if (this.draggedBomb.color === binColor) {
       this.score += 1;
       this.draggedBomb.isVisible = false;
       this.draggedBomb.stopBombTimer();
    }
    else {
      this.score -= 1;
    }
    if (this.bombsCount === this.maxBombs && this.bombsOnScreen === 0) {
      this.endGame(false);
    }
  }

  onTimerReset(e: any): void {
    this.colors = this.randomize(this.colors);
  }

  startGame(): void {
    this.resetGameData();
    // Create a bomb so we don't wait for the interval to run to create the first bomb
    // Use setTimeout so that the items will be in view when the bomb is created due to the button click making the appear
    setTimeout(() => this.createBomb(), 500);
    this.createBombInterval();
  }

  private randomize(arr: Array<any>): Array<any> {
    return arr.sort(() => 0.5 - Math.random());
  }

  private getRandomInRange(min, max): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  private deleteOccupiedCoords(bomb: BombComponent): void {
    const itemCoords = this.occupiedCoords.find(c => c.x === +bomb.left.replace('px', '') && c.y === +bomb.top.replace('px', ''));
    this.occupiedCoords.splice(this.occupiedCoords.indexOf(itemCoords), 1);
  }

  private increaseBombFrequencyByPerc(): void {
    // At first increase by one second so that it won't be too slow
    this.bombCreateInterval -= this.bombCreateInterval >= 2000 ? this.bombCreateIntervalDefault * .2 : this.bombCreateIntervalDefault * 0.1;
    clearInterval(this.bombInterval);
    this.createBombInterval();
  }

  private createBombInterval(): void {
    this.bombInterval = setInterval(() => {
      if (this.bombsCount === this.maxBombs) {
        this.endGame();
      }
      // Every time we put 10 percent of the bombs we want to decrease the time by 10% of the default (start) time
      else if (this.bombCreateInterval > 500 && this.bombsCount % (this.maxBombs * .05) === 0 && this.bombsCount > 1) {
        this.increaseBombFrequencyByPerc();
        this.createBomb();
      }
      else {
        this.createBomb();
      }
    }, this.bombCreateInterval);
  }

  private resetGameData(): void {
    this.gameStarted = true;
    this.gameOver = false; // set to false in case of game restart
    this.bombsCount = 0;
    this.bombsOnScreen = 0;
    this.score = 0;
    this.occupiedCoords = [];
  }

  private endGame(waitForLastBomb = true): void {
    clearInterval(this.bombInterval);
    if (waitForLastBomb){
      // Before ending the game wait for the last bomb to explode
      setTimeout(() => this.gameOver = true, this.bombTime * 1000);
    }
    else {
      this.gameOver = true;
    }
  }

  private getBombCoordinates(min: number, max: number, key: string): number {
    const randCoord = this.getRandomInRange(min, max);
    // Make sure that coord is outside the area of the container of another bomb and that there is a bit of space between
    if (!this.occupiedCoords.some(c => (c.x - 100 < randCoord && randCoord < c.x) || (c.x + 100 > randCoord && c.x < randCoord))) {
      return randCoord;
    }
    return this.getBombCoordinates(min, max, key);
  }

  private createBomb(): void {
    // Get the size of the container element for bombs to calculate radom positions based on the width height and starting X and Y
    const { x, y, width, height} = this.containerElem.nativeElement.getBoundingClientRect();
    const left = this.getBombCoordinates(x, width, 'x');
    const top = this.getBombCoordinates(y, height, 'y');
    const factory: ComponentFactory<BombComponent> = this.resolver.resolveComponentFactory(BombComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.color = this.colors[this.getRandomInRange(0, this.colors.length - 1)];
    this.componentRef.instance.time = this.getRandomInRange(this.bombMinTime, this.bombMaxTime);
    this.componentRef.instance.left = left + 'px';
    this.componentRef.instance.top = top + 'px';
    this.bombDragSubscription = this.componentRef.instance.notifyBombDrag.subscribe(e => this.handleDragStart(e));
    this.bombExplodeSubscription = this.componentRef.instance.explodeBomb.subscribe(e => this.handleBombExplode(e));
    this.occupiedCoords.push(new Coords(left, top));
    this.bombsCount++;
    this.bombsOnScreen++;
  }

  ngOnDestroy(): void {
    this.componentRef.destroy();
    this.bombDragSubscription.unsubscribe();
    this.bombExplodeSubscription.unsubscribe();
  }
}

class Coords {
  x: number;
  y: number;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
