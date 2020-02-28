import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  hostUrl: string = environment.host;

  constructor(private httpClient: HttpClient) {

  }


  getOverall(){
    return {minutes: 10};
  }

  getReportByOprAndDate(operator : string, date: string){
    return this.httpClient.get(this.hostUrl+"/cdrreport/"+operator+"/"+date);
  }

  getAllReportByOpr(operator : string){
    return this.httpClient.get(this.hostUrl+"/cdrreport/"+operator);
  }

  getAllCdrDisputeByOpr(operator : string){
    console.log("Called getAllCdrDisputeByOpr", this.hostUrl+"/cdrdispute/"+operator);
    return this.httpClient.get(this.hostUrl+"/cdrdispute/"+operator);
  }

  getAllCdrDisputeByOprAndDate(operator : string, date: string){
    console.log("Called getAllCdrDisputeByOprAndDate", this.hostUrl+"/cdrdispute/"+operator+"/"+date);
    return this.httpClient.get(this.hostUrl+"/cdrdispute/"+operator+"/"+date);
  }

  padZero(num, places){
    return num.padStart(places, '0');
  }

  getUniqueKeys(data, key){
    var values = data.map( d => d[key]); 
    // var filterArray = values.filter((item, pos) => values.indexOf(item)== pos);
    // console.log(filterArray);
    return values;
  }

  getInvokeAPI(operator : string,hashcode: string){
    this.httpClient.get(this.hostUrl+"/batch?op="+hashcode +"&name="+operator).subscribe(
      res => {
        console.log(res);
        alert("Invoke API for" + operator);
      },error => {
        alert("Invoke API for" + operator);
        console.error(error);
      }
    );
  }
}
