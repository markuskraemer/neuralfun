import { Component } from '@angular/core';
import { Network } from './network/Network'
@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

    private _network:Network;

    constructor (){
        this._network = new Network ([1,2,3,4]); 
    }

    public get network ():Network {
        return this._network;
    }

}
