import { Subscription } from 'rxjs';
import {
	isLoginSuccess
} from 'src/converse/authentication/store/selectors/selectors';
import {
	AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Injector,
	OnDestroy, OnInit, ViewChild
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import {
	ChatDashboardContentComponent
} from '../chat-dashboard-content/chat-dashboard-content.component';
import {
	ChatSettingsComponent
} from '../chat-settings/chat-settings.component';

@Component({
	selector: 'chat-dashboard',
	templateUrl: './chat-dashboard.component.html',
	styleUrls: ['./chat-dashboard.component.scss']
})
export class ChatDashboardComponent
	implements OnInit, AfterViewInit, OnDestroy {
	@ViewChild(MatDrawer) public sideDrawer: MatDrawer;
	@ViewChild(RouterOutlet) public routerOutlet: RouterOutlet;
	private isLoginSuccessSubscription: Subscription;
	constructor(
		private store: Store,
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector,
		private activatedRoute: ActivatedRoute
	) {}

	public ngOnInit(): void {
		this.isLoginSuccessSubscription = this.store
			.select(isLoginSuccess)
			.subscribe((loginStatus: boolean) => {
				if (!loginStatus) {
					this.router.navigate(['landing']);
				}
			});
	}

	public ngAfterViewInit(): void {
		if (this.router.url === '/chat') {
			const chatDashboardContentComponentRef = this.createDashboardContentComponent();
			setTimeout(() =>
				this.routerOutlet.attach(
					chatDashboardContentComponentRef,
					this.activatedRoute
				)
			);
		} else if (this.router.url === '/settings') {
			const chatSettingsComponentRef = this.createChatSettingsComponent();
			setTimeout(() =>
				this.routerOutlet.attach(
					chatSettingsComponentRef,
					this.activatedRoute
				)
			);
		}
	}

	private createDashboardContentComponent(): ComponentRef<ChatDashboardContentComponent> {
		return this.componentFactoryResolver
			.resolveComponentFactory(ChatDashboardContentComponent)
			.create(this.injector);
	}

	private createChatSettingsComponent(): ComponentRef<ChatSettingsComponent> {
		return this.componentFactoryResolver
			.resolveComponentFactory(ChatSettingsComponent)
			.create(this.injector);
	}

	public ngOnDestroy(): void {
		this.isLoginSuccessSubscription.unsubscribe();
	}
}
