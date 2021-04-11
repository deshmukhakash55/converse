import { environment, firebaseConfig } from 'src/environments/environment';
import { NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { AuthenticationModule } from './authentication/authentication.module';
import { ConverseRoutingModule } from './converse-routing.module';
import { ConverseComponent } from './converse.component';

const storeDevToolsModuleIfInDevelopment = !environment.production
	? StoreDevtoolsModule.instrument({ maxAge: 100 })
	: [];

@NgModule({
	declarations: [ConverseComponent],
	imports: [
		BrowserModule,
		ConverseRoutingModule,
		BrowserAnimationsModule,
		AuthenticationModule,
		AngularFireModule.initializeApp(firebaseConfig),
		StoreModule.forRoot({}),
		storeDevToolsModuleIfInDevelopment,
		EffectsModule.forRoot([])
	],
	providers: [],
	bootstrap: [ConverseComponent]
})
export class ConverseModule {}
