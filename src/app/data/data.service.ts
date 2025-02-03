import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class DataService {
  eventsJsonUrl = 'assets/events.json';
  months: any = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  events: any;
  eventsList: any = [];

  constructor(private http: HttpClient) {}

  // Get events
  getEvents(): Observable<Object> {
    return this.http.get<any>(this.eventsJsonUrl)
    .pipe(map((eventsData: any) => {
      this.events = eventsData;
      this.formatEventsList();

      let events: any[] = [];
      for (let i = 0; i < this.eventsList.length; i++) {
        events = events.concat(this.eventsList[i].events);
      }

      return events.sort((a: any, b: any) => {
        return b.date.replace(/-/g, '') - a.date.replace(/-/g, '');
      });
    }));
  }

  // Get event by id
  getEvent(eventId: number): any {
    for(let i=0; i<this.events.length; i++) {
      if(this.events[i].id == eventId) {
        return this.events[i];
      }
    }
    return null;
  }

  // Get list with categories and events
  getList(): any {
    return this.eventsList;
  }

  // To init events list
  private formatEventsList(): void {
    this.eventsList = [];

    let currentId: number = 0;
    for(let i=0; i<this.events.length; i++) {
      this.events[i].formattedDate = this.formatDate(this.events[i].date);
      if(this.events[i].date.length == 7) {
        this.events[i].date = this.events[i].date + '-00';
      }

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

  private getEventListCategoryI(categoryName: string): number {
    for(let i=0; i<this.eventsList.length; i++) {
      if(this.eventsList[i].name == categoryName) {
        return i;
      }
    }
    return -1;
  }

  private formatDate(date: string): string {
    if(date.length >= 7) {
      let monthI: number = +date.substring(5, 7) - 1;

      if(date.length == 7) {
        return this.months[monthI] + ' ' + date.substring(0, 4);
      } else if(date.length == 10) {
        let day: number = +date.substring(8);
        return this.months[monthI] + ' ' + day + ', ' + date.substring(0, 4);
      }
    }

    return '';
  }
}