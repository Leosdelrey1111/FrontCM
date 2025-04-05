import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitaAceptadaComponent } from './cita-aceptada.component';

describe('CitaAceptadaComponent', () => {
  let component: CitaAceptadaComponent;
  let fixture: ComponentFixture<CitaAceptadaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CitaAceptadaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitaAceptadaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
