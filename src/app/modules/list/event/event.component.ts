import { Component, OnChanges, AfterViewInit, Input, Output, EventEmitter, ViewChildren, Renderer2, ElementRef, QueryList } from '@angular/core';

@Component({
    selector: 'app-event',
    templateUrl: './event.component.html',
    standalone: false
})
export class EventComponent implements OnChanges, AfterViewInit {
  @Input() event: any;
  @ViewChildren('image') images: QueryList<ElementRef>;
  @Output() openLightbox = new EventEmitter();

  imagesList: any;

  loadedImageCount: number = 0;
  eventWidth: number;
  maxImages: number = 4;
  margin: number = 5;
  
  plusButtonWidth: number = 40;
  plusButtonHeight: number = 0;

  loaded: boolean = false;

  isInViewport: boolean = false;
  intersectionObserver: IntersectionObserver;

  constructor(private renderer: Renderer2, private el:ElementRef) { }

  ngOnChanges(): void {
    this.imagesList = this.event.images.slice(0, 4);
  }

  ngAfterViewInit(): void {
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver(): void {
    const options = {
      root: null,
      threshold: 0,
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.loaded) {
          this.isInViewport = true;
        } 
      });
    }, options);

    this.intersectionObserver.observe(this.el.nativeElement);
  }

  onLoad($event: any): void {
    if(this.eventWidth === undefined) {
      this.eventWidth = this.el.nativeElement.querySelector('.event-container').offsetWidth;
    }

    this.loadedImageCount++;
    if(this.loadedImageCount == this.event.images.length
        || (this.event.images.length > this.maxImages) && this.loadedImageCount == this.maxImages) {
      this.resizeImages();
      this.loaded = true;
    }
  }

  resizeImages(): void {
    let imagesArray: any = this.images.toArray();

    let maxHeight: number = 0;
    // We skip first image (which we'll be full size)
    for(let i=1; i<imagesArray.length; i++) {
      if(imagesArray[i].nativeElement.height > maxHeight) {
        maxHeight = imagesArray[i].nativeElement.height;
      }
    }

    let relWidths: any = [];
    let totalRelWidth: number = 0;
    for(let i=1; i<imagesArray.length; i++) {
      let relWidth: number = imagesArray[i].nativeElement.width * maxHeight / imagesArray[i].nativeElement.height;
      relWidths[i] = relWidth;
      totalRelWidth += relWidth;
    }

    let availableWidth: number = this.eventWidth;
    // If there's a plus button
    if(this.event.images.length > this.maxImages) {
      availableWidth = availableWidth - this.plusButtonWidth - this.margin;
    }
    for(let i=1; i<imagesArray.length; i++) {
      let percentageWidth: number = relWidths[i] / totalRelWidth;
      let newWidth: number = Math.floor((availableWidth - this.margin * (imagesArray.length - 2)) * percentageWidth);
      this.renderer.setStyle(imagesArray[i].nativeElement, 'width', `${newWidth}px`);
    }
    // If there's a plus button and its height isn't set yet
    if(this.event.images.length > this.maxImages && this.plusButtonHeight == 0) {
      this.plusButtonHeight = imagesArray[2].nativeElement.height;
    }
  }

  openImage(imageI: number): void {
    // let image: any = this.images.toArray()[imageI].nativeElement;
    
    this.openLightbox.emit({
      eventId: this.event.id,
      imageI: imageI,
      // imageRect: image.getBoundingClientRect()
    });
  }
}
