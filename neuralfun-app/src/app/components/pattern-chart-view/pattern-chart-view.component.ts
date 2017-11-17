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
    private _selectedFilterIndex: number = 0;
    private showLastLessonOnly: boolean = false;

    private filters: any[] = [
        { name: "all" },
        { name: "last only" }
    ]

    @Input('pattern-index') 
    private set patternIndex (value:number) {
        this._patternIndex = Number(value);    
    }

    private get patternIndex ():number{
        return this._patternIndex;    
    }

    private get selectedFilterIndex(): number {
        return this._selectedFilterIndex;
    }

    private set selectedFilterIndex(value: number) {
        if (this._selectedFilterIndex != value) {
            this._selectedFilterIndex = Number(value);
        }
    }

    @Input('update')
    public set update(value: boolean) {
        console.log("PCV update: " + value);
        this._update = value;
    }

    public get update ():boolean{
        return this._update;
    }


    constructor(
        private mainService: MainService
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
