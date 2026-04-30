import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgramListComponent } from './program-list.component';

describe('ProgramListComponent', () => {
  let component: ProgramListComponent;
  let fixture: ComponentFixture<ProgramListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgramListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProgramListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
