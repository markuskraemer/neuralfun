import { MainService } from './../../main.service';

import { ColorService } from './../colors.service';
import { NetworkHistory } from './../../network/NetworkHistory';
import { Network } from './../../network/Network';
import { Chart } from 'chart.js';
import { Component, Input, OnInit, OnChanges, ViewChild, Directive, ViewContainerRef } from '@angular/core';

class LineVisibilities {
    public neurons: boolean[] = [];
    public neuronTargets: boolean[] = [];
    public neuronDeltas: boolean[] = [];
    public squaredErrors:boolean = false;
}

@Component({
    selector: 'chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit, OnChanges {

    private chart: Chart;
    private lineTension: number = 0;
    private lineVisibility: LineVisibilities;
    private _steps:number[] = [];
    private _type:string = 'line';
    private _needsNewChart:boolean;

    @ViewChild('myCanvas', {read:ViewContainerRef}) chartCanvas:ViewContainerRef; 

    @Input ('history')
    public history:NetworkHistory;

    @Input ('type')
    public set type (value:string) {
        console.log("set type: " + value);

        if(this._type != value){
            this._type = value;
            this._needsNewChart = true;
        }
    }

    @Input ('steps') 
    private set steps (value:number[]){
        this._steps = value;
        console.log("set steps: " + this.steps.length);
        //this.draw ();
    }

    private get steps ():number[]{
        return this._steps;
    }

    @Input('update')
    public set update(value: boolean) {
        console.log("CV update: " + value);
        if (value) {
            this.draw();
        }
    }
    
    constructor(
        private colorService: ColorService,
        private mainService: MainService
    ) {
    }

    public ngOnInit(): void {
        this.lineVisibility = new LineVisibilities ();    

        this.mainService.networkChangeSubject.subscribe((network: Network) => {

            if (network != null)
                this.updateOnNetworkChange();

        })
        
    }

    public ngOnChanges ():void {
        console.log("-- onChanges -- _needsNewChart: " + this._needsNewChart);
        if(this._needsNewChart){
            this.setUpChart ();
        }
        this.draw ();
        this._needsNewChart = false;
    }

    private updateOnNetworkChange(): void {
        this.lineVisibility = new LineVisibilities ();    
        this.setUpChart();
        this.draw ();
    }

    private setUpChart(): void {
        var config: Chart.ChartConfiguration = {};
        var options: Chart.ChartOptions = {};

        options.title = {
            display: true,
            text: "Outputs of Neurons and Weights of Connections"
        };
        options.animation = { duration: 0 };
        options.legend = {

        }
        options.scales = {
            xAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Times' } }],
            yAxes: [{ display: true, scaleLabel: { display: true, labelString: 'Output or Weight' } }],

        }

        config.type = this._type;
        config.options = options;

        if(this.chart)
            this.chart.destroy ();

        this.chart = new Chart(<any>this.chartCanvas.element.nativeElement, config);

    }

  

    private getNeuronOutputs(steps: number[], hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.history.getNeuronIds(true);
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neurons[i],
                lineTension: this.lineTension,
                label: 'Neuron ' + neuronIds[i],
                fill: false,
                stack:'stackId_' + i,
                backgroundColor: this.colorService.getNeuronOutputColor(i),
                borderColor: this.colorService.getNeuronOutputColor(i),
                data: this.history.getNeuronOutputAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private getNeuronTargets(steps: number[], hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.history.getNeuronIds(true);
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neuronTargets[i],
                lineTension: this.lineTension,
                label: 'T Neuron ' + neuronIds[i],
                stack:'stackId_' + i,
                fill: false,
                backgroundColor: this.colorService.getNeuronTargetColor(i),
                borderColor: this.colorService.getNeuronTargetColor(i),
                data: this.history.getNeuronTargetAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private getNeuronDeltas(steps: number[], hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.history.getNeuronIds();
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neuronDeltas[i],
                lineTension: this.lineTension,
                label: 'Δ Neuron ' + neuronIds[i],
                stack:'stackId_' + i,
                fill: false,
                backgroundColor: this.colorService.getDeltaColor(i),
                borderColor: this.colorService.getDeltaColor(i),
                data: this.history.getNeuronDeltaAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }



    private getSquaredErrors (steps: number[]): any {
     
        var result: any[] = [];
        if(this.lineVisibility == undefined || this.lineVisibility.squaredErrors == undefined || !steps || this.steps.length < 1){
            console.log("ACTUNG");
        }
        return {
                hidden: this.lineVisibility.squaredErrors,
                lineTension: this.lineTension,
                label: 'Squared Errors',
                fill: false,
                backgroundColor: this.colorService.getSquaredErrorsColor(),
                borderColor: this.colorService.getSquaredErrorsColor(),
                data: this.history.getSquaredErrorsHistory(steps)
            };
    
    }

    private getPropperValue (a:boolean, b:boolean):boolean {
        return (a === true || a === false) ? a : b;
    }


    private updateLineVisibilities(): void {

        let neuronCount: number = this.history.getNeuronIds().length;

        for (let i: number = 0; i < neuronCount && i < this.chart.data.datasets.length; ++i) {

            this.lineVisibility.neurons[i]       = this.getPropperValue(this.chart['getDatasetMeta'](i).hidden, this.lineVisibility.neurons[i]);
            this.lineVisibility.neuronTargets[i] = this.getPropperValue(this.chart['getDatasetMeta'](i + neuronCount).hidden, this.lineVisibility.neuronTargets[i]);
            this.lineVisibility.neuronDeltas[i]  = this.getPropperValue(this.chart['getDatasetMeta'](i + neuronCount*2).hidden, this.lineVisibility.neuronDeltas[i]);
            this.lineVisibility.squaredErrors    = this.getPropperValue(this.chart['getDatasetMeta'](i + neuronCount*2+1).hidden, this.lineVisibility.squaredErrors);
        }

    }


    private draw(): void {
        if (!this.chart || !this.steps || this.steps.length < 1 || !this.history)
            return;

        this.updateLineVisibilities();

        var datasets: any[] = [];
        datasets = datasets.concat(this.getNeuronOutputs(this.steps, true));
        datasets = datasets.concat(this.getNeuronTargets(this.steps, true));
        datasets = datasets.concat(this.getNeuronDeltas(this.steps, true));
        datasets = datasets.concat(this.getSquaredErrors(this.steps));

        this.chart.data = {
            labels: this.steps.map((value: number, index: number, array: number[]) => { return String(value) }),
            datasets: datasets

        };
        this.chart.update();
    }

}
