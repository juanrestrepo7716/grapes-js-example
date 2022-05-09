//::Bag::Default
import { Pipe, Injectable, PipeTransform, NgModule, ElementRef, OnInit, Directive, Input, Renderer2, Inject } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { orderBy } from 'lodash';
import { WyBlobManagerComponent } from '../components/wy-blob-manager/wy-blob-manager.component';
import { WyBlobBoxComponent } from '../components/wy-blob-box/wy-blob-box.component';
import { WyPropertyEditorComponent } from '../components/wy-property-editor/wy-property-editor.component';
import { WyEnumFilterComponent } from '../components/wy-enum-filter/wy-enum-filter.component';
import { WyLookupFilterComponent } from '../components/wy-lookup-filter/wy-lookup-filter.component';
import { WyImageViewerComponent } from '../components/wy-image-viewer/wy-image-viewer.component';
import { WyQuickSearchComponent } from './wy-quick-search/wy-quick-search.component';
import { WyEntityDialogComponent } from './wy-entity-dialog/wy-entity-dialog.component';
import { WyEntityWindowComponent } from './wy-entity-window/wy-entity-window.component';
import { WyImagePickerComponent } from './wy-image-picker/wy-image-picker.component';
import { WyBlobPickerComponent } from './wy-blob-picker/wy-blob-picker.component';
import { WyBlobUploadComponent } from './wy-blob-upload/wy-blob-upload.component';
import { WyBlobViewerComponent } from './wy-blob-viewer/wy-blob-viewer.component';
import { WyEditorComponent } from './wy-editor/wy-editor.component';
import { WyCommentComponent } from './wy-comment/wy-comment.component';
import { WyGridDirective } from './wy-grid/wy-grid.directive';
import { WyGridColumnDirective } from './wy-grid/wy-grid-column.directive';
import { WyGridToolbarComponent } from './wy-grid/wy-grid-toolbar.component';
import { WyMonacoModule } from './wy-monaco.module';
import { DependenciesModule } from './dependencies-module';
import { WyMapPointEditorComponent } from './wy-map-point-editor/wy-map-point-editor.component';
import { WyMapPolygonEditorComponent } from './wy-map-polygon-editor/wy-map-polygon-editor.component';
// Pipe: orderBy
@Pipe({
    name: "orderBy"
})
export class OrderByPipe implements PipeTransform {
    transform(array: any, sortBy: string, order?: string): any[] {
        const sortOrder = order ? order : 'asc'; // setting default ascending order
        return orderBy(array, [sortBy], [sortOrder]);
    }
}
// Pipe: containsFilter
@Pipe({
    name: 'containsFilter'
})
@Injectable()
export class ContainsFilterPipe implements PipeTransform {
    transform(items: any[], field: string, value: string): any[] {
        if (!items) {
            return [];
        }
        return items.filter(it => it[field] != null && it[field].toLowerCase().indexOf(value.toLowerCase()) > -1);
    }
}
// Pipe: safeHtml
@Pipe({
    name: 'safeHtml',
    pure: false
})
@Injectable()
export class SafeHtmlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(content) {
        return this.sanitizer.bypassSecurityTrustHtml(content);
    }
}
// Pipe: safeStyle
@Pipe({
    name: 'safeStyle',
    pure: false
})
@Injectable()
export class SafeStylePipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(content) {
        return this.sanitizer.bypassSecurityTrustStyle(content);
    }
}
// Pipe: safeUrl
@Pipe({
    name: 'safeUrl',
    pure: false
})
@Injectable()
export class SafeUrlPipe implements PipeTransform {
    constructor(private sanitizer: DomSanitizer) {
    }
    transform(url) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }
}
// Directive: autofocus on a specific element
@Directive({
    selector: '[wyEnableAutofocus]'
})
export class EnableAutofocusDirective implements OnInit {
    constructor(private elementRef: ElementRef) {
    }
    ngOnInit(): void {
        if (this.elementRef && this.elementRef.nativeElement) {
            setTimeout(() => this.elementRef.nativeElement.focus());
        }
    }
}
// Directive: cache iframe src to prevent reloading the src on Angular render
@Directive({
    selector: 'iframe'
})
export class CachedSrcDirective {
    @Input()
    public get cachedSrc(): string {
        return this.elementRef.nativeElement.src;
    }
    public set cachedSrc(src: string) {
        if (this.elementRef.nativeElement.src != src) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'src', src);
        }
    }
    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) { }
}
// Directive: cache iframe srcDoc to prevent reloading the srcDoc on Angular render
@Directive({
    selector: 'iframe'
})
export class CachedSrcDocDirective {
    @Input()
    public get cachedSrcDoc(): string {
        return this.elementRef.nativeElement.srcDoc;
    }
    public set cachedSrcDoc(srcDoc: string) {
        if (this.elementRef.nativeElement.srcDoc != srcDoc) {
            this.renderer.setAttribute(this.elementRef.nativeElement, 'srcDoc', srcDoc);
        }
    }
    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) { }
}
// Directive: show/hide element based on authorization
@Directive({
    selector: '[wyIsFeatureEnabled]'
})
export class IsFeatureEnabledDirective implements OnInit {
    constructor(private elementRef: ElementRef,
        @Inject('IAuthorizationService')
        private _azs: wy.IAuthorizationService,
        @Inject('IUserSettingsService')
        private _usrSet: wy.IUserSettingsService
    ) { }
    @Input('wyIsFeatureEnabled') featureKey: string;
    ngOnInit(): void {
        if (this.elementRef && this.elementRef.nativeElement) {
            if (!this._azs.isFeatureEnabled(this.featureKey)) {
                this.elementRef.nativeElement.style.display = 'none';
                return;
            }
            if (!this._usrSet.isFeatureEnabled(this.featureKey)) {
                this.elementRef.nativeElement.style.display = 'none';
                return;
            }
        }
    }
}
@NgModule({
    imports: [
        WyMonacoModule,
        DependenciesModule,
    ],
    declarations: [
        WyBlobManagerComponent,
        WyBlobBoxComponent,
        WyPropertyEditorComponent,
        WyEnumFilterComponent,
        WyLookupFilterComponent,
        WyImageViewerComponent,
        WyQuickSearchComponent,
        WyEntityDialogComponent,
        WyEntityWindowComponent,
        WyBlobPickerComponent,
        WyImagePickerComponent,
        WyBlobUploadComponent,
        WyBlobViewerComponent,
        WyEditorComponent,
        WyMapPointEditorComponent,
        WyMapPolygonEditorComponent,
        WyCommentComponent,
        OrderByPipe,
        ContainsFilterPipe,
        SafeHtmlPipe,
        SafeUrlPipe,
        SafeStylePipe,
        EnableAutofocusDirective,
        CachedSrcDirective,
        CachedSrcDocDirective,
        IsFeatureEnabledDirective,
        WyGridDirective,
        WyGridColumnDirective,
        WyGridToolbarComponent,
    ],
    exports: [
        WyBlobManagerComponent,
        WyBlobBoxComponent,
        WyPropertyEditorComponent,
        WyEnumFilterComponent,
        WyLookupFilterComponent,
        WyImageViewerComponent,
        WyQuickSearchComponent,
        WyEntityDialogComponent,
        WyEntityWindowComponent,
        WyBlobPickerComponent,
        WyImagePickerComponent,
        WyBlobUploadComponent,
        WyBlobViewerComponent,
        WyEditorComponent,
        WyMapPointEditorComponent,
        WyMapPolygonEditorComponent,
        WyCommentComponent,
        WyMonacoModule,
        OrderByPipe,
        ContainsFilterPipe,
        SafeHtmlPipe,
        SafeUrlPipe,
        SafeStylePipe,
        EnableAutofocusDirective,
        CachedSrcDirective,
        CachedSrcDocDirective,
        IsFeatureEnabledDirective,
        WyGridDirective,
        WyGridColumnDirective,
        WyGridToolbarComponent,
        DependenciesModule,
    ]
})
export class WyBaseModule { }
