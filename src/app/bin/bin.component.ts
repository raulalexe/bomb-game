import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { Colors } from '../colors.enum';

@Component({
  selector: 'app-bin',
  templateUrl: './bin.component.html',
  styleUrls: ['./bin.component.scss']
})
export class BinComponent implements OnInit {
  @Input() fillColor: Colors;
  @Output() notifyDropOnBin: EventEmitter<Colors> = new EventEmitter<Colors>();
   isHovered: boolean;
   binWidth = 100;

  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:mouseup', ['$event'])
  releaseDraggedElement(e: Event) {
    this.isHovered = false;
  }

  allowDrop = (e: Event) => {
    e.preventDefault();
    this.isHovered = true;
  }

  handleDrop(e) {
    this.notifyDropOnBin.emit(this.fillColor);
  }
}