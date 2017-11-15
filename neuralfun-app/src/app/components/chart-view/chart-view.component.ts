import { MainService } from './../../main.service';

import { ColorService } from './../colors.service';
import { NetworkHistory } from './../../network/NetworkHistory';
import { Chart } from 'chart.js';
import { Component, Input, OnInit } from '@angular/core';

class LineVisibilities {
  public neurons:boolean[] = [];
  public neuronSquaredDeltas:boolean[] = [];
  public dump:boolean[] = [];
}



@Component({
  selector: 'chart-view',
  templateUrl: './chart-view.component.html',
  styleUrls: ['./chart-view.component.css']
})
export class CartViewComponent implements OnInit {

  @Input('history') private history:NetworkHistory;
  @Input('update') 
  public set update (value:boolean) {
      console.log("CV update");
      if(value){
        this.draw ();
      }
  }

  private chart: Chart;
  private showLastLessonOnly:boolean = false;
  private lineTension:number = 0;
  private lineVisibility:LineVisibilities = new LineVisibilities ();

  constructor (
    private colorService:ColorService,
    private mainService:MainService
  ){}


  public ngOnInit ():void {
    this.setUpChart ();
  }


  private setUpChart(): void {
      var config: Chart.ChartConfiguration = {};
      var options: Chart.ChartOptions = {};
  
      options.title = { display: true, 
                        text: "Outputs of Neurons and Weights of Connections"
                      };
      options.animation = { duration: 0 };
      options.legend = {
       
      }
      options.scales = {
          xAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Times' } }],
          yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Output or Weight' } }],

      }
    
      config.type = 'line';
      config.options = options;


      this.chart = new Chart('chart-canvas', config);


  }

    private includeStep(n: number): boolean
    {
        const lessonLength: number = this.mainService.lesson.patterns.length;
        const mod: number = Math.floor(lessonLength * this.history.length / 100);
        if ((n % mod >= 0) && (n % mod < lessonLength))
            return true;

        return false;
    }

    private createSteps(start: number, len: number, doFilter:boolean): number[]
    {
        var result: number[] = [];
        for (let i: number = start; i < start + len; i ++)
        {
            if (!doFilter)
                result.push(i);
            else if(this.includeStep(i))
                result.push(i);

        }
        return result;
    }

 private getNeuronOutputs(steps: number[], hideInputNeurons:boolean, hidden:boolean):any[]
    {
        var result: any[] = [];
        const neuronIds: string[] = this.history.getNeuronIds(hideInputNeurons);
        for (var i: number = 0; i < neuronIds.length; ++i)
        {
            result.push({
                hidden:this.lineVisibility.neurons[i],
                lineTension:this.lineTension,
                label: 'Neuron ' + neuronIds[i],
                fill: false,
                backgroundColor: this.colorService.getOutputNeuronColor(i),
                borderColor: this.colorService.getOutputNeuronColor(i),
                data: this.history.getNeuronOutputAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }


    private getNeuronSquaredDeltas(steps: number[], hidden:boolean): any[]
    {
        var result: any[] = [];
        const neuronIds: string[] = this.history.getNeuronIds();
        for (var i: number = 0; i < neuronIds.length; ++i)
        {
            result.push({
                hidden:this.lineVisibility.neuronSquaredDeltas[i],
                lineTension: this.lineTension,
                label: 'Δ^2 Neuron ' + neuronIds[i],
                fill: false,
                backgroundColor: this.colorService.getSquaredDeltaColor(i),
                borderColor: this.colorService.getSquaredDeltaColor(i),
                data: this.history.getNeuronSquaredDeltaAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private updateLineVisibilities ():void {

      let neuronCount:number = this.history.getNeuronIds().length;

      for(let i:number = 0; i < neuronCount && i < this.chart.data.datasets.length; ++i) {
          let neuronsDatasetMetaHidden:boolean = this.chart['getDatasetMeta'](i).hidden;
          this.lineVisibility.neurons[i] = (neuronsDatasetMetaHidden === true || neuronsDatasetMetaHidden === false) ? neuronsDatasetMetaHidden : this.lineVisibility.neurons[i];  
          
          let squaredDeltasdatasetMetaHidden:boolean = this.chart['getDatasetMeta'](i + neuronCount).hidden;
          this.lineVisibility.neuronSquaredDeltas[i] = (squaredDeltasdatasetMetaHidden === true || squaredDeltasdatasetMetaHidden === false) ? squaredDeltasdatasetMetaHidden : this.lineVisibility.neuronSquaredDeltas[i];            
      }

    }


    private draw ():void {
      if(!this.chart)
        return;

          this.updateLineVisibilities ();

          var hideInput: boolean;
          var steps: number[];
          steps = this.createSteps(0, this.history.length, true);
          console.log("steps: " + steps.length);
          var datasets: any[] = [];
          datasets = datasets.concat(this.getNeuronOutputs(steps, hideInput, true));
          //console.log("draw: ", datasets[datasets.length-1]);
          datasets = datasets.concat(this.getNeuronSquaredDeltas(steps, true));

         this.chart.data = {
              labels: steps.map((value: number, index: number, array: number[]) => { return String(value) }),
              datasets: datasets

          };
          this.chart.update();
    }

/*
    private render ():void {
          var steps: number[];
          var datasets: any[] = [];
          var hideInput: boolean;

          if (this.showLastLessonOnly)
          {
              hideInput = false;
              steps = this.createSteps(this.history.length - this.myProps.lessonLength - 1,
                                      this.myProps.lessonLength, false);
          } else
          {
              hideInput = true;
              steps = this.createSteps(0, this.history.length, true);
              // if (!this.myProps.isTraining)
                  // datasets = datasets.concat(this.getConnectionCharts(steps, true));
          }
          console.log("steps: " + steps);
          if (!this.myProps.isTraining)
          {
              datasets = datasets.concat(this.getNeuronOutputs(steps, hideInput, true));
              datasets = datasets.concat(this.getNeuronSquaredDeltas(steps, true));
          }
          datasets.push(this.getSquaredErrors(steps));
        
          this.chart.data = {
              labels: steps.map((value: number, index: number, array: number[]) => { return String(value) }),
              datasets: datasets

          };
          this.chart.update();
    }
*/
}
