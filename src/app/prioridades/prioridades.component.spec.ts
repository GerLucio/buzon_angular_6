import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrioridadesComponent } from './prioridades.component';

describe('PrioridadesComponent', () => {
  let component: PrioridadesComponent;
  let fixture: ComponentFixture<PrioridadesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrioridadesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrioridadesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
