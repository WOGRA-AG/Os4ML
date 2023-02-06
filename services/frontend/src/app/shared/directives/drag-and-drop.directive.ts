import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
})
export class DragAndDropDirective {
  @Output() filesDropped = new EventEmitter<File[]>();

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Dragleave Event
  @HostListener('dragleave', ['$event'])
  public dragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drop Event
  @HostListener('drop', ['$event'])
  public drop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer) {
      return;
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.filesDropped.emit(Array.from(files));
    }
  }
}
