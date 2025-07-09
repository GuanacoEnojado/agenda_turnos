import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BusquedadiaPage } from './busquedadia.page';

describe('BusquedadiaPage', () => {
  let component: BusquedadiaPage;
  let fixture: ComponentFixture<BusquedadiaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedadiaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
