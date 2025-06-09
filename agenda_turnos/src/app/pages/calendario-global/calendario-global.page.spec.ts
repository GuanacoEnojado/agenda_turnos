import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarioGlobalPage } from './calendario-global.page';

describe('CalendarioGlobalPage', () => {
  let component: CalendarioGlobalPage;
  let fixture: ComponentFixture<CalendarioGlobalPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarioGlobalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
