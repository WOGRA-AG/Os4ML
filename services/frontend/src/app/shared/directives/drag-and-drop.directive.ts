import { Directive, EventEmitter, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]',
  standalone: true,
})
export class DragAndDropDirective {
  @Output() public filesDroppedChange = new EventEmitter<File[]>();

  // Dragover Event
  @HostListener('dragover', ['$event']) dragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Dragleave Event
  @HostListener('dragleave', ['$event'])
  public dragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  // Drop Event
  @HostListener('drop', ['$event'])
  public drop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (!event.dataTransfer) {
      return;
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.filesDroppedChange.emit(Array.from(files));
    }
  }
}
