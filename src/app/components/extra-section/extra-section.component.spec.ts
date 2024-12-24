import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraSectionComponent } from './extra-section.component';

describe('ExtraSectionComponent', () => {
  let component: ExtraSectionComponent;
  let fixture: ComponentFixture<ExtraSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExtraSectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExtraSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
