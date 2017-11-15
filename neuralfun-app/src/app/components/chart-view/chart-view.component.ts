import { MainService } from './../../main.service';

import { ColorService } from './../colors.service';
import { NetworkHistory } from './../../network/NetworkHistory';
import { Network } from './../../network/Network';
import { Chart } from 'chart.js';
import { Component, Input, OnInit } from '@angular/core';

class LineVisibilities {
    public neurons: boolean[] = [];
    public neuronTargets: boolean[] = [];
    public neuronDeltas: boolean[] = [];
}

@Component({
    selector: 'chart-view',
    templateUrl: './chart-view.component.html',
    styleUrls: ['./chart-view.component.css']
})
export class CartViewComponent implements OnInit {

    @Input('update')
    public set update(value: boolean) {
        console.log("CV update");
        if (value) {
            this.draw();
        }
    }

    private chart: Chart;
    private showLastLessonOnly: boolean = false;
    private lineTension: number = 0;
    private lineVisibility: LineVisibilities = new LineVisibilities();

    private filters: any[] = [
        { name: "all" },
        { name: "last only" }
    ]

    private _selectedFilterIndex: number = 0;

    constructor(
        private colorService: ColorService,
        private mainService: MainService
    ) {
    }

    public ngOnInit(): void {
        this.mainService.networkChangeSubject.subscribe((network: Network) => {

            if (network != null)
                this.updateNetwork();

        })
    }

    private get selectedFilterIndex(): number {
        return this._selectedFilterIndex;
    }

    private set selectedFilterIndex(value: number) {
        if (this._selectedFilterIndex != value) {
            this._selectedFilterIndex = Number(value);
            this.draw();
        }
    }

    private updateNetwork(): void {
        if (this.chart)
            this.chart.destroy();

        this.setUpChart();
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

        config.type = 'line';
        config.options = options;


        this.chart = new Chart('chart-canvas', config);


    }

    private includeStep(n: number): boolean {

        const historyLength:number = this.mainService.network.history.length;
        const lessonLength: number = this.mainService.lesson.patterns.length;

        if(n >= this.mainService.network.history.length - lessonLength)
            return true;

        const mod: number = Math.ceil(lessonLength * historyLength / 100);
        if ((n % mod >= 0) && (n % mod < lessonLength))
            return true;

        return false;
    }

    private createSteps(start: number, len: number, doFilter: boolean): number[] {
        var result: number[] = [];
        for (let i: number = start; i < start + len; i++) {
            if (!doFilter)
                result.push(i);
            else if (this.includeStep(i))
                result.push(i);

        }
        return result;
    }

    private getNeuronOutputs(steps: number[], hideInputNeurons: boolean, hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.mainService.network.history.getNeuronIds(hideInputNeurons);
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neurons[i],
                lineTension: this.lineTension,
                label: 'Neuron ' + neuronIds[i],
                fill: false,
                backgroundColor: this.colorService.getNeuronOutputColor(i),
                borderColor: this.colorService.getNeuronOutputColor(i),
                data: this.mainService.network.history.getNeuronOutputAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private getNeuronTargets(steps: number[], hideInputNeurons: boolean, hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.mainService.network.history.getNeuronIds(hideInputNeurons);
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neuronTargets[i],
                lineTension: this.lineTension,
                label: 'T Neuron ' + neuronIds[i],
                fill: false,
                backgroundColor: this.colorService.getNeuronTargetColor(i),
                borderColor: this.colorService.getNeuronTargetColor(i),
                data: this.mainService.network.history.getNeuronTargetAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private getNeuronDeltas(steps: number[], hidden: boolean): any[] {
        var result: any[] = [];
        const neuronIds: string[] = this.mainService.network.history.getNeuronIds();
        for (var i: number = 0; i < neuronIds.length; ++i) {
            result.push({
                hidden: this.lineVisibility.neuronDeltas[i],
                lineTension: this.lineTension,
                label: 'Δ Neuron ' + neuronIds[i],
                fill: false,
                backgroundColor: this.colorService.getDeltaColor(i),
                borderColor: this.colorService.getDeltaColor(i),
                data: this.mainService.network.history.getNeuronDeltaAtIndicies(neuronIds[i], steps)
            });
        }
        return result;
    }

    private getPropperValue (a:boolean, b:boolean):boolean {
        return (a === true || a === false) ? a : b;
    }


    private updateLineVisibilities(): void {

        let neuronCount: number = this.mainService.network.history.getNeuronIds().length;

        for (let i: number = 0; i < neuronCount && i < this.chart.data.datasets.length; ++i) {

            this.lineVisibility.neurons[i]          = this.getPropperValue(this.chart['getDatasetMeta'](i).hidden, this.lineVisibility.neurons[i]);
            this.lineVisibility.neuronTargets[i]    = this.getPropperValue(this.chart['getDatasetMeta'](i + neuronCount).hidden, this.lineVisibility.neuronTargets[i]);
            this.lineVisibility.neuronDeltas[i]     = this.getPropperValue(this.chart['getDatasetMeta'](i + neuronCount*2).hidden, this.lineVisibility.neuronDeltas[i]);
        }

    }


    private draw(): void {
        if (!this.chart)
            return;

        this.updateLineVisibilities();

        var hideInput: boolean;
        var steps: number[];
        switch(this._selectedFilterIndex){
            case 0:
                    steps = this.createSteps(0, this.mainService.network.history.length, true);
                    break;

            case 1:
                    const lessonLength: number = this.mainService.lesson.patterns.length;
                    steps = this.createSteps(this.mainService.network.history.length-lessonLength, lessonLength, false);
                    break;
                    
            default:
                    console.error("_selectedFilterIndex not recordnized: ", this._selectedFilterIndex);
        }
        console.log("steps: " + steps.length);
        var datasets: any[] = [];
        datasets = datasets.concat(this.getNeuronOutputs(steps, hideInput, true));
        datasets = datasets.concat(this.getNeuronTargets(steps, hideInput, true));
        datasets = datasets.concat(this.getNeuronDeltas(steps, true));

        this.chart.data = {
            labels: steps.map((value: number, index: number, array: number[]) => { return String(value) }),
            datasets: datasets

        };
        this.chart.update();
    }

}
