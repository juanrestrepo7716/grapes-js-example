//::Bag::Default
import { WyBaseComponent } from '../wy-base.component';
import { Input, Inject, OnInit, Directive } from '@angular/core';
@Directive()
export abstract class WySocialBaseComponent extends WyBaseComponent implements OnInit {
    @Input() socialKey: string;
    reaction: wy.IReaction = {
        ReactionType: 0,
        Motivation: ''
    };
    constructor(
        @Inject('ISocialService')
        protected scs: wy.ISocialService) {
        super();
    }
    async ngOnInit() {
        this.reaction = await this.scs.getReaction(this.socialKey).toPromise();
    }
    async triggerReaction(event: MouseEvent, reactionType: number) {
        if (event.x > 0 && event.y > 0) { // this ignores keyboard enter events
            const reaction: wy.IReaction = {
                ReactionType: reactionType,
                Motivation: this.reaction?.Motivation
            };
            this.reaction = await this.scs.setReaction(this.socialKey, reaction).toPromise();
        }
    }
    async triggerMotivation(event: any) {
        const motivation = event.target.value;
        const reaction: wy.IReaction = {
            ReactionType: this.reaction?.ReactionType,
            Motivation: motivation
        };
        this.reaction = await this.scs.setReaction(this.socialKey, reaction).toPromise();
    }
}
