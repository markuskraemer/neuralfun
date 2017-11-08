import { Component, Input, ApplicationRef } from '@angular/core';
import { Network } from '../../network/Network';

@Component({
  selector: 'network-view',
  templateUrl: './network-view.component.html',
  styleUrls: ['./network-view.component.css']
})
export class NetworkViewComponent {

  @Input('network') public network:Network;

  constructor (
    private applicationRef:ApplicationRef
  ){

  }

  private getPos (id:string):{x:string, y:string}
  {
    let elem:HTMLElement = document.querySelector('#neuron_' + id) as HTMLElement;
    if(elem){
      let computed:CSSStyleDeclaration = window.getComputedStyle (elem);
      return {x:elem.offsetLeft + 'px', y:elem.offsetTop + 'px'};
    }else{
      setTimeout(()=> this.applicationRef.tick (), 2000);
      return {x:'0', y:'0'};
    }
  }

  private getLineStyle (weight:number):object
  {
      return {
            'stroke': weight > 0 ? 'green' : 'red',
            'strokeWidth': Math.abs(weight * 2) + 2
        }
    }

}
