import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EliminacionPage } from './eliminacion.page';

describe('EliminacionPage', () => {
  let component: EliminacionPage;
  let fixture: ComponentFixture<EliminacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
