import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Colors } from '../colors.enum';
import { DragInfoService } from '../drag-info.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent implements OnInit {
  @Input() fillColor: string;
  @Output() notifyDropOnBin: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('bin') binElem: ElementRef;
  isHovered = false;
  binWidth = 100;
  dragInfoSubscription: Subscription;
  draggedBombColor: string;

  constructor(private dragInfoService: DragInfoService) {
    this.dragInfoSubscription = this.dragInfoService.dragStartDataSubject.subscribe((bombColor) => this.draggedBombColor = bombColor);
  }

  ngOnInit() {
  }

  @HostListener('window:dragover', ['$event'])
  cancelHover(e: MouseEvent): void {
    if ((<any>e.target).tagName && (<any>e.target).tagName.toLowerCase() !== 'rect') {
      this.isHovered = false;
    }
  }

  allowDrop(e: Event) {
    e.preventDefault();
    if (this.fillColor === this.draggedBombColor) {
      this.isHovered = true;
    }
  }

  handleDrop(e: Event) {
    this.isHovered = false;
    this.notifyDropOnBin.emit(this.fillColor);
  }

  ngOnDestroy(): void {
    this.dragInfoSubscription.unsubscribe();
  }
}
