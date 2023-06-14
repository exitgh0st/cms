import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'preview-pic-modal',
  templateUrl: './preview-pic-modal.component.html',
  styleUrls: ['./preview-pic-modal.component.scss']
})
export class PreviewPicModalComponent {
  @Input() picURL?: string | ArrayBuffer;
  @Output() clickGrayOverlay = new EventEmitter();

  // ngAfterViewInit(): void {
  //   document.body.style.overflow = 'hidden';
  // }

  // ngOnDestroy(): void {
  //   document.body.style.overflow = 'auto';
  // }
}
