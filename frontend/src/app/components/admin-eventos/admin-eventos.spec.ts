import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminEventosComponent } from './admin-eventos'; // Import correto

describe('AdminEventosComponent', () => { // Nome da classe corrigido
  let component: AdminEventosComponent; // Tipo corrigido
  let fixture: ComponentFixture<AdminEventosComponent>; // Tipo corrigido

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEventosComponent], // Import corrigido
    }).compileComponents();

    fixture = TestBed.createComponent(AdminEventosComponent); // Nome corrigido
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
