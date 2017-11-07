import { Neuron } from './../../network/Neuron';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'neuron-view',
  templateUrl: './neuron-view.component.html',
  styleUrls: ['./neuron-view.component.css']
})
export class NeuronViewComponent {

  @Input ('neuron') private neuron:Neuron;


}
