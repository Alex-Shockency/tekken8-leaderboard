import { Routes } from '@angular/router';
import { FaqComponent } from './Components/faq/faq.component';
import { HomeComponent } from './Components/home/home.component';
import { PlayerInfoComponent } from './Components/player-info/player-info.component';
import { StateLeaderboardComponent } from './Components/state-leaderboard/state-leaderboard.component';
import { UserProfileComponent } from './Components/user-profile/user-profile.component';
import { AppAuthGuard } from './Utils/auth.guard';

export const routes: Routes = [
  {
    path: 'leaderboard/:stateId',
    component: StateLeaderboardComponent,
  },
  { path: '', component: HomeComponent },
  { path: 'playerInfo/:tekkenId', component: PlayerInfoComponent },
  { path: 'faq', component: FaqComponent },
  {
    path: 'user',
    component: UserProfileComponent,
    canActivate: [AppAuthGuard],
  },
];
