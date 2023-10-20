import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrossoverComponent } from './crossover.component';

describe('CrossoverComponent', () => {
  let component: CrossoverComponent;
  let fixture: ComponentFixture<CrossoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
