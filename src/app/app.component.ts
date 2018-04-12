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
  private bombContainerSize = 80;
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
    // Start increase by 20% so that it won't be too slow then by 10%
    this.bombCreateInterval -= this.bombCreateInterval >= 2000 ? this.bombCreateIntervalDefault * .2 : this.bombCreateIntervalDefault * 0.1;
    clearInterval(this.bombInterval);
    this.createBombInterval();
  }

  private createBombInterval(): void {
    this.bombInterval = setInterval(() => {
      if (this.bombsCount === this.maxBombs) {
        this.endGame();
      }
      // Every time we put 5%
      else if (this.shouldIncreaseSpeed()) {
        this.increaseBombFrequencyByPerc();
        this.createBomb();
      }
      else {
        this.createBomb();
      }
    }, this.bombCreateInterval);
  }

  private shouldIncreaseSpeed(): boolean {
    if (this.bombCreateInterval <= 500 || this.bombsCount <= 1) {
       return false;
    }
    // Increase after 2.5% of the bombs have been placed util we are below half the initial speed
    if (this.bombCreateInterval * 2 > this.bombCreateIntervalDefault && this.bombsCount % (this.maxBombs * .025) === 0) {
      return true;
    }
    if (this.bombCreateInterval > 1000 && this.bombsCount % (this.maxBombs * .1) === 0 ) {
      return true;
    }
    return this.bombCreateInterval <= 1000 && this.bombsCount % (this.maxBombs * .4) === 0;
  }

  private resetGameData(): void {
    this.gameStarted = true;
    this.gameOver = false; // set to false in case of game restart
    this.bombsCount = 0;
    this.bombsOnScreen = 0;
    this.score = 0;
    this.bombCreateInterval = this.bombCreateIntervalDefault;
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

  private getBombCoordinates(minX: number, maxX: number, minY: number, maxY: number): Coords {
    const randX = this.getRandomInRange(minX, maxX);
    const randY = this.getRandomInRange(minY, maxY);
    // Make sure that coords is outside the area of the container of another bomb
    if (!this.occupiedCoords.some(c =>
      ((c.x - this.bombContainerSize < randX && randX < c.x) || (c.x + this.bombContainerSize > randX && c.x < randX)) ||
      ((c.y - this.bombContainerSize < randY && randY < c.y) || (c.y + this.bombContainerSize > randY && c.y < randY))
    )) {
      return new Coords(randX, randY);
    }
    // Recursive call to get different coordinates
    return this.getBombCoordinates(minX, maxX, minY, maxY);
  }

  private createBomb(): void {
    // Get the size of the container element for bombs to calculate radom positions based on the width height and starting X and Y
    const { x, y, width, height} = this.containerElem.nativeElement.getBoundingClientRect();
    // Make sure that bombs don't overflow the width and heigh of the container by calculating width, height - the bomb size
    const coords = this.getBombCoordinates(x, width - this.bombContainerSize, y, height - this.bombContainerSize);
    const factory: ComponentFactory<BombComponent> = this.resolver.resolveComponentFactory(BombComponent);
    this.componentRef = this.container.createComponent(factory);
    this.componentRef.instance.color = this.colors[this.getRandomInRange(0, this.colors.length - 1)];
    this.componentRef.instance.time = this.getRandomInRange(this.bombMinTime, this.bombMaxTime);
    this.componentRef.instance.left = coords.x + 'px';
    this.componentRef.instance.top = coords.y + 'px';
    this.bombDragSubscription = this.componentRef.instance.notifyBombDrag.subscribe(e => this.handleDragStart(e));
    this.bombExplodeSubscription = this.componentRef.instance.explodeBomb.subscribe(e => this.handleBombExplode(e));
    this.occupiedCoords.push(new Coords(coords.x, coords.y));
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
