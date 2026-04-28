import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramCardComponent } from './program-card.component';

describe('ProgramCardComponent', () => {
  let component: ProgramCardComponent;
  let fixture: ComponentFixture<ProgramCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramCardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
