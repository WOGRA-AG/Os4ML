import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-file-dropzone',
  templateUrl: './file-dropzone.component.html',
  styleUrls: ['./file-dropzone.component.scss'],
  standalone: true,
  imports: [NgIf, TranslateModule],
})
export class FileDropzoneComponent {
  @Input() public selectedFileName = 'No File Selected';
  @Input() public invalid = false;
  @Output() private fileDropped = new EventEmitter<File>();
  public isDragging = false;
  public isMobileView = false;
  constructor() {
    this.isMobileView = this.isMobileDevice();
  }

  @HostListener('dragover', ['$event']) public onDragOver(
    evt: DragEvent
  ): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragging = true;
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(
    evt: DragEvent
  ): void {
    evt.preventDefault();
    evt.stopPropagation();
    this.isDragging = false;
  }

  @HostListener('drop', ['$event']) public ondrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
    if (!event.dataTransfer) {
      return;
    }
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.fileDropped.emit(files[0]);
    }
  }

  uploadFile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (fileList && fileList.length > 0) {
      this.fileDropped.emit(fileList[0]);
    }
  }

  private isMobileDevice(): boolean {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }
}
