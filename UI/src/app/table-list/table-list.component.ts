import { Component, OnInit } from '@angular/core';

import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.css']
})
export class TableListComponent implements OnInit {

  cdrs: any;
  operator : string;

  constructor(private apiService: ApiService) {
    this.cdrs = [];
    if(localStorage.getItem("operator") === null){
      localStorage.setItem("operator", "OP_A");
    }
    
   }

  ngOnInit() {
    let today = new Date();
    let date = this.apiService.padZero((today.getMonth()+1)+"",2)+"-"+(today.getDate()) +"-"+today.getFullYear();
    this.operator = localStorage.getItem("operator");
    this.apiService.getAllCdrDisputeByOprAndDate(this.operator,date).subscribe(res =>{
      this.cdrs = res['docs'];
    }, error => {
      console.log("Error");
    })
  }

}
