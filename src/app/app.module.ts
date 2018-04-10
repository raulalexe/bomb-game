import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { TimerComponent } from './timer/timer.component';
import { BombComponent } from './bomb/bomb.component';
import { BinComponent } from './bin/bin.component';

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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
