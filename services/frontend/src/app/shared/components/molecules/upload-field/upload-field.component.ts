import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-upload-field',
  templateUrl: './upload-field.component.html',
  styleUrls: ['./upload-field.component.scss'],
})
export class UploadFieldComponent {
  @Input() public file: File = new File([], '');
  @Input() public uploadProgress = 0;
  @Output() public fileChange: EventEmitter<File> = new EventEmitter<File>();
  @Output() public cancelUpload: EventEmitter<null> = new EventEmitter<null>();

  uploadFile(event: Event): void {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (!fileList) {
      return;
    }
    this.file = fileList[0];
    this.fileChange.emit(this.file);
  }

  uploadDroppedFile(files: File[]): void {
    if (!files) {
      return;
    }
    this.file = files[0];
    this.fileChange.emit(this.file);
  }
}
