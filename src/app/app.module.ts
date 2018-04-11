import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { BombComponent } from './bomb/bomb.component';
import { BinComponent } from './bin/bin.component';
import { DragInfoService } from './drag-info.service';

@NgModule({
  declarations: [
    AppComponent,
    TimerComponent,
    BombComponent,
    BinComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
  ],
  providers: [DragInfoService],
  entryComponents: [BombComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
