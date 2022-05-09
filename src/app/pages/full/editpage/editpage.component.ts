//::Bag::All
import { Component, ViewChild, AfterViewInit, OnInit, Inject, ElementRef, Directive, AfterContentInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WyOneEntityBaseComponent } from '../../../components/wy-one-entity/wy-one-entity-base.component';
@Directive()
export abstract class EditPageBaseComponent implements AfterViewInit, OnInit {
    public isBusy: boolean = true;
    @ViewChild('title')
    title: ElementRef;
    @ViewChild('oneEntity')
    oneEntityComponent: WyOneEntityBaseComponent;
    constructor(private route: ActivatedRoute,
        @Inject('IUtilService')
        private _us: wy.IUtilService,
        private cd: ChangeDetectorRef
    ) { }
    ngOnInit() {
    }
    async ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
        let entityLoaded = false;
        const entityId = this.route.snapshot.paramMap.get('id');
        if (entityId == 'first') {
            // TODO: don't call component directly, use property
            entityLoaded = await this.oneEntityComponent.loadFirstEntity();
        }
        else if (this._us.isValidEntityId(entityId)) {
            // TODO: don't call component directly, use property
            entityLoaded = await this.oneEntityComponent.loadEntityById(entityId);
        }
        if (entityLoaded) {
            this.isBusy = false;
            this.cd.detectChanges();
        }
    }
    public cancelEntityHandler() {
        this.oneEntityComponent.reload();
    }
    public saveEntityHandler() {
        this.isBusy = true;
        this.oneEntityComponent.saveEntity((success, entity) => {
            this.isBusy = false;
        });
    }
}
@Component({
    selector: 'wy-editpage-socialcomment',
    template: `
<div class="wy-editpage wy-editpage-socialcomment">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_SocialComment">Social Comment</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_socialcomment #oneEntity>
    </wy-component-defaultoneentity_socialcomment>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_SocialComment extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-socialreaction',
    template: `
<div class="wy-editpage wy-editpage-socialreaction">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_SocialReaction">Social Reaction</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_socialreaction #oneEntity>
    </wy-component-defaultoneentity_socialreaction>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_SocialReaction extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-todoitem',
    template: `
<div class="wy-editpage wy-editpage-todoitem">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_TodoItem">Todo Item</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_todoitem #oneEntity>
    </wy-component-defaultoneentity_todoitem>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_TodoItem extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-project',
    template: `
<div class="wy-editpage wy-editpage-project">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_Project">Project</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_project #oneEntity>
    </wy-component-defaultoneentity_project>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_Project extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-user',
    template: `
<div class="wy-editpage wy-editpage-user">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_User">User</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_user #oneEntity>
    </wy-component-defaultoneentity_user>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_User extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-action',
    template: `
<div class="wy-editpage wy-editpage-action">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_Action">Action</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_action #oneEntity>
    </wy-component-defaultoneentity_action>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_Action extends EditPageBaseComponent {
}
@Component({
    selector: 'wy-editpage-message',
    template: `
<div class="wy-editpage wy-editpage-message">
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelClass_Message">Message</h3>
    <p *ngIf="isBusy" i18n="@@PleaseWait">Please wait...</p>
    <wy-component-defaultoneentity_message #oneEntity>
    </wy-component-defaultoneentity_message>
    <p></p>
    <div class="wy-entity-button-bar">
        <button class="wy-button wy-cls-cancel" [disabled]="isBusy" kendoButton (click)="cancelEntityHandler()">
            <i class="fas fa-ban"></i>
            <span class="wy-label-indent" i18n="@@Cancel">Cancel</span>
        </button>
        <button class="wy-button wy-cls-save" [disabled]="isBusy" kendoButton (click)="saveEntityHandler()">
            <i class="fas fa-check wy-green"></i>
            <span class="wy-label-indent" i18n="@@Save">Save</span>
        </button>
    </div>
    <br><br>
</div>
`,
    styleUrls: ['./editpage.component.scss']
})
export class EditPageComponent_Message extends EditPageBaseComponent {
}
