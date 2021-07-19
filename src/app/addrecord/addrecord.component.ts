import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';
import { WaterResource } from '../water-resource';
@Component({
  selector: 'app-addrecord',
  templateUrl: './addrecord.component.html',
  styleUrls: ['./addrecord.component.css']
})
export class AddrecordComponent implements OnInit {
  constructor(private mapservice: MapService) { }
  WaterResource = new WaterResource(0.0, 0.0, '', '', '', '');
  result = '';
  ngOnInit(): void {
  }
  onSubmit(): void {
    this.mapservice.addRecord(this.WaterResource).subscribe(
      (data) => {
        this.result = data.result;
      },
      (error) => { alert('error: ' + JSON.stringify(error)); }
    );
  }
}
