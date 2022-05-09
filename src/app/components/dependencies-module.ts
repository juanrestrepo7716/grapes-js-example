import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PortalModule } from '@angular/cdk/portal';

// Kendo
import { GridModule, PDFModule, ExcelModule } from '@progress/kendo-angular-grid';
import { PagerModule } from '@progress/kendo-angular-pager';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { LayoutModule } from '@progress/kendo-angular-layout';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ChartsModule } from '@progress/kendo-angular-charts';
import { PDFExportModule } from '@progress/kendo-angular-pdf-export';
import { SortableModule } from '@progress/kendo-angular-sortable';
import { GaugesModule } from '@progress/kendo-angular-gauges';
import { NotificationModule } from '@progress/kendo-angular-notification';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';
import { ToolBarModule } from '@progress/kendo-angular-toolbar';
import { EditorModule } from '@progress/kendo-angular-editor';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';

// Leaflet
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletDrawModule } from '@asymmetrik/ngx-leaflet-draw';

// pdfjs
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';

@NgModule({
    imports: [
        HttpClientModule,
        CommonModule,
        GridModule,
        PagerModule,
        PDFModule,
        ExcelModule,
        DialogModule,
        WindowModule,
        ButtonsModule,
        LayoutModule,
        DropDownsModule,
        InputsModule,
        DateInputsModule,
        UploadModule,
        ChartsModule,
        PDFExportModule,
        SortableModule,
        ToolBarModule,
        EditorModule,
        ChatModule,
        GaugesModule,
        NotificationModule,
        SchedulerModule,
        ReactiveFormsModule,
        FormsModule,
        PortalModule,
        RouterModule,

        LeafletModule,
        LeafletDrawModule,
        PdfJsViewerModule
    ],
    declarations: [
    ],
    exports: [
        HttpClientModule,
        CommonModule,
        GridModule,
        PagerModule,
        PDFModule,
        ExcelModule,
        DialogModule,
        WindowModule,
        ButtonsModule,
        LayoutModule,
        DropDownsModule,
        InputsModule,
        DateInputsModule,
        UploadModule,
        ChartsModule,
        PDFExportModule,
        SortableModule,
        ToolBarModule,
        EditorModule,
        ChatModule,
        GaugesModule,
        NotificationModule,
        SchedulerModule,
        ReactiveFormsModule,
        FormsModule,
        PortalModule,
        RouterModule,

        LeafletModule,
        LeafletDrawModule,
        PdfJsViewerModule
    ]
})
export class DependenciesModule { }
