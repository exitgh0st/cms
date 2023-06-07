import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'small-modal',
  templateUrl: './small-modal.component.html',
  styleUrls: ['./small-modal.component.scss']
})
export class SmallModalComponent {
  @Output() clickGrayOverlay = new EventEmitter();
}
