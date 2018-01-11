import { ChartOptionsService, ChartSegment } from './chart-options.service';
import { MainService } from './../../main.service';

import { ColorService } from './../colors.service';
import { NetworkHistory } from './../../network/NetworkHistory';
import { Network } from './../../network/Network';
import { Chart } from 'chart.js';
import { Component, Input, OnInit, ViewChild, Directive, ViewContainerRef, ChangeDetectionStrategy } from '@angular/core';


@Component({
    selector: 'pattern-chart-view',
    templateUrl: './pattern-chart-view.component.html',
    styleUrls: ['./pattern-chart-view.component.css'],
    //changeDetection: ChangeDetectionStrategy.OnPush
})
export class PatternChartViewComponent implements OnInit {

    private _patternIndex:number = 0
    private _update:boolean = false;
    private _updateChart:boolean = false;
    private _selectedSegmentIndex: number = 0;
    private showLastLessonOnly: boolean = false;
    public steps:number[] = [];

    @Input ('history')
    public history:NetworkHistory;


    @Input('pattern-index') 
    public set patternIndex (value:number) {
        this._patternIndex = Number(value);    
    }

    public get patternIndex ():number{
        return this._patternIndex;    
    }

    public get selectedSegmentIndex(): number {
        return this._selectedSegmentIndex;
    }

    public set selectedSegmentIndex(value: number) {
        if (this._selectedSegmentIndex != value) {
            this._selectedSegmentIndex = Number(value);
            this.doUpdate ();
        }
    }

    @Input('update')
    public set update(value: boolean) {
        this._update = value;
        if(this._update)
            this.doUpdate ();
    }

    public get update ():boolean{
        return this._update;
    }


    constructor(
        private mainService: MainService,
        public chartOptionService:ChartOptionsService
    ) {
    }

    public ngOnInit(): void {
        this.mainService.networkChangeSubject.subscribe((network: Network) => {

            if (network != null)
                this.updateOnNetworkChange();

        })
    }

    private doUpdate ():void {
        this.calculateSteps ();
        this._updateChart = true;
    }

    public updateChart ():boolean {
        return this._update;
    }

    private updateOnNetworkChange(): void {

    }


    private includeStep(n: number): boolean {

        const historyLength:number = this.history.length;
        const lessonLength: number = this.mainService.lesson.training.length;

        if(n == historyLength - lessonLength + this._patternIndex)
            return true;

        const mod: number = lessonLength * Math.ceil(historyLength / 100);

        if (n % mod == this.patternIndex)
            return true;

        return false;
    }

    private getSteps(start: number, end: number): number[] {
        console.log("createSteps: " + start + " > " + end);
        start = Math.max(0, start);
        end = Math.max(end, start);
        var result: number[] = [];
        for (let i: number = start; i < end; i++) {
          
            if (this.includeStep(i))
                result.push(i);

        }
        return result;
    }

    private calculateSteps ():void {
       // console.log("calcSteps");
       
        let segment:ChartSegment = this.chartOptionService.segments[this._selectedSegmentIndex].id; 
        switch(segment){
            case ChartSegment.ALL:
                this.steps = this.getSteps(0, this.history.length);
                break;

            case ChartSegment.ONLY_LAST:
                const lessonLength: number = this.mainService.lesson.training.length;
                this.steps = this.getSteps(this.history.length-lessonLength+this._patternIndex, 
                                            this.history.length-lessonLength+this._patternIndex+1);
                break;
                
            default:
                this.steps = [];
                console.error("_selectedFilterIndex not recordnized: ", segment);
        }
        console.log("this.steps: ", this.steps);
    }

}
