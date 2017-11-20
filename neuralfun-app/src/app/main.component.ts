import { ILesson } from './data/ILessons';
import { DataLoader } from './data/DataLoader';
import { Component } from '@angular/core';
import { Network } from './network/Network'
import { MainService } from './main.service';
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {



    constructor (
        public mainService:MainService
    ){
       
    }   

}
