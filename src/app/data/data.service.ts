import { Injectable } from '@angular/core';

import { events } from './events.store';


@Injectable()
export class DataService {
  events: any;
  
  eventsList: any = [];

  constructor() {
    this.events = events;
    this.formatEventsList();
  }

  formatEventsList(): void {
    this.eventsList = [];

    let currentId: number = 0;
    for(let i=0; i<this.events.length; i++) {
      // We get/set category
      let year: string = this.events[i].date.substring(0, 4);
      let categoryI: number = this.getEventListCategoryI(year);
      if(categoryI == -1) {
        this.eventsList.push({
          name: year,
          events: []
        });
        categoryI = this.eventsList.length - 1;
      }

      // We add event to category
      this.events[i].id = currentId;
      this.eventsList[categoryI].events.push(this.events[i]);

      currentId++;
    }

    // Then we sort
    this.eventsList.sort(function(a: any, b: any) {
      return b.name - a.name;
    });
    for(let i=0; i<this.eventsList.length; i++) {
      this.eventsList[i].events.sort(function(a: any, b: any) {
        return b.date.replace(/-/g, '') - a.date.replace(/-/g, '');
      });
    }
  }

  getEventListCategoryI(categoryName: string): number {
    for(let i=0; i<this.eventsList.length; i++) {
      if(this.eventsList[i].name == categoryName) {
        return i;
      }
    }
    return -1;
  }

  // Get list with categories and events
  getList(): any {
    return this.eventsList;
  }

  // Get events
  getEvents(): void {
    let events: any = [];
    for(let i=0; i<this.eventsList.length; i++) {
      events = events.concat(this.eventsList[i].events);
    }
    return events;
  }
}