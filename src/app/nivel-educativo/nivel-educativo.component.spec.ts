import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NivelEducativoComponent } from './nivel-educativo.component';

describe('NivelEducativoComponent', () => {
  let component: NivelEducativoComponent;
  let fixture: ComponentFixture<NivelEducativoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NivelEducativoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NivelEducativoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
