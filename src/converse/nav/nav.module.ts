import { NavStoreKey } from './nav-constants';
import { NavEffects } from './store/effects/effects';
import { reducer } from './store/reducers/reducers';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import {
	NavSearchInputComponent
} from './components/nav-search-input/nav-search-input.component';
import { ContactSearchService } from './services/contact-search.service';

@NgModule({
	declarations: [NavBarComponent, NavSearchInputComponent],
	imports: [
		CommonModule,
		MatToolbarModule,
		MatIconModule,
		RouterModule,
		MatButtonModule,
		MatMenuModule,
		MatFormFieldModule,
		MatInputModule,
		MatAutocompleteModule,
		ReactiveComponentModule,
		ReactiveFormsModule,
		AngularFireModule,
		StoreModule.forFeature(NavStoreKey, reducer),
		EffectsModule.forFeature([NavEffects])
	],
	providers: [ContactSearchService],
	exports: [NavBarComponent, NavSearchInputComponent]
})
export class NavModule {}
