import { Component, Input, ApplicationRef, ChangeDetectorRef } from '@angular/core';
import { Network } from '../../network/Network';

@Component({
  selector: 'network-view',
  templateUrl: './network-view.component.html',
  styleUrls: ['./network-view.component.css']
})
export class NetworkViewComponent {

  @Input('network') public network:Network;

  constructor (
    private applicationRef:ApplicationRef,
    private changeDetectorRef:ChangeDetectorRef
  ){
    window.addEventListener('resize', () => {
      this.changeDetectorRef.detectChanges ();
    })
  }

  private getPos (id:string):{x:string, y:string} {
      let elem:HTMLElement = document.querySelector('#neuron_' + id) as HTMLElement;
      if(elem){
          return {x:elem.offsetLeft + elem.offsetWidth/2 + 'px', y:elem.offsetTop + elem.offsetHeight/2 + 'px'};
      }else{
          return {x:'0', y:'0'};
      }
  }

  private getLineStyle (weight:number):object {
      return {
            'stroke': weight > 0 ? 'green' : 'red',
            'strokeWidth': Math.abs(weight * 2) + 2
        }
    }

}
