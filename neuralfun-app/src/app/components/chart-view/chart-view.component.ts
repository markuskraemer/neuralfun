import { Component, Input } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class CartViewComponent {

  private chart: Chart;

  private setUpChart(): void {
      var config: Chart.ChartConfiguration = {};
      var options: Chart.ChartOptions = {};
      options.title = { display: true, text: "Outputs of Neurons and Weights of Connections" };
      options.animation = { duration: 0 };

      options.scales = {
          xAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Times' } }],
          yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Output or Weight' } }],

      }
      config.type = 'line';
      config.options = options;
      this.chart = new Chart('chart-canvas', config);

  }


}
