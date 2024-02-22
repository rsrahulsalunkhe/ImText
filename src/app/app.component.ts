import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { createWorker } from 'tesseract.js';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  selectedImage: File | null = null;
  textResult: string = "";
  url: any;

  constructor() {
  }


  async convertImageToText() {
    if (!this.selectedImage) return;
    const worker = await createWorker("eng");
    await worker.load();
    const { data } = await worker.recognize(this.selectedImage);
    this.textResult = data.text;
    await worker.terminate();
  }



  getImageUrl(file: File): string | null {
    if (!file) {
      return null;
    }
    this.url = URL.createObjectURL(file);
    // const reader = new FileReader();
    // reader.readAsDataURL(file);

    // reader.onload = (e: any) => {
    //   this.url = e.target.result;
    // }

    return this.url;
  }

  async handleChangeImage(event: any) {
    if (event.target.files[0]) {
      this.selectedImage = event.target.files[0];
    } else {
      this.selectedImage = null;
      this.textResult = "";
    }
    await this.convertImageToText();
  }

  copyText(text: string) {
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select()
    document.execCommand('copy');
    document.body.removeChild(el);
  }
}
