import { IPattern } from './../../data/ILessons';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-input-view',
  templateUrl: './input-view.component.html',
  styleUrls: ['./input-view.component.css']
})
export class InputViewComponent  {


    @Input ('pattern')
    public pattern:IPattern;

    constructor() { }

    public get type ():string {
        return this.pattern.canvasDataURL != null ? 'image' : 'array';
    }

  

}
