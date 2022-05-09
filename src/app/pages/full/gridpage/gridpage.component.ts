//::Bag::All
import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Inject, Directive } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Directive()
export abstract class GridPageBaseComponent implements AfterViewInit, OnInit {
    public filter: string;
    @ViewChild('title')
    title: ElementRef;
    constructor(private route: ActivatedRoute,
        @Inject('IUtilService')
        private _us: wy.IUtilService
    ) { }
    ngOnInit() {
        const filter = this.route.snapshot.paramMap.get('filter');
        if (filter) {
            this.filter = filter;
        }
    }
    ngAfterViewInit() {
        this._us.setDocumentTitle(this.title.nativeElement.textContent);
    }
}
@Component({
    selector: 'wy-gridpage-socialcomment',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_SocialComment">Social Comments</h3>
    <wy-component-defaultgrid_socialcomment [filter]="filter"></wy-component-defaultgrid_socialcomment>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_SocialComment extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-socialreaction',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_SocialReaction">Social Reactions</h3>
    <wy-component-defaultgrid_socialreaction [filter]="filter"></wy-component-defaultgrid_socialreaction>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_SocialReaction extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-todoitem',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_TodoItem">Todo Items</h3>
    <wy-component-defaultgrid_todoitem [filter]="filter"></wy-component-defaultgrid_todoitem>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_TodoItem extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-project',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_Project">Projects</h3>
    <wy-component-defaultgrid_project [filter]="filter"></wy-component-defaultgrid_project>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_Project extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-user',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_User">Users</h3>
    <wy-component-defaultgrid_user [filter]="filter"></wy-component-defaultgrid_user>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_User extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-action',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_Action">Actions</h3>
    <wy-component-defaultgrid_action [filter]="filter"></wy-component-defaultgrid_action>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_Action extends GridPageBaseComponent {
}
@Component({
    selector: 'wy-gridpage-message',
    template: `
<div>
    <h3 class="wy-hdr" #title i18n="@@DisplayLabelPluralClass_Message">Messages</h3>
    <wy-component-defaultgrid_message [filter]="filter"></wy-component-defaultgrid_message>
    <br><br>
</div>
`,
    styleUrls: ['./gridpage.component.scss']
})
export class GridPageComponent_Message extends GridPageBaseComponent {
}
