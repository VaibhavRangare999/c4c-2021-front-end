import { Component, OnInit } from '@angular/core';
import { MapService } from '../map.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  constructor(private mapservice: MapService) { }
  lat = 0;
  lng = 0;
  address = '';

  phone: number;
  msgResult = '';

  emptyMarker = {
    latitude: 21.81038,
    longitude: 80.09,
    icon: {
      url: './assets/img/water-png-717.png',
      scaledSize: {
        width: 30,
        height: 30
      }
    },
    label: {
      color: 'blue',
      fontWeight: 'normal',
      text: '_',
      zIndex: -1,
      fontSize: '35px',
    },
    id: 1,
    description: 'water not available at',
    location: '',
    availability: '',
    quality: '',
    type: ''
  };

  markers = [];

  ngOnInit(): void {
    this.displayData();
  }
  /*
  This function performs following on page load.
  1. Get map coordinates for user
  2. Get address for the user based on the coordinates
  3. Disply nearby water resource in the map
  */
  displayData(): void {
    this.getAndInitializeCoordinates(this.mapservice.getCoordinates())
      .then((resp) => this.getSelectedLocationAddress(resp.lat, resp.len))
      .then((data) => this.addUserLocation(data.lat, data.len, data.add))
      .then(() => this.getnearbyRecords(this.lat, this.lng));
  }

  /*
  When user clicks on map, this function places user in that location,
  And shows nearby water resources.
  */
  displayDataOnClick($event: any): void {
    this.lat = $event.coords.lat;
    this.lng = $event.coords.lng;
    document.getElementById('loading1').style.display = 'block';
    this.getSelectedLocationAddress($event.coords.lat, $event.coords.lng)
      .then((data) => this.clearMarker(data.lat, data.len, data.add))
      .then((data) => this.addUserLocation(data.lat, data.len, data.add))
      .then(() => this.getnearbyRecords(this.lat, this.lng));
  }

  getSelectedLocationAddress(lat: number, len: number): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      let address1: string;
      let lat1: number;
      let len1: number;
      this.mapservice.getCoordinateAddress(lat, len).subscribe(
        (data) => {
          address1 = data.body.results[1].formatted_address;
          lat1 = lat;
          len1 = len;
          document.getElementById('loading').style.display = 'none';
          document.getElementById('angularmap').style.display = 'block';
          document.getElementById('sendmsg').style.display = 'block';

          setTimeout(
            () =>
              resolve(
                {
                  add: address1,
                  lat: lat1,
                  len: len1
                }
              ),
            1000);

        }
      );
    });
    return promise;
  }

  /*
  Following two functions shows the information window.
  */
  onMouseOver(infoWindow: any, $event: any): void {
    infoWindow.open();
  }

  onMouseOut(infoWindow: any, $event: MouseEvent): void {
    infoWindow.close();
  }

  clearMarker(lat: number, len: number, address: string): Promise<any> {
    const promise = new Promise((resolve, reject) => {
      this.markers = [];
      let address1;
      let lat1;
      let len1;
      address1 = address;
      lat1 = lat;
      len1 = len;
      setTimeout(
        () =>
          resolve(
            {
              add: address1,
              lat: lat1,
              len: len1
            }
          ),
        1000);
    });
    return promise;
  }

  async getAndInitializeCoordinates(func1: any): Promise<any> {
    const a = await func1;
    this.lat = a.lat;
    this.lng = a.len;
    return a;
  }

  getSelectedLocationAddress1(lat: any, len: any, empty: any): void {
    this.mapservice.getCoordinateAddress(lat, len).subscribe(
      (data) => {
        empty.location = data.body.results[1].formatted_address;
      },
      (error) => { console.log(error); }
    );
  }

  /*
  This function takes latitude and longitude as input,
  and displays nearby water resources.
  */
  getnearbyRecords(lat: number, len: number): void {
    let empty;
    this.mapservice.getRecords().subscribe(
      (data) => {
        data.filter((element) => {
          return this.performDataFilter(element, lat, len);
        }).forEach((data1) => {
          empty = JSON.parse(JSON.stringify(this.emptyMarker));
          empty.description = data1.Description;
          empty.latitude = data1.Latitude;
          empty.longitude = data1.Longitude;
          empty.availability = data1.Availability;
          empty.quality = data1.Quality;
          empty.type = data1.Type;
          this.getSelectedLocationAddress1(data1.Latitude, data1.Longitude, empty);
          this.markers.push(empty);
        });
      }
    );
  }

  performDataFilter(element: any, lat: number, len: number): boolean {
    let result = false;
    const result1 = Math.abs(element.Latitude - lat);
    const result2 = Math.abs(element.Longitude - len);
    /*
      latitudeFilterOffset and longitudeFilterOffset
      are used as filtering criteria for nearby water resource.
    */
    if (result1 > .5 || result2 > .5) {
      result = false;
    }
    else {
      result = true;
    }
    return result;
  }


  addUserLocation(lat: number, len: number, address: string): void {
    const empty = JSON.parse(JSON.stringify(this.emptyMarker));
    empty.latitude = lat;
    empty.longitude = len;
    empty.description = 'You are here';
    empty.availability = 'NA';
    empty.quality = 'NA';
    empty.icon.url = './assets/img/human-icon-png-1906.png';
    this.address = address;
    empty.location = this.address;
    this.markers.push(empty);
    document.getElementById('loading1').style.display = 'none';
  }

  /*
  This function sends message to mobile phone.
  Message contains information about the water resources in nearby area.
  */
  angSendMessage(): void {
    const msg = {
      phone: this.phone,
      msg: this.markers
    };
    this.mapservice.sendMessage(msg).subscribe(
      data => {
        this.msgResult = data.result;
      }
    );
  }

}
