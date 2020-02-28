import { Component, OnInit } from '@angular/core';
import * as Chartist from 'chartist';

import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dailymetrics : any;
  operator: string;

  constructor(private apiCall : ApiService) { 
    if(localStorage.getItem("operator") === null){
      localStorage.setItem("operator", "OP_A");
    }
    this.dailymetrics = {
      minutes: 0,
      revenue: 0,
      issues_count: 0,
      cdr_count:0,
      sms_count: 0,
      voice_count: 0
    };
  }
  startAnimationForLineChart(chart){
      let seq: any, delays: any, durations: any;
      seq = 0;
      delays = 80;
      durations = 500;

      chart.on('draw', function(data) {
        if(data.type === 'line' || data.type === 'area') {
          data.element.animate({
            d: {
              begin: 600,
              dur: 700,
              from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
              to: data.path.clone().stringify(),
              easing: Chartist.Svg.Easing.easeOutQuint
            }
          });
        } else if(data.type === 'point') {
              seq++;
              data.element.animate({
                opacity: {
                  begin: seq * delays,
                  dur: durations,
                  from: 0,
                  to: 1,
                  easing: 'ease'
                }
              });
          }
      });

      seq = 0;
  };
  startAnimationForBarChart(chart){
      let seq2: any, delays2: any, durations2: any;

      seq2 = 0;
      delays2 = 80;
      durations2 = 500;
      chart.on('draw', function(data) {
        if(data.type === 'bar'){
            seq2++;
            data.element.animate({
              opacity: {
                begin: seq2 * delays2,
                dur: durations2,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
      });

      seq2 = 0;
  };
  ngOnInit() {
      /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */
      let today = new Date();
      let date = this.apiCall.padZero((today.getMonth()+1)+"",2)+"-"+(today.getDate()) +"-"+today.getFullYear();
      //get opr from local storage;
      this.operator = localStorage.getItem("operator");
      this.apiCall.getReportByOprAndDate(this.operator,date).subscribe(response => {
        this.dailymetrics.minutes = response['docs'][0].totalminutes;
        this.dailymetrics.revenue = (response['docs'][0].totalcharge);
        this.dailymetrics.revenue = this.dailymetrics.revenue.toFixed(2);
        this.dailymetrics.cdr_count = response['docs'][0].totalCDR;
        this.dailymetrics.issues_count = response['docs'][0].totalDispute;
        this.dailymetrics.sms_count = response['docs'][0].totalsms;
        this.dailymetrics.voice_count = response['docs'][0].totalvoice;

        /* ----------==========     Call type Chart initialization    ==========---------- */

        var datawebsiteViewsChart :any = {
          labels: ['SMS', 'Voice'],
          series: [
            [this.dailymetrics.sms_count, this.dailymetrics.voice_count]
  
          ]
        };
        var optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high:  Math.max(...datawebsiteViewsChart['series'][0]),
            chartPadding: { top: 0, right: 5, bottom: 0, left: 0}
        };
        var responsiveOptions: any[] = [
          ['screen and (max-width: 640px)', {
            seriesBarDistance: 5,
            axisX: {
              labelInterpolationFnc: function (value) {
                return value[0];
              }
            }
          }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);
  
        //start animation for the Call type Chart
        this.startAnimationForBarChart(websiteViewsChart);
        
      }, error =>{
        console.log(error);
      })


      let dataDailySalesChart: any = {
        labels: [],
        series: [
        ]
      };


      this.apiCall.getAllReportByOpr(this.operator).subscribe(response => {
        dataDailySalesChart['labels'] = this.apiCall.getUniqueKeys(response['docs'],"loadDate");
        dataDailySalesChart['series'][0] = this.apiCall.getUniqueKeys(response['docs'],"totalDispute");

        const optionsDailySalesChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: Math.max(...dataDailySalesChart['series']), // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
      }
  
      var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);
  
      this.startAnimationForLineChart(dailySalesChart);
      }, error =>{
        console.log(error);
      })





 
     

      /* ----------==========     Completed Tasks Chart initialization    ==========---------- 

      const dataCompletedTasksChart: any = {
          labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
          series: [
              [230, 750, 450, 300, 280, 240, 200, 190]
          ]
      };

     const optionsCompletedTasksChart: any = {
          lineSmooth: Chartist.Interpolation.cardinal({
              tension: 0
          }),
          low: 0,
          high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
          chartPadding: { top: 0, right: 0, bottom: 0, left: 0}
      }

      var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

      // start animation for the Completed Tasks Chart - Line Chart
      this.startAnimationForLineChart(completedTasksChart);
      */


    
  }


}
