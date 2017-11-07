import { Component, Input } from '@angular/core';

import { Connection } from './../../network/Connection';
import { Neuron } from './../../network/Neuron';

@Component({
  selector: 'connection-view',
  templateUrl: './connection-view.component.html',
  styleUrls: ['./connection-view.component.css']
})
export class ConnectionViewComponent {

  @Input ('connection') private connection:Connection;


}
