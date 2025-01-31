import { Component, Input, OnChanges, Output, EventEmitter, Renderer2, HostListener } from '@angular/core';

import { DataService } from '../../data/data.service';

@Component({
    selector: 'app-lightbox',
    templateUrl: './lightbox.component.html',
    standalone: false
})
export class LightboxComponent implements OnChanges {
  @Input() eventId: number;
  @Input() imageI: number;
  @Output() closed = new EventEmitter();

  event: any;

  active: boolean = false;

  constructor(private data: DataService, private renderer: Renderer2) { }

  ngOnChanges($event: any): void {
    if($event.eventId && $event.eventId.currentValue > -1
        && $event.imageI && $event.imageI.currentValue > -1) {
      this.event = this.data.getEvent(this.eventId);
      if(this.event != null && this.imageI < this.event.images.length) {
        this.renderer.addClass(document.body, 'noscroll');

        setTimeout(() => {
          this.active = true;
        }, 50);
      }
    }
  }

  close(): void {
    this.renderer.removeClass(document.body, 'noscroll');
    this.active = false;
    this.closed.emit();
  }

  browseImage(move: number): void {
    if(move > 0 && this.imageI == (this.event.images.length - 1)) {
      this.imageI = 0;
    } else if(move < 0 && this.imageI == 0) {
      this.imageI = this.event.images.length - 1;
    } else {
      this.imageI += move;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    // When modal is opened
    if(this.active) {
      // Escape/Enter/Space
      if(event.key == 'Escape' || event.key == 'Enter' || event.code == 'Space') {
        event.preventDefault();

        this.close();
      }
      // Navigation keys
      // Arrow left
      if(event.key == 'ArrowLeft') {
        this.browseImage(-1);
      }
      // Arrow right
      if(event.key == 'ArrowRight') {
        this.browseImage(1);
      }
    }
  }
}
