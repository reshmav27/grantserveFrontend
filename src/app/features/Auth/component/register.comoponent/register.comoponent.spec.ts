import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterComoponent } from './register.comoponent';

describe('RegisterComoponent', () => {
  let component: RegisterComoponent;
  let fixture: ComponentFixture<RegisterComoponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComoponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComoponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
