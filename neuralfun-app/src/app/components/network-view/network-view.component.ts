import { Component, Input } from '@angular/core';
import { Network } from '../../network/Network';

@Component({
  selector: 'network-view',
  templateUrl: './network-view.component.html',
  styleUrls: ['./network-view.component.css']
})
export class NetworkViewComponent {

  @Input('network') public network:Network;

}
