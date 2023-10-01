import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformeJuegoComponent } from './informe-juego.component';

describe('InformeJuegoComponent', () => {
  let component: InformeJuegoComponent;
  let fixture: ComponentFixture<InformeJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformeJuegoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformeJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
