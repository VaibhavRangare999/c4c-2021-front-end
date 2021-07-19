import { Component, OnInit } from '@angular/core';
import { VERSION } from '@angular/core';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css']
})
export class AboutusComponent implements OnInit {

  public ver = VERSION.full;

  ngOnInit(): void {

  }
}
