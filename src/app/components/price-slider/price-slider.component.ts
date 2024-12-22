import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-price-slider',
  templateUrl: './price-slider.component.html',
  styleUrls: ['./price-slider.component.css'],
})
export class PriceSliderComponent implements OnInit {
  @Input() minPrice = 0;
  @Input() maxPrice = 1000;
  @Input() step = 1;

  @Output() priceChange = new EventEmitter<{ min: number; max: number }>();

  currentMinValue: number;
  currentMaxValue: number;
  minThumbPosition: number = 0;
  maxThumbPosition: number = 100;

  constructor() {
    this.currentMinValue = this.minPrice;
    this.currentMaxValue = this.maxPrice;
  }

  ngOnInit() {
    this.setInitialValues();
  }

  private setInitialValues() {
    this.currentMinValue = this.minPrice;
    this.currentMaxValue = this.maxPrice;
    this.updateThumbPositions();
  }

  updateMinPrice(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.currentMinValue = Math.min(value, this.currentMaxValue - this.step);
    this.updateThumbPositions();
    this.emitPriceChange();
  }

  updateMaxPrice(event: Event) {
    const value = +(event.target as HTMLInputElement).value;
    this.currentMaxValue = Math.max(value, this.currentMinValue + this.step);
    this.updateThumbPositions();
    this.emitPriceChange();
  }

  private updateThumbPositions() {
    const range = this.maxPrice - this.minPrice;
    this.minThumbPosition =
      ((this.currentMinValue - this.minPrice) / range) * 100;
    this.maxThumbPosition =
      ((this.currentMaxValue - this.minPrice) / range) * 100;
  }

  private emitPriceChange() {
    this.priceChange.emit({
      min: this.currentMinValue,
      max: this.currentMaxValue,
    });
  }
}
