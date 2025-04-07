import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StateLeaderboardComponent } from './state-leaderboard.component';

describe('StateLeaderboardComponent', () => {
  let component: StateLeaderboardComponent;
  let fixture: ComponentFixture<StateLeaderboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateLeaderboardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(StateLeaderboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
