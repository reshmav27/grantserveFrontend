import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManagerAppCard } from './manager-app-card';

describe('ManagerAppCard', () => {
  let component: ManagerAppCard;
  let fixture: ComponentFixture<ManagerAppCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManagerAppCard],
    }).compileComponents();

    fixture = TestBed.createComponent(ManagerAppCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
