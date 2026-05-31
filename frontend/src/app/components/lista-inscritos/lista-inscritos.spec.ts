import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaInscritos } from './lista-inscritos';

describe('ListaInscritos', () => {
  let component: ListaInscritos;
  let fixture: ComponentFixture<ListaInscritos>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListaInscritos],
    }).compileComponents();

    fixture = TestBed.createComponent(ListaInscritos);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
