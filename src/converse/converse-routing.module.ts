import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { NgModule } from '@angular/core';
import { AngularFireAuthGuard, emailVerified } from '@angular/fire/auth-guard';
import { RouterModule, Routes } from '@angular/router';
import {
	LandingComponent
} from './authentication/components/landing/landing.component';

const redirectUnauthorizeTo = (redirect) =>
	pipe(
		emailVerified,
		map((isEmailVerified: boolean) => isEmailVerified || redirect)
	);
const redirectAuthorizeTo = (redirect) =>
	pipe(
		emailVerified,
		map((isEmailVerified: boolean) => {
			return (isEmailVerified && redirect) || true;
		})
	);

const redirectAuthorizeToChatDashboard = () => redirectAuthorizeTo(['chat']);
const redirectUnauthorizeToLanding = () => redirectUnauthorizeTo(['']);

const routes: Routes = [
	{
		path: 'landing',
		component: LandingComponent,
		pathMatch: 'full',
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectAuthorizeToChatDashboard }
	},
	{
		path: 'chat',
		loadChildren: () =>
			import('./chat/chat.module').then((m) => m.ChatModule),
		pathMatch: 'full',
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizeToLanding }
	},
	{
		path: 'settings',
		loadChildren: () =>
			import('./chat/chat.module').then((m) => m.ChatModule),
		pathMatch: 'full',
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectUnauthorizeToLanding }
	},
	{
		path: '',
		redirectTo: 'landing',
		pathMatch: 'full',
		canActivate: [AngularFireAuthGuard],
		data: { authGuardPipe: redirectAuthorizeToChatDashboard }
	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class ConverseRoutingModule {}
