import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioJuegoComponent } from './inicio-juego.component';

describe('InicioJuegoComponent', () => {
  let component: InicioJuegoComponent;
  let fixture: ComponentFixture<InicioJuegoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InicioJuegoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InicioJuegoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
