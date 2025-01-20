import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { PlayerInfoComponent } from './Components/player-info/player-info.component';
import { FaqComponent } from './Components/faq/faq.component';
import { InteractiveMapComponent } from './Components/interactive-map/interactive-map.component';
import { StateLeaderboardComponent } from './Components/state-leaderboard/state-leaderboard.component';

export const routes: Routes = [ { 
    path: 'leaderboard/:stateId', component: StateLeaderboardComponent },
    {path: '', component: HomeComponent },
    { path: 'playerInfo/:tekkenId', component: PlayerInfoComponent },
    { path: 'faq', component: FaqComponent }
];
