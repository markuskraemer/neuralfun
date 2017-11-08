import { ControlsViewComponent } from './components/controls-view/controls-view.component';
import { ConnectionViewComponent } from './components/connection-view/connection-view.component';
import { NeuronViewComponent } from './components/neuron-view/neuron-view.component';
import { NetworkViewComponent } from './components/network-view/network-view.component';
import { MainComponent } from './main.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NetworkViewComponent,
    NeuronViewComponent,
    ConnectionViewComponent,
    ControlsViewComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
