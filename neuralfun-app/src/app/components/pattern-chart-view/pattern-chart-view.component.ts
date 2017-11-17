import { ChartOptionsService } from './chart-options.service';
import { MainService } from './../../main.service';

import { ColorService } from './../colors.service';
import { NetworkHistory } from './../../network/NetworkHistory';
import { Network } from './../../network/Network';
import { Chart } from 'chart.js';
import { Component, Input, OnInit, ViewChild, Directive, ViewContainerRef } from '@angular/core';


@Component({
    selector: 'pattern-chart-view',
    templateUrl: './pattern-chart-view.component.html',
    styleUrls: ['./pattern-chart-view.component.css']
})
export class PatternChartViewComponent implements OnInit {

    private _patternIndex:number = 0
    private _update:boolean = false;
    private _selectedSegmentIndex: number = 0;
    private showLastLessonOnly: boolean = false;

    @Input('pattern-index') 
    private set patternIndex (value:number) {
        this._patternIndex = Number(value);    
    }

    private get patternIndex ():number{
        return this._patternIndex;    
    }

    private get selectedSegmentIndex(): number {
        return this._selectedSegmentIndex;
    }

    private set selectedSegmentIndex(value: number) {
        if (this._selectedSegmentIndex != value) {
            this._selectedSegmentIndex = Number(value);
        }
    }

    @Input('update')
    public set update(value: boolean) {
        this._update = value;
    }

    public get update ():boolean{
        return this._update;
    }


    constructor(
        private mainService: MainService,
        private chartOptionService:ChartOptionsService
    ) {
    }

    public ngOnInit(): void {
        this.mainService.networkChangeSubject.subscribe((network: Network) => {

            if (network != null)
                this.updateOnNetworkChange();

        })
    }



    private updateOnNetworkChange(): void {
    }


}
