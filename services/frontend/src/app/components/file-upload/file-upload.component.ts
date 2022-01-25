import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  @Input() file: File = new File([], "");
  @Output() updateFile: EventEmitter<File> = new EventEmitter<File>();

  uploadFile(event: Event) {
    const element = event.currentTarget as HTMLInputElement;
    const fileList: FileList | null = element.files;
    if (!fileList) return;
    this.file = fileList[0];
    this.updateFile.emit(this.file);
  }
}
