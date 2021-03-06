import { BehaviorSubject } from 'rxjs';
import { Network } from './network/Network';
import { DataLoader } from './data/DataLoader';
import { Lesson } from './data/ILessons';
import { Injectable } from '@angular/core';

@Injectable()
export class MainService {

    public networkChangeSubject:BehaviorSubject<Network>;

    public lessonLoader:DataLoader; 
    public epoches:number = 10;
    public totalEpoches:number = 0;
    private patternIndex:number = 0;

    private _selectedLessonIndex:number = 0;
    private _network:Network;
    public isBusy:boolean = false;
    private rafId:number;
    private requestAnimationFrame:(callback:any)=>number;
    private cancelAnimationFrame:(id:number)=>void;

    constructor (){
        this.requestAnimationFrame = window.requestAnimationFrame 
                    || window.webkitRequestAnimationFrame 
                    || window['mozRequestAnimationFrame'] 
                    || window['msRequestAnimationFrame'];
                
        this.cancelAnimationFrame = window.cancelAnimationFrame 
                    || window.webkitCancelAnimationFrame 
                    || window['mozCancelAnimationFrame'] 
                    || window['msCancelAnimationFrame'];


        this._network = new Network([1,1,1]);
        this.networkChangeSubject = new BehaviorSubject (this.network);
        this.lessonLoader = new DataLoader ();      
        this.lessonLoader.stateChangedSubject.subscribe((state:number)=>{
            if(state == DataLoader.LOAD_FINISHED)
                 this.createNetwork();
        });
        this.lessonLoader.startLoad ();
    }


    public get lesson ():Lesson {
        return this.lessonLoader.lessons[this._selectedLessonIndex];
    }

    public get selectedLessonIndex ():number {
        return this._selectedLessonIndex;
    }

    public set selectedLessonIndex (value:number){
        console.log("setSelectedLesson: ", value);
        if(this._selectedLessonIndex != value) {
            this._selectedLessonIndex = value;
            this.createNetwork ();
        }
    }

     public get network ():Network {
        return this._network;
    }



    private createNetwork ():void {
        this.stopTrain ();
        this.totalEpoches = 0;
        this.patternIndex = 0;
        this._network = new Network ([this.lesson.training[0].input.length, 
                                                                          0, 
                                      this.lesson.training[0].targets.length]);

        this.updateInputsAndTargets ();
        this.networkChangeSubject.next(this.network);
    }

    public startTest ():void {
        this.isBusy = true;
        for(let i:number = 0; i < this.lesson.test.length; ++i){
            this.updateInputsAndTargetsTest (i);
            this.network.writeToTestHistory ();
        }
        setTimeout (() => this.isBusy = false, 500);
        
    }

    private updateInputsAndTargetsTest (patternIndex:number):void {
        this.network.setInputs(this.lesson.test[patternIndex].input);
        this.network.setOutputTargets(this.lesson.test[patternIndex].targets);        
    }

    public startOrStopTrain ():void {
        if(this.isBusy){
            this.stopTrain ();
        }else{
            if(this.epoches > 0)
                this.train ();
        }
    }

    private stopTrain ():void {       
        this.isBusy = false;        
        this.cancelAnimationFrame (this.rafId);    
    }

    private updateInputsAndTargets ():void {
        this.network.setInputs(this.lesson.training[this.patternIndex].input);
        this.network.setOutputTargets(this.lesson.training[this.patternIndex].targets);        
    }

    private train ():void {
        this.isBusy = true;

        if(this.trainNextEpoche ()){
            this.cancelAnimationFrame (this.rafId);
            this.rafId = this.requestAnimationFrame (()=>this.train());
        }else{
            this.isBusy = false;
        }
    }

    private trainNextEpoche ():boolean {
        
        if(-- this.epoches >= 0) {
            for(this.patternIndex = 0; this.patternIndex < this.lesson.training.length; ++this.patternIndex){
                this.updateInputsAndTargets ();
                this.network.writeToTrainingHistory ();
                this.network.trainDelta ();
            }
    
            this.totalEpoches ++;
            return true;
        }else{
            this.epoches = 0;
            return false;
        }
    }

}