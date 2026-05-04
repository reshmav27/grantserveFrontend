import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProgramComponent } from './view-program.component';

describe('ViewProgramComponent', () => {
  let component: ViewProgramComponent;
  let fixture: ComponentFixture<ViewProgramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProgramComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProgramComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
