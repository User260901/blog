import { Component } from '@angular/core';
import {NgIf} from '@angular/common';
import {PopupComponent} from '../../popup/popup.component';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-footer',
    imports: [
        NgIf,
        PopupComponent,
        RouterLink
    ],
  templateUrl: './footer.component.html',
  standalone: true,
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  orderPopUp = false;

  openPopup(){
    this.orderPopUp = true
  }

  closePopup(event:boolean){
    this.orderPopUp = event
  }

}
