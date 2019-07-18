import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
  public selectedTab : number = 0;
  constructor() { }

  ngOnInit() {
  }
  
  onContentTabChanged(event: any) {
    this.selectedTab = event.index;
  }

}
