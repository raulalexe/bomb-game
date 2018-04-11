import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class DragInfoService {

  dragStartDataSubject: Subject<string> = new Subject();

  constructor() { }

  emitDragStartData(data: string): void{
    this.dragStartDataSubject.next(data);
  }

}
