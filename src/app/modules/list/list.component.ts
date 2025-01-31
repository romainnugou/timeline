import { Component, HostListener, Renderer2, OnInit } from '@angular/core';

import { DataService } from '../../data/data.service';
import { events } from 'src/app/data/events.store';

@Component({
    selector: 'app-list',
    templateUrl: './list.component.html',
    standalone: false
})
export class ListComponent implements OnInit{
  events: any;
  eventsList: any = [];

  timer: any;

  mobileNavigationOpen: boolean = false;

  selectedEventId: number;

  lightboxEventId: number = -1;
  lightboxImageI: number = -1;

  infoOverlayHidden: boolean = true;
  scrollTopButtonHidden: boolean = true;

  constructor(private data: DataService, private renderer: Renderer2) {
    this.events = this.data.getEvents();
    this.selectedEventId = this.events[0].id;
  }

  ngOnInit(): void {
    if(this.events.length > 0) {
      this.eventsList.push(this.events[0]);
    }

    let index: number = 1;
    this.timer = setInterval(() => {
        if (index < this.events.length) {
          this.eventsList.push(this.events[index]);
          index++;
        } else { 
          clearInterval(this.timer); 
        }
    }, 250);
  }

  displayEvent(eventId: number): void {
    let el = document.getElementById('event_' + eventId);
    this.closeMobileNavigation();
    setTimeout(function(){
      let top: number = el.offsetTop;
      if(window.innerWidth < 1024) {
        top -= 60;
      }
      window.scroll({top: top, left: 0, behavior: 'smooth'})
    }, 100);
  }

  openLightbox($event: any): void {
    this.lightboxEventId = $event.eventId;
    this.lightboxImageI = $event.imageI;
  }

  lightboxClosed(): void {
    this.lightboxEventId = -1;
    this.lightboxImageI = -1;
  }

  displayInfo(): void {
    document.getElementById('info-button').blur();
    this.infoOverlayHidden = false;
    this.renderer.addClass(document.body, 'noscroll');
  }
  hideInfo(): void {
    this.infoOverlayHidden = true;
    this.renderer.removeClass(document.body, 'noscroll');
  }

  toggleMobileNavigation(): void {
    this.mobileNavigationOpen = !this.mobileNavigationOpen;

    if(this.mobileNavigationOpen) {
      this.renderer.addClass(document.body, 'noscroll');
    } else {
      this.renderer.removeClass(document.body, 'noscroll');
    }
  }
  closeMobileNavigation(): void {
    this.mobileNavigationOpen = false;
    this.renderer.removeClass(document.body, 'noscroll');
  }

  scrollTop(): void {
    setTimeout(function(){
      window.scrollTo({top: 0, behavior: 'smooth'});
    }, 100);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let margin: number = Math.floor(window.innerHeight * 15 / 100);

    // Events
    for(let i=0; i<events.length; i++) {
      let el = document.getElementById('event_' + events[i].id);

      // If event fills 50% or more of the scree
      if(el.offsetTop > window.pageYOffset + Math.round(window.innerHeight * 0.5)) {
        if(i > 0) {
          this.selectedEventId = events[i - 1].id;
        } else {
          this.selectedEventId = events[i].id;
        }
        break;
      } else if(i == events.length - 1) {
        this.selectedEventId = events[i].id;
      }
    }

    // Scroll top button
    if(window.pageYOffset > 300 && this.scrollTopButtonHidden) {
      this.scrollTopButtonHidden = false;
    } else if(window.pageYOffset <= 300 && !this.scrollTopButtonHidden) {
      this.scrollTopButtonHidden = true;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeydownHandler(event: KeyboardEvent) {
    // When lightbox, info panel and mobile navigation aren't open
    if(this.lightboxEventId == -1 && this.infoOverlayHidden && !this.mobileNavigationOpen) {
      // Navigation keys
      // Arrow up
      if(event.key == 'ArrowUp') {
        event.preventDefault();
        this.displayPreviousEvent();
      }
      // Arrow down
      if(event.key == 'ArrowDown') {
        event.preventDefault();
        this.displayNextEvent();
      }

      // Enter or space
      if(event.key == 'Enter' || event.code == 'Space') {
        event.preventDefault();

        this.openLightbox({
          eventId: this.selectedEventId,
          imageI: 0
        });
      }
    }
    // When mobile navigation is open
    if(this.mobileNavigationOpen) {
      // Esc
      if(event.key == 'Escape') {
        this.closeMobileNavigation();
      }
    }
    // When lightbox isn't open
    if(this.lightboxEventId == -1 && !this.mobileNavigationOpen) {
      // i
      if(event.key == 'i') {
        if(this.infoOverlayHidden) {
          this.displayInfo();
        } else {
          this.hideInfo();
        }
      }

      // Esc
      if(event.key == 'Escape') {
        this.hideInfo();
      }
    }
  }

  private displayPreviousEvent(): void {
    for(let i=0; i<this.events.length; i++) {
      if(this.events[i].id == this.selectedEventId && i > 0) {
        this.displayEvent(this.events[i - 1].id);
        break;
      }
    }
  }
  private displayNextEvent(): void {
    for(let i=0; i<this.events.length; i++) {
      if(this.events[i].id == this.selectedEventId && i < this.events.length - 1) {
        this.displayEvent(this.events[i + 1].id);
        break;
      }
    }
  }
}
