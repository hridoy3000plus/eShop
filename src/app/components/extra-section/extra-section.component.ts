// services.component.ts
import { Component } from '@angular/core';

interface Service {
  icon: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-extra-section',
  templateUrl: './extra-section.component.html',
  styleUrls: ['./extra-section.component.css'],
})
export class ExtraSectionComponent {
  services: Service[] = [
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M3 7v10c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2V7c0-1.104-.896-2-2-2H5c-1.104 0-2 .896-2 2zM5 6h14c.553 0 1 .447 1 1v7h-16V7c0-.553.447-1 1-1z"></path>
  <path d="M2 12h18v5H4c-1.104 0-2 .896-2 2v2h18v-2c0-1.104-.896-2-2-2H4zM16 20c.553 0 1 .447 1 1s-.447 1-1 1s-1-.447-1-1s.447-1 1-1zM8 20c.553 0 1 .447 1 1s-.447 1-1 1s-1-.447-1-1s.447-1 1-1z"></path>
</svg>

`,
      title: 'FREE AND FAST DELIVERY',
      description: 'Free delivery for all orders over $140',
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 16c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2V11c0-1.104-.896-2-2-2H7c-1.104 0-2 .896-2 2v5zM6 11V9c0-1.104.896-2 2-2h8c1.104 0 2 .896 2 2v2M6 16v1c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-1M7 19c.553 0 1 .447 1 1s-.447 1-1 1-1-.447-1-1 .447-1 1-1zm10 0c.553 0 1 .447 1 1s-.447 1-1 1-1-.447-1-1 .447-1 1-1z"></path>
</svg>
`,
      title: '24/7 CUSTOMER SERVICE',
      description: 'Friendly 24/7 customer support',
    },
    {
      icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M5 16c0 1.104.896 2 2 2h10c1.104 0 2-.896 2-2V11c0-1.104-.896-2-2-2H7c-1.104 0-2 .896-2 2v5zM6 11V9c0-1.104.896-2 2-2h8c1.104 0 2 .896 2 2v2M6 16v1c0 1.104.896 2 2 2h12c1.104 0 2-.896 2-2v-1M7 19c.553 0 1 .447 1 1s-.447 1-1 1-1-.447-1-1 .447-1 1-1zm10 0c.553 0 1 .447 1 1s-.447 1-1 1-1-.447-1-1 .447-1 1-1z"></path>
</svg>
`,
      title: 'MONEY BACK GUARANTEE',
      description: 'We return money within 30 days',
    },
  ];
}
