import { Component, Output, EventEmitter, Input, AfterViewInit, Renderer2, ElementRef, HostListener } from '@angular/core';

import { DataService } from '../../../data/data.service';

@Component({
    selector: 'app-events-list',
    templateUrl: './events-list.component.html',
    standalone: false
})
export class EventsListComponent implements AfterViewInit {
  @Input() selectedEventId: number;
  @Output() eventSelect = new EventEmitter();
  @Output() closeMobileNavigationEvent = new EventEmitter();

  list: any;

  constructor(private data: DataService, private renderer: Renderer2, private el: ElementRef) {
    this.list = this.data.getList();
  }

  ngAfterViewInit(): void {
    this.setListPosition();
  }

  selectEvent(eventId: number): void {
    this.eventSelect.emit(eventId);
  }

  closeMobileNavigation(): void {
    this.closeMobileNavigationEvent.emit();
  }

  setListPosition(): void {
    let listHeight: number = this.el.nativeElement.querySelector('.list-container').offsetHeight;
    let margin: number = Math.round(window.innerHeight * 0.2);

    if(listHeight > (window.innerHeight - 2 * margin)) {
      let percentage: number = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
      let start: number = margin;
      let end: number = - listHeight + window.innerHeight - 2 * margin;
      let top: number = Math.round(end * percentage + start);
      this.renderer.setStyle(this.el.nativeElement.querySelector('.list-container'), 'top', `${top}px`);
    } else {
      let top: number = Math.round((window.innerHeight / 2) - (listHeight / 2));
      this.renderer.setStyle(this.el.nativeElement.querySelector('.list-container'), 'top', `${top}px`);
    }
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    this.setListPosition();
  }
}
