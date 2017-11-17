import { ChartComponent } from './components/pattern-chart-view/chart.component';
import { PatternChartViewComponent } from './components/pattern-chart-view/pattern-chart-view.component';
import { MainService } from './main.service';
import { ColorService } from './components/colors.service';
import { NetworkChartViewComponent } from './components/network-chart-view/network-chart-view.component';
import { ConnectionViewComponent } from './components/connection-view/connection-view.component';
import { NeuronViewComponent } from './components/neuron-view/neuron-view.component';
import { NetworkViewComponent } from './components/network-view/network-view.component';
import { MainComponent } from './main.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    NetworkViewComponent,
    NeuronViewComponent,
    ConnectionViewComponent,
    NetworkChartViewComponent,
    PatternChartViewComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [MainService, ColorService],
  bootstrap: [AppComponent]
})
export class AppModule { }
