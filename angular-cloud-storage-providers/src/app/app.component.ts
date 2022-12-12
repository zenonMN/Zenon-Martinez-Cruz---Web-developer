import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService } from '@azure/msal-angular';
import { InteractionStatus } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { ProvidersService } from './services/providers.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private readonly _destroying$ = new Subject<void>();
  title = 'angular-cloud-storage-providers';

  constructor(private broadcastService: MsalBroadcastService, private providersService: ProvidersService) { }

  ngOnInit() {
    this.broadcastService.inProgress$
    .pipe(
      filter((status: InteractionStatus) => status === InteractionStatus.None),
      takeUntil(this._destroying$)
    )
    .subscribe(() => {
      this.providersService.setLoginDisplay();
    })
  }

  ngOnDestroy(): void {
    this._destroying$.next(undefined);
    this._destroying$.complete();
  }
}
