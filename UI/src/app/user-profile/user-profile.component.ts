import { Component, OnInit } from '@angular/core';

import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

  operatorName: string;
  hashCode :string;

  constructor(private apiCall : ApiService) { }

  ngOnInit() {
  }

  invokeAPI(){
    console.log(this.operatorName, this.hashCode);
    this.apiCall.getInvokeAPI(this.operatorName, this.hashCode);
  }

}
