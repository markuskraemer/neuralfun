import { Network } from './../../network/Network';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'controls-view',
  templateUrl: './controls-view.component.html',
  styleUrls: ['./controls-view.component.css']
})
export class ControlsViewComponent {

    @Input('network') private network:Network;

}
