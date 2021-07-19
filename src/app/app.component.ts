import { Component } from '@angular/core';

declare const enableVenobox: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'call4code2021';
  enableVbox(): void {
    enableVenobox();
  }

}
