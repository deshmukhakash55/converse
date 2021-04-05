import { Observable, Subscription } from 'rxjs';
import { Chat } from 'src/converse/chat/chat-types';
import {
	chats, loggedInUserProfileImagePath
} from 'src/converse/chat/store/selectors/selectors';
import { defaultProfileImagePath } from 'src/converse/converse-constants';
import { logOut } from '../../../authentication/store/actions/actions';
import {
	isLogoutSuccess
} from '../../../authentication/store/selectors/selectors';
import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

@Component({
	selector: 'nav-bar',
	templateUrl: './nav-bar.component.html',
	styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit, DoCheck, OnDestroy {
	public profilePictureSource: Observable<string>;
	public shouldShowSettingsMenuOption: boolean;
	public shouldShowHomeMenuOption: boolean;
	public shouldShowNavSearchInput: boolean;
	public defaultProfileImagePath = defaultProfileImagePath;
	private shouldShowNavSearchInputSubscription: Subscription;
	private logoutSubscription: Subscription;

	constructor(private store: Store, private router: Router) {}

	public ngOnInit(): void {
		this.initializeLogoutSubscription();
		this.loadLoggedInUserProfileImagePath();
	}

	private initializeLogoutSubscription(): void {
		this.logoutSubscription = this.store
			.select(isLogoutSuccess)
			.subscribe((isLogoutSuccessStatus: boolean) => {
				if (isLogoutSuccessStatus) {
					this.router.navigate(['landing']);
				}
			});
	}

	public ngDoCheck(): void {
		this.initializeMenuOptions();
		this.initializeShouldShowNavSearchInputSubscription();
	}

	private initializeMenuOptions(): void {
		this.shouldShowSettingsMenuOption = this.router.url !== '/settings';
		this.shouldShowHomeMenuOption = this.router.url !== '/chat';
	}

	private initializeShouldShowNavSearchInputSubscription(): void {
		this.shouldShowNavSearchInputSubscription = this.store
			.select(chats)
			.subscribe(
				(chatList: Chat[]) =>
					(this.shouldShowNavSearchInput =
						chatList.length > 0 && this.router.url === '/chat')
			);
	}

	private loadLoggedInUserProfileImagePath(): void {
		this.profilePictureSource = this.store.select(
			loggedInUserProfileImagePath
		);
	}

	public signOut(): void {
		this.store.dispatch(logOut());
	}

	public openChatSettings(event: Event): void {
		event.preventDefault();
		this.router.navigate(['settings']);
	}

	public openChatDashboard(event: Event): void {
		event.preventDefault();
		this.router.navigate(['chat']);
	}

	public ngOnDestroy(): void {
		this.shouldShowNavSearchInputSubscription.unsubscribe();
		this.logoutSubscription.unsubscribe();
	}
}
