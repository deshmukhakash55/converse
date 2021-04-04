import { ContactStoreKey } from './contact-constants';
import { ContactEffects } from './store/effects/effects';
import { reducer } from './store/reducers/reducers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import {
	ContactListComponent
} from './components/contact-list/contact-list.component';
import { ContactComponent } from './components/contact/contact.component';
import { ContactBlockService } from './services/contact-block.service';
import { ContactsLoaderService } from './services/contacts-loader.service';
import {
	SingleContactLoaderService
} from './services/single-contact-loader.service';
import { HumanizePipe } from './pipes/humanize.pipe';

@NgModule({
	declarations: [ContactListComponent, ContactComponent, HumanizePipe],
	imports: [
		CommonModule,
		AngularFirestoreModule,
		MatMenuModule,
		MatIconModule,
		MatTooltipModule,
		MatButtonModule,
		EffectsModule.forFeature([ContactEffects]),
		StoreModule.forFeature(ContactStoreKey, reducer)
	],
	exports: [ContactListComponent, HumanizePipe],
	providers: [
		ContactsLoaderService,
		SingleContactLoaderService,
		ContactBlockService
	]
})
export class ContactsModule {}
