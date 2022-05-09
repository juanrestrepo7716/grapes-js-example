import { Component, Input, OnInit, Inject, OnDestroy } from '@angular/core';
import { Message, User, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';

@Component({
    selector: 'wy-comment',
    templateUrl: './wy-comment.component.html',
    styleUrls: [
        './wy-comment.component.scss'
    ]
})
export class WyCommentComponent implements OnInit, OnDestroy {

    @Input() socialKey: string;

    public feed: Message[];

    public readonly user: User;

    protected autoRefreshProcessHandle: any;

    constructor(
        @Inject('ISocialService')
        protected scs: wy.ISocialService,

        @Inject('IUtilService')
        private _us: wy.IUtilService,
    ) {

        this.feed = [];

        const jwt = this._us.getValidatedJwt();

        if (jwt) {
            this.user = {
                id: jwt.username,
                name: jwt.username,
                avatarUrl: jwt.userImage
            };
        }
    }

    async ngOnInit() {
        this.refreshFeed();
        this.autoRefreshProcessHandle = setInterval(() => this.refreshFeed(), (10 * 1000));
    }

    ngOnDestroy() {
        if (this.autoRefreshProcessHandle) {
            clearInterval(this.autoRefreshProcessHandle);
        }
    }

    private async refreshFeed() {
        const initFeed = [];
        const comments = await this.scs.getComments(this.socialKey).toPromise();

        for (let comment of comments) {
            initFeed.push({
                author: {
                    id: comment.UserName,
                    name: comment.UserName,
                    avatarUrl: comment.UserAvatar || 'assets/img/avatars/default-avatar.png'
                },
                timestamp: comment.Created,
                text: comment.Text
            });
        }

        this.feed = initFeed;
    }

    public async sendMessage(e: SendMessageEvent) {
        await this.scs.sendComment(this.socialKey, {
            Text: e.message.text
        }).toPromise();

        this.feed = this.feed.concat({
            author: this.user,
            timestamp: new Date(),
            text: e.message.text
        });
    }
}
