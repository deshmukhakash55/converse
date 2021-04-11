import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
	ContactListComponent
} from './components/contact-list/contact-list.component';
import {
	ContactSearchInputComponent
} from './components/contact-search-input/contact-search-input.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactBlockService } from './services/contact-block.service';
import { ContactsLoaderService } from './services/contacts-loader.service';
import {
	SingleContactLoaderService
} from './services/single-contact-loader.service';
import { HumanizePipe } from './pipes/humanize.pipe';
import { ContactEffects } from './store/effects/effects';
import { reducer } from './store/reducers/reducers';
import { ContactStoreKey } from './contact-constants';

@NgModule({
	declarations: [
		ContactListComponent,
		ContactComponent,
		HumanizePipe,
		ContactSearchInputComponent
	],
	imports: [
		CommonModule,
		AngularFirestoreModule,
		MatAutocompleteModule,
		MatMenuModule,
		MatIconModule,
		MatTooltipModule,
		MatButtonModule,
		EffectsModule.forFeature([ContactEffects]),
		ReactiveComponentModule,
		ReactiveFormsModule,
		StoreModule.forFeature(ContactStoreKey, reducer)
	],
	exports: [ContactListComponent, ContactSearchInputComponent, HumanizePipe],
	providers: [
		ContactsLoaderService,
		SingleContactLoaderService,
		ContactBlockService
	]
})
export class ContactsModule {}
