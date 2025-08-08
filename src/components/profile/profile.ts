import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { GlobalData } from '../../services';

@Component({
  selector: 'app-profile',
  imports: [TuiAvatar, TranslatePipe],
  templateUrl: './profile.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex grow',
  },
})
export class ProfileComponent {
  constructor(protected readonly globalService: GlobalData) {
    // Set the header title when this component is loaded
    this.globalService.headerTitle.set('Profile');
  }
}
