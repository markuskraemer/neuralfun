import { InputViewComponent } from './components/input-view/input-view.component';
import { ChartOptionsService } from './components/pattern-chart-view/chart-options.service';
import { ChartComponent } from './components/chart/chart.component';
import { PatternChartViewComponent } from './components/pattern-chart-view/pattern-chart-view.component';
import { MainService } from './main.service';
import { ColorService } from './components/colors.service';
import { NetworkChartViewComponent } from './components/network-chart-view/network-chart-view.component';
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
    NetworkChartViewComponent,
    PatternChartViewComponent,
    ChartComponent,
    InputViewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
      MainService, 
      ColorService,
      ChartOptionsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
