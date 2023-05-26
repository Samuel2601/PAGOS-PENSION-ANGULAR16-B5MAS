import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  constructor() { }
  
  private progress: number = 0;

  getProgress(): number {
    return this.progress;
  }

  setProgress(value: number): void {
    this.progress = value;
  }

}
