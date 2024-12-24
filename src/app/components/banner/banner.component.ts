// banner.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  autoSlideInterval: any;
  slides = [
    {
      title: 'Summer Collection 2024',
      subtitle: 'Discover the latest trends',
      description: 'Up to 40% off on selected items',
      buttonText: 'Shop Now',
      image: '/assets/images/banner1.jpg',
    },
    {
      title: 'New Arrivals',
      subtitle: 'Exclusive Designer Collection',
      description: 'Free shipping on orders over $50',
      buttonText: 'Explore',
      image: '/assets/images/banner2.jpg',
    },
    {
      title: 'Limited Edition',
      subtitle: 'Premium Quality',
      description: 'Special offers for premium members',
      buttonText: 'View Collection',
      image: '/assets/images/banner3.jpg',
    },
  ];

  ngOnInit() {
    this.startAutoSlide();
  }

  ngOnDestroy() {
    this.stopAutoSlide();
  }

  startAutoSlide() {
    this.autoSlideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  stopAutoSlide() {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  setSlide(index: number) {
    this.currentSlide = index;
  }

  onSlideHover(isHovering: boolean) {
    if (isHovering) {
      this.stopAutoSlide();
    } else {
      this.startAutoSlide();
    }
  }
}
