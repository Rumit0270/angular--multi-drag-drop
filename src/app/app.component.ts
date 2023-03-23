import { Component } from '@angular/core';
import { ItemsMovedEvent } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
  done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

  todoColor = '#B46060';
  doneColor = '#5D9C59';

  restictedUsers = [
    { id: 1, name: 'John' },
    { id: 2, name: 'Jane' },
    { id: 3, name: 'Mark' },
    { id: 4, name: 'Adam' },
  ];

  unrestrictedUsers = [
    { id: 5, name: 'Lee' },
    { id: 6, name: 'Kate' },
    { id: 7, name: 'Bob' },
  ];

  logValues() {
    console.log('Todo list: ', this.todo);
    console.log('Done list: ', this.done);
  }

  logUsers() {
    console.log('Restricted', this.restictedUsers);
    console.log('Unrestricted', this.unrestrictedUsers);
  }

  logEvent(event: ItemsMovedEvent<string>) {
    console.log(event);
  }
}
