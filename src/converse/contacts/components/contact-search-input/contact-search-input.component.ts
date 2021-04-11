import { Component } from '@angular/core';
import {
	SearchInputComponent
} from '../../../nav/classes/search-input.component';

@Component({
	selector: 'contact-search-input',
	templateUrl: './contact-search-input.component.html',
	styleUrls: ['./contact-search-input.component.scss']
})
export class ContactSearchInputComponent extends SearchInputComponent {}
