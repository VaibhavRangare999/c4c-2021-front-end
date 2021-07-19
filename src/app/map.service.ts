import { Injectable } from '@angular/core';
import { } from 'google.maps';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  private url = 'https://c4c-2021-be-vaibhav.eu-gb.cf.appdomain.cloud/address';
  private url1 = 'https://c4c-2021-be-vaibhav.eu-gb.cf.appdomain.cloud/records';
  private url2 = 'https://c4c-2021-be-vaibhav.eu-gb.cf.appdomain.cloud/addrecord';
  private url3 = 'https://c4c-2021-be-vaibhav.eu-gb.cf.appdomain.cloud/sendmsg';

  // private url = "http://localhost:3000/address";
  // private url1 = "http://localhost:3000/records";
  // private url2 = "http://localhost:3000/addrecord";
  // private url3 = "http://localhost:3000/sendmsg";


  constructor(private http: HttpClient) { }

  addRecord(record: any): Observable<any> {
    const headers1 = new HttpHeaders();
    headers1.append('Content-Type', 'application/json');
    headers1.append('Accept', 'application/json');
    return this.http.post<any>(this.url2, record, { headers: headers1 });
  }

  getCoordinates(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resp => {
        resolve({
          len: resp.coords.longitude,
          lat: resp.coords.latitude,
        }
        );
        reject('Error');
      });
    });
  }

  getRecords(): Observable<any> {
    const headers1 = new HttpHeaders();
    headers1.append('Content-Type', 'application/json');
    headers1.append('Accept', 'application/json');
    return this.http.get<any>(this.url1);
  }

  getCoordinateAddress(lat: number, len: number): Observable<any> {
    const headers1 = new HttpHeaders();
    headers1.append('Content-Type', 'application/json');
    headers1.append('Accept', 'application/json');
    const heroData = {
      lat,
      len
    };
    return this.http.post<any>(this.url, heroData, { headers: headers1 });
  }

  sendMessage(record: any): Observable<any> {
    const headers1 = new HttpHeaders();
    headers1.append('Content-Type', 'application/json');
    headers1.append('Accept', 'application/json');
    return this.http.post<any>(this.url3, record, { headers: headers1 });
  }
}
