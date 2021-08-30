import { getLocaleDateTimeFormat } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { getMatFormFieldDuplicatedHintError } from '@angular/material/form-field';
import { MatSelectChange } from '@angular/material/select';
import { BonEntreeService } from '../bon-entree.service';
import * as converter from 'xml-js';
import { compileNgModule } from '@angular/compiler';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as xml2js from 'xml2js'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
 
export class TestComponent  {
  expandedElement: any;
  public data = [
    {
      "_id": "c9d5ab1a",
      "subdomain": "wing",
      "domain": "aircraft",
      "part_id": "c9d5ab1a",
      "info.mimetype": "application/json",
      "info.dependent": "parent",
      "nested": [
        {
          "domain": "aircraft",
          "_id": "c1859902",
          "info.mimetype": "image/jpeg",
          "info.dependent": "c9d5ab1a",
          "part_id": "c1859902",
          "subdomain": "tail"
        },

        {
          "domain": "aircraft",
          "_id": "c1859902",
          "info.mimetype": "image/jpeg",
          "info.dependent": "c9d5ab1a",
          "part_id": "c1859902",
          "subdomain": "tail"
        }
      ]
    },
    {
      "_id": "1b0b0a26",
      "subdomain": "fuel",
      "domain": "aircraft",
      "part_id": "1b0b0a26",
      "info.mimetype": "image/jpeg",
      "info.dependent": "no_parent"
    }
  ];

  dataSource = new MatTableDataSource([]);
  displayedColumns = ['_id', 'subdomain', 'domain', 'part_id', 'info.mimetype', 'info.dependent'];
  constructor() {
    this.displayedColumns = this.displayedColumns;
    this.dataSource = new MatTableDataSource(this.data);
  }

  getKeys(object:any): string[] {
    //console.log(object);
    return Object.keys(object);
  }

  onItemSelected(idx: number) {
    console.log(idx);
  }

  applyFilter() {
    
  }

}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'dialog-overview-example-dialog.html',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data:any= MAT_DIALOG_DATA) {}

  onNoClick() {
    this.dialogRef.close();
  }

}