import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-voir-plus-dialog',
  templateUrl: './voir-plus-dialog.component.html',
  styleUrls: ['./voir-plus-dialog.component.scss']
})
export class VoirPlusDialogComponent implements OnInit {
  item: any =[]; 
  constructor(public dialogRef: MatDialogRef<VoirPlusDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.item = data.formPage
   }

  ngOnInit(): void {
  }

}
