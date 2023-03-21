import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MultiDragDropComponent } from './multi-drag-drop/multi-drag-drop.component';
import { MultiDragDropPairComponent } from './multi-drag-drop-pair/multi-drag-drop-pair.component';

@NgModule({
  declarations: [
    AppComponent,
    MultiDragDropComponent,
    MultiDragDropPairComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    DragDropModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
