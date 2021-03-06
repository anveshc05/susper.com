import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngrx/store';
import * as fromRoot from '../reducers';
import {Observable} from 'rxjs';
import {SearchService} from '../services/search.service';
@Component({
  selector: 'app-statsbox',
  templateUrl: './statsbox.component.html',
  styleUrls: ['./statsbox.component.css']
})
export class StatsboxComponent implements OnInit {
  querylook = {};
  navigation$: Observable<any>;
  selectedelements: Array<any> = [];
  selectedelement: number = -1;
  querychange$: Observable<any>;
  searchresults$: Observable<any>;
  public lineChartColors: Array<any> = [
    { // grey
      backgroundColor: 'rgba(26, 13, 171, 0.4)',
      borderColor: '#1a0dab',
      pointBackgroundColor: '#1a0dab',
      pointBorderColor: '#1a0dab',
      pointHoverBackgroundColor: '#1a0dab',
      pointHoverBorderColor: '#1a0dab'
    }];
  public lineChartData: any[] = [{ data: [0], label: 'Results Frequency' }];
  public lineChartLabels = [2015, 2016, 2017];

  public lineChartOptions: any = {
    responsive: true,

  };
  public barChartLabels: string[] = ['0'];
  public barChartType = 'bar';
  public barChartData: any[] = [{ data: [0], label: 'Protocol Frequency' }];
  public barChartOptions: any = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  public lineChartType: string = 'line';
  changeurl(modifier, element) {
    this.querylook['query'] = this.querylook['query'] + '+' + decodeURIComponent(modifier);
    this.selectedelements.push(element);
    this.route.navigate(['/search'], {queryParams: this.querylook});
  }
  selectelement(element) {
    this.selectedelement = element;
  }
  deselectelement(element) {
    this.selectedelement = -1;
  }

  removeurl(modifier) {
    this.querylook['query'] = this.querylook['query'].replace('+' + decodeURIComponent(modifier), '');
    this.route.navigate(['/search'], {queryParams: this.querylook});
  }
  constructor(private route: Router, private activatedroute: ActivatedRoute, private store: Store<fromRoot.State>) {
    this.activatedroute.queryParams.subscribe(query => {
      this.querylook = Object.assign({}, query);
      this.navigation$ = store.select(fromRoot.getNavigation);
      this.navigation$.subscribe(navigation => {
        for (let nav of navigation) {
          if (nav.displayname === 'Protocol') {
            let data = [];
            let datalabels = [];
            for (let element of nav.elements){
                datalabels.push(element.name);
                data.push(parseInt(element.count, 10));
              }
            this.barChartData[0].data = data;
            this.barChartLabels = datalabels;

          }
        }
      });
    });
    this.searchresults$ = store.select(fromRoot.getItems);
    this.searchresults$.subscribe( searchresults => {
      this.getChartData(searchresults);
    } );

    this.querychange$ = store.select(fromRoot.getquery);
    this.querychange$.subscribe(query => {

    });
  }

  getChartData(statistics) {
    if ((statistics)) {
      let labels = [];
      let data: Array<any> = [0, 0, 0];
      for (let result of statistics) {
        let date = new Date(result.pubDate);
        if ((date.getFullYear() - 2015) > 0) {
          data[(date.getFullYear() - 2015)] += 1;

        }

      }


      this.lineChartData[0].data = data;
      this.lineChartLabels = [2015, 2016, 2017];
      return;
    };

  }
  ngOnInit() {
  }

}
