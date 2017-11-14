import { ILesson } from './data/ILessons';
import { DataLoader } from './data/DataLoader';
import { Component, OnInit } from '@angular/core';
import { Network } from './network/Network'
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

    private _network:Network;
    private epoches:number = 10;
    private totalEpoches:number = 0;
    private patternIndex:number = 0;
    private isTraining:boolean = false;
    private lessonLoader:DataLoader;
    private _selectedLessonIndex:number = 0 ;
    private rafId:number;
    private requestAnimationFrame:(callback:any)=>number;
    private cancelAnimationFrame:(id:number)=>void;

    constructor (){
        this._network = new Network([1,1,1]);
        this.lessonLoader = new DataLoader ();
        this.requestAnimationFrame = window.requestAnimationFrame 
                    || window.webkitRequestAnimationFrame 
                    || window['mozRequestAnimationFrame'] 
                    || window['msRequestAnimationFrame'];
                
        this.cancelAnimationFrame = window.cancelAnimationFrame 
                    || window.webkitCancelAnimationFrame 
                    || window['mozCancelAnimationFrame'] 
                    || window['msCancelAnimationFrame'];

    }

    public ngOnInit ():void {
        this.lessonLoader.stateChangedSubject.subscribe((state:number)=>{
            if(state == DataLoader.LOAD_FINISHED)
                 this.createNetwork();
        });
        this.lessonLoader.startLoad ();
    }


    public get network ():Network {
        return this._network;
    }

    private get selectedLessonIndex ():number {
        return this._selectedLessonIndex;
    }

    private set selectedLessonIndex (value:number){
        console.log("setSelectedLesson: ", value);
        if(this._selectedLessonIndex != value) {
            this._selectedLessonIndex = value;
            this.createNetwork ();
        }
    }

    private createNetwork ():void {
        this.stopTrain ();
        this.totalEpoches = 0;
        this._network = new Network ([this.lesson.patterns[0].input.length, 
                                                                          0, 
                                      this.lesson.patterns[0].targets.length]);

        this.updateInputsAndTargets ();
    }

    private get lesson ():ILesson {
        return this.lessonLoader.lessons[this.selectedLessonIndex];
    }

    private startOrStopTrain ():void {
        console.log("startOrStopTrain " + this.epoches);
        if(this.isTraining){
            this.stopTrain ();
        }else{
            if(this.epoches > 0)
                this.train ();
        }
    }

    private stopTrain ():void {       
        this.isTraining = false;        
        this.cancelAnimationFrame (this.rafId);    
    }

    private updateInputsAndTargets ():void {
        this.network.setInputs(this.lesson.patterns[this.patternIndex].input);
        this.network.setOutputTargets(this.lesson.patterns[this.patternIndex].targets);        
    }

    private train ():void {
        this.isTraining = true;
        this.updateInputsAndTargets ();
        this.network.trainDelta ();

        if(this.trainNext ()){
            this.cancelAnimationFrame (this.rafId);
            this.rafId = this.requestAnimationFrame (()=>this.train());
        }else{
            this.isTraining = false;
        }

    }

    private trainNext ():boolean {
        
        if(++ this.patternIndex < this.lesson.patterns.length) {
            return true;            
        }else if(-- this.epoches > 0) {
            this.totalEpoches ++;
            this.patternIndex = 0;
            return true;
        }else{
            return false;
        }
    }

}
