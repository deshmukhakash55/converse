import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { ReactiveComponentModule } from '@ngrx/component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { LandingComponent } from './components/landing/landing.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import {
	VerificationMailSentModalComponent
} from './components/verification-mail-sent-modal/verification-mail-sent-modal.component';
import { AuthenticationService } from './services/authentication.service';
import { ContactLoaderService } from './services/contact-loader.service';
import { ContactSaverService } from './services/contact-saver.service';
import { AuthenticationEffects } from './store/effects/effects';
import { reducer } from './store/reducers/reducers';
import { AuthStoreKey } from './auth-constants';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatButtonModule,
		MatCardModule,
		MatTabsModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatDialogModule,
		AngularFireAuthModule,
		ReactiveComponentModule,
		EffectsModule.forFeature([AuthenticationEffects]),
		StoreModule.forFeature(AuthStoreKey, reducer)
	],
	declarations: [
		LandingComponent,
		LoginComponent,
		RegisterComponent,
		VerificationMailSentModalComponent
	],
	providers: [
		AuthenticationService,
		ContactSaverService,
		ContactLoaderService
	],
	entryComponents: [VerificationMailSentModalComponent],
	exports: [LandingComponent]
})
export class AuthenticationModule {}
