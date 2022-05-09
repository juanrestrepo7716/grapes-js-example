//::Bag::Components
import { NgModule } from '@angular/core';
import { DependenciesModule } from './dependencies-module';
import { WyDefaultModule } from './wy-default.module';
        import { WyMapComponent_MyMap } from '../components/wy-map/wy-component-mymap.component';
        import { WyCustomComponent_MyCustomComponent } from '../components/wy-custom/wy-component-mycustomcomponent.component';
        import { WyCustomComponent_DashboardComponent } from '../components/wy-custom/wy-component-dashboardcomponent.component';
        import { WyCustomComponent_ReportsComponent } from '../components/wy-custom/wy-component-reportscomponent.component';
        import { WyCustomComponent_TodoItemsComponent } from '../components/wy-custom/wy-component-todoitemscomponent.component';
        import { WyCustomComponent_MyCustomComponent2 } from '../components/wy-custom/wy-component-mycustomcomponent2.component';
@NgModule({
    imports: [
        DependenciesModule,
        WyDefaultModule,
    ],
    declarations: [
                WyMapComponent_MyMap,
                WyCustomComponent_MyCustomComponent,
                WyCustomComponent_DashboardComponent,
                WyCustomComponent_ReportsComponent,
                WyCustomComponent_TodoItemsComponent,
                WyCustomComponent_MyCustomComponent2,
    ],
    exports: [
                WyMapComponent_MyMap,
                WyCustomComponent_MyCustomComponent,
                WyCustomComponent_DashboardComponent,
                WyCustomComponent_ReportsComponent,
                WyCustomComponent_TodoItemsComponent,
                WyCustomComponent_MyCustomComponent2,
        DependenciesModule,
        WyDefaultModule,
    ]
})
export class WyCustomModule { }
