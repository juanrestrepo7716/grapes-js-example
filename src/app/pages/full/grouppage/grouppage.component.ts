//::Bag::All
import { Component, AfterViewInit, Inject, ViewChild, ElementRef } from '@angular/core';
@Component({
    selector: 'wy-grouppage-social',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPropertyGroup_Social">Social</h3>
    <kendo-tabstrip>
            <kendo-tabstrip-tab i18n-title="@@DisplayLabelPluralClass_SocialComment" title="Social Comments" [selected]="true">
                <ng-template kendoTabContent>
                    <wy-component-defaultgrid_socialcomment></wy-component-defaultgrid_socialcomment>
                </ng-template>
            </kendo-tabstrip-tab>
            <kendo-tabstrip-tab i18n-title="@@DisplayLabelPluralClass_SocialReaction" title="Social Reactions" [selected]="">
                <ng-template kendoTabContent>
                    <wy-component-defaultgrid_socialreaction></wy-component-defaultgrid_socialreaction>
                </ng-template>
            </kendo-tabstrip-tab>
    </kendo-tabstrip>
    <br><br>
</div>
`,
    styleUrls: ['./grouppage.component.scss']
})
export class GroupPageComponent_Social implements AfterViewInit {
    @ViewChild('title')
    title: ElementRef;
    constructor(
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) {
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
    }
}
