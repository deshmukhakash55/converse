import {
	AfterViewInit, Component, ComponentFactoryResolver, ComponentRef, Injector,
	ViewChild
} from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
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
export class ChatDashboardComponent implements AfterViewInit {
	@ViewChild(RouterOutlet) public routerOutlet: RouterOutlet;
	constructor(
		private router: Router,
		private componentFactoryResolver: ComponentFactoryResolver,
		private injector: Injector,
		private activatedRoute: ActivatedRoute
	) {}

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
}
