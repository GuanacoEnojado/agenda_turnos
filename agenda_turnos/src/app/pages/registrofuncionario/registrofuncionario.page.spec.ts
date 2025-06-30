import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegistrofuncionarioPage } from './registrofuncionario.page';

describe('RegistrofuncionarioPage', () => {
  let component: RegistrofuncionarioPage;
  let fixture: ComponentFixture<RegistrofuncionarioPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrofuncionarioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
