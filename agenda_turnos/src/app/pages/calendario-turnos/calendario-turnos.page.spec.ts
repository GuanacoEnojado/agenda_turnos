import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioTurnosPage } from './calendario-turnos.page';

describe('CalendarioTurnosPage', () => {
  let component: CalendarioTurnosPage;
  let fixture: ComponentFixture<CalendarioTurnosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioTurnosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
