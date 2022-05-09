import { Component } from '@angular/core';
@Component({
    selector: 'wy-component-mycustomcomponent',
    templateUrl: './wy-component-mycustomcomponent.component.html',
    styleUrls: [
        './wy-component-mycustomcomponent.component.scss'
    ]
})
export class WyCustomComponent_MyCustomComponent
{
    public test() {
        var item = new Todo.NgLayer.TodoItem();
        item.Name = 'test123';
    }
}
