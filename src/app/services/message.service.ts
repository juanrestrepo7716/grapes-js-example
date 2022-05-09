import { Injectable, Component, Input } from '@angular/core';
import {
    DialogService,
    DialogRef,
    DialogCloseResult
} from '@progress/kendo-angular-dialog';
import { NotificationService } from '@progress/kendo-angular-notification';

@Component({
    selector: 'message-service-embed-html',
    template: `
        <div [innerHTML]="contents | safeHtml"></div>
    `
})
export class MessageServiceEmbedHtmlComponent {
    @Input() public contents: string;
}

@Injectable()
export class MessageService implements wy.IMessageService {
    private _progressDialog: DialogRef;
    private _messageDialog: DialogRef;
    private _confirmationDialog: DialogRef;

    constructor(
        private _dialogService: DialogService,
        private _notificationService: NotificationService) {
    }

    public log(text: string) {
        console.log(text);
    }

    public showProgress(title: string, text: string, pictureUrl: string = null) {
        if (this._progressDialog) {
            this.hideProgress(); // close existing
        }

        this._progressDialog = this._dialogService.open({
            title: title,
            content: MessageServiceEmbedHtmlComponent,
            actions: [
            ]
        });

        const c: MessageServiceEmbedHtmlComponent = this._progressDialog.content.instance;

        if (pictureUrl) {
            c.contents = `${text}<p></p><img style="max-width: 80vh; max-height: 50vh;" src="${pictureUrl}" />`;
        }
        else {
            c.contents = `${text} <i class="fas fa-circle-notch fa-spin" style="font-size: 20px;"></i>`;
        }
    }

    public hideProgress(): void {
        this._progressDialog.close();
    }

    public modalMessage(title: string, text: string) {
        this._messageDialog = this._dialogService.open({
            title: title,
            content: MessageServiceEmbedHtmlComponent,
            actions: [
                { text: 'OK', primary: true }
            ]
        });

        const c: MessageServiceEmbedHtmlComponent = this._messageDialog.content.instance;
        c.contents = text;
    }

    public modalConfirmation(title: string, text: string, handler: (confirmed: boolean) => any) {
        this._confirmationDialog = this._dialogService.open({
            title: title,
            content: text,
            actions: [
                { text: 'No' },
                { text: 'Yes', primary: true }
            ]
        });

        this._confirmationDialog.result.subscribe((result) => {
            if (result instanceof DialogCloseResult) {
                handler(false);
            } else {
                handler(true);
            }
        });
    }

    public notify(text: string, style: 'none' | 'success' | 'warning' | 'error' | 'info', icon: boolean = true, hideAfter: number = 5000) {
        this._notificationService.show({
            content: text,
            position: { horizontal: 'right', vertical: 'bottom' },
            type: { style: style, icon: icon },
            hideAfter: hideAfter
        });
    }
}
