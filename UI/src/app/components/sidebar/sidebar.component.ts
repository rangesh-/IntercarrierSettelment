import { Component, OnInit } from '@angular/core';

declare const $: any;
declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    { path: '/dashboard', title: 'Dashboard',  icon: 'dashboard', class: '' },
    { path: '/user-profile', title: 'CDR Batch Job',  icon:'person', class: '' },
    { path: '/table-list', title: 'CDR Dispute',  icon:'content_paste', class: '' }
    // { path: '/typography', title: 'Typography',  icon:'library_books', class: '' }
    // { path: '/icons', title: 'Icons',  icon:'bubble_chart', class: '' },
    // { path: '/maps', title: 'Maps',  icon:'location_on', class: '' },
    // { path: '/notifications', title: 'Notifications',  icon:'notifications', class: '' },
    // { path: '/upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: 'active-pro' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  oprName: string;

  constructor() { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);

    if(localStorage.getItem("operator") === null){
      this.oprName = "OP_A";
      localStorage.setItem("operator", "OP_A");
    }else{
      this.oprName =localStorage.getItem("operator");
    }
  }
  isMobileMenu() {
      if ($(window).width() > 991) {
          return false;
      }
      return true;
  };

  changeOpr(operator){
    this.oprName = operator;
    console.log(this.oprName);
    localStorage.setItem("operator", this.oprName);
    window.location.reload();
  }
}
