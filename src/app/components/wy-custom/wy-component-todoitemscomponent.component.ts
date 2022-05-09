import { Component, Inject, OnInit } from '@angular/core';
@Component({
    selector: 'wy-component-todoitemscomponent',
    templateUrl: './wy-component-todoitemscomponent.component.html',
    styleUrls: [
        './wy-component-todoitemscomponent.component.scss'
    ]
})
export class WyCustomComponent_TodoItemsComponent implements OnInit
{
    public todoItems: Todo.NgLayer.TodoItem[];
    public filter = 'Finished eq false';
    constructor(
        @Inject('IDataService')
        private ds: wy.IDataService) {
    }
    public async ngOnInit() {
        this.todoItems = await this.ds.fetch('default', '/TodoItems', this.filter, 'Owner').toPromise() as Todo.NgLayer.TodoItem[];
    }
}
