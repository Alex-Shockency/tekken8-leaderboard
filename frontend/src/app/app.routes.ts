import { Routes } from '@angular/router';
import { HomeComponent } from './Components/home/home.component';
import { PlayerInfoComponent } from './Components/player-info/player-info.component';
import { FaqComponent } from './Components/faq/faq.component';

export const routes: Routes = [ { 
    path: '', component: HomeComponent },
    { path: 'playerInfo/:tekkenId', component: PlayerInfoComponent },
    { path: 'faq', component: FaqComponent }
];
