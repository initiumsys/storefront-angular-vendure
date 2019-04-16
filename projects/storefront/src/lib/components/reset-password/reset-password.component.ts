import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ResetPassword } from '../../generated-types';
import { DataService } from '../../providers/data.service';
import { StateService } from '../../providers/state.service';

import { RESET_PASSWORD } from './reset-password.graphql';

@Component({
    selector: 'vsf-reset-password',
    templateUrl: './reset-password.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent {
    password = '';
    error = '';
    private readonly token: string | undefined;

    constructor(private dataService: DataService,
                private stateService: StateService,
                private route: ActivatedRoute,
                private router: Router) {
        this.token = this.route.snapshot.queryParamMap.get('token') || undefined;
        if (!this.token) {
            this.error = 'No token provided! Cannot reset password.';
        }
    }

    confirmPasswordReset() {
        if (this.token) {
            this.dataService.mutate<ResetPassword.Mutation, ResetPassword.Variables>(RESET_PASSWORD, {
                token: this.token,
                password: this.password,
            })
                .subscribe(
                    () => {
                        this.stateService.setState('signedIn', true);
                        this.router.navigate(['/account']);
                    },
                );
        }
    }
}