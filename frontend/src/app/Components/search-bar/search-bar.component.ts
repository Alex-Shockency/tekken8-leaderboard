import { Component } from '@angular/core';
import { MaterialModule } from '../../Shared/material.module';
import { RankingService } from '../../Services/ranking.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
    selector: 'app-search-bar',
    imports: [MaterialModule],
    templateUrl: './search-bar.component.html',
    styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  searchControl = new FormControl('');
  searchedPlayers: any[] = []
  isSearching = false;
  timeout: any;

  constructor(private rankingService: RankingService, private router: Router) {
  }

  searchPlayers() {
    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      if (this.searchControl.value) {
        this.isSearching = true;
        this.rankingService.searchPlayers(encodeURIComponent(this.searchControl.value)).subscribe(result => {
          this.searchedPlayers = result
          this.isSearching = false;
        })
      }
    }, 500);
  }

  onSearchOptionSelected(event: MatAutocompleteSelectedEvent) {
    this.router.navigate([`/playerInfo/${event.option.value._id}`])
  }

  getOptionText(option: any) {
    return option.name;
  }

  addDashestoTekkenId(input: string) {
    return input.match(new RegExp('.{1,4}', 'g'))?.join("-");
  }
}
