import { WorkingNeuron } from './../../network/WorkingNeuron';
import { Neuron } from './../../network/Neuron';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'neuron-view',
  templateUrl: './neuron-view.component.html',
  styleUrls: ['./neuron-view.component.css']
})
export class NeuronViewComponent {

  @Input ('neuron') public neuron:Neuron;
  @Input ('color') private color:string = 'grey';

  public get neuronAsWorkingNeuron ():WorkingNeuron {
      return this.neuron as WorkingNeuron;
  }

  public getCircleStyle ():object {
      let radius:number = Math.max(5, 20 + this.neuron.output * 20) 
      return {
          width: radius + 'px',
          height: radius + 'px',
          'background-color': this.color
      }
  }


}
