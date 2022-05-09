import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class EventService {
    public userAuthenticated: BehaviorSubject<wy.Jwt> = new BehaviorSubject<wy.Jwt>(null);
}
