import { Component } from '@angular/core';
import { SearchInputComponent } from '../../classes/search-input.component';

@Component({
	selector: 'nav-search-input',
	templateUrl: './nav-search-input.component.html',
	styleUrls: ['./nav-search-input.component.scss']
})
export class NavSearchInputComponent extends SearchInputComponent {}
