import {
  AfterViewInit,
  Component,
  OnInit,
  ViewChild,
  Injectable,
  HostListener,
} from '@angular/core';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
} from '@angular/fire/firestore';
import { filter, Observable } from 'rxjs';
import * as _ from 'lodash';

export interface Inventory {
  inventory: string;
  quantity: number;
  email: string;
  provider: string;
}
let inventories_data: Inventory[];

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements AfterViewInit, OnInit {
  title = 'inventory-list-application';
  dataSource!: MatTableDataSource<any>;
  userData!: Observable<any>;
  apiResponse: any = [];

  @ViewChild(MatSort)
  sort: MatSort = new MatSort();

  constructor(
    private firestore: Firestore,
    private appStateService: AppStateService
  ) {
    //console.log('construct');
    // this.getData();
  }

  ngOnInit() {
    this.getData();
  }

  addData(f: any) {
    const collectionInstance = collection(this.firestore, 'inventories');
    addDoc(collectionInstance, f.value)
      .then(() => {
        console.log('Data saved Successfully');
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getData() {
    const collectionInstance = collection(this.firestore, 'inventories');
    collectionData(collectionInstance).subscribe((val) => {
      //console.log(val);
      inventories_data = val as Inventory[];
      //console.log(inventories_data);
      this.dataSource = new MatTableDataSource(inventories_data);
      this.dataSource.sort = this.sort;
      this.apiResponse = val;
      const savedState = this.appStateService.getAppState();
      const savedFilterState = this.appStateService.getFilterState();
      const savedSortState = this.appStateService.getSortState();
      if (savedState || savedFilterState) {
        this.dataSource.data = [...savedState];
        this.dataSource.filter = savedFilterState;
      }

      if (savedSortState[0] && savedSortState[1]) {
        this.sort.active = savedSortState[0];
        this.sort.direction = savedSortState[1];
      }
      this.dataSource.sort = this.sort;
    });

    this.userData = collectionData(collectionInstance);
  }

  displayedColumns: string[] = ['inventory', 'quantity', 'email', 'provider'];

  ngAfterViewInit() {
    //console.log(this.dataSource);
    //this.getData();
    //this.dataSource.sort = this.sort;
  }

  applySearch($event: any) {
    const filtervalue = ($event.target as HTMLInputElement).value;
    this.dataSource.filter = filtervalue.trim().toLowerCase();
    this.dataSource.sort = this.sort;
  }

  onChange($event: any) {
    let filteredData = _.filter(this.apiResponse, (item) => {
      if ($event.target.value.toLowerCase() == 'all') return true;
      return item.provider.toLowerCase() == $event.target.value.toLowerCase();
    });
    this.dataSource = new MatTableDataSource(filteredData);
    this.dataSource.sort = this.sort;
    //console.log(filteredData);
    // if ($event.target.value.toLowerCase() == 'all') {
    //   this.getData;
    // }
    // this.dataSource.filter = $event.target.value.toLowerCase();
    //this.appStateService.saveAppState(this.dataSource.data);
  }

  // ngOnDestroy() {
  //
  //   const stateToSave = this.dataSource.data;
  //   this.appStateService.saveAppState(stateToSave);
  // }
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any): void {
    const stateToSave = this.dataSource.data;
    this.appStateService.saveAppState(stateToSave);
    this.appStateService.saveFilterState(this.dataSource.filter);
    this.appStateService.saveSortState([
      this.dataSource.sort?.active,
      this.dataSource.sort?.direction,
    ]);
  }
}
@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private key = 'app_state';
  private filterKey = 'filter_state';
  private sortKey = 'sort_state';
  saveAppState(state: any) {
    localStorage.setItem(this.key, JSON.stringify(state));
  }

  getAppState() {
    const state = localStorage.getItem(this.key);
    return state ? JSON.parse(state) : null;
  }

  saveFilterState(state: any) {
    localStorage.setItem(this.filterKey, JSON.stringify(state));
  }

  getFilterState() {
    const state = localStorage.getItem(this.filterKey);
    return state ? JSON.parse(state) : null;
  }
  saveSortState(state: any) {
    localStorage.setItem(this.sortKey, JSON.stringify(state));
  }

  getSortState() {
    const state = localStorage.getItem(this.sortKey);
    return state ? JSON.parse(state) : null;
  }
}
