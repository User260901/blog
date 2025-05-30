import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {OurServicesType} from '../../../types/our-services.type';
import {DefaultResponse} from '../../../types/default-response.type';
import {RequestExpertiseService} from '../services/request-expertise.service';
import {RequestDataType} from '../../../types/request-data.type';

@Component({
  selector: 'popup',
  imports: [
    NgForOf,
    ReactiveFormsModule,
    FormsModule,
    NgIf
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss'
})
export class PopupComponent implements OnInit {

  popupForm = {
    service: 'Копирайтинг',
    name: '',
    phone: ''
  }

  success = false;
  error = false;

  @Input() serviceType = '';
  @Input() services: OurServicesType[] = []
  @Output() closePopup: EventEmitter<boolean> = new EventEmitter();

  @ViewChild('popup') popupRef!: ElementRef;
  constructor(private requestService: RequestExpertiseService) {
  }

  ngOnInit() {
    if(this.serviceType && this.serviceType.length > 0) {
      this.popupForm.service = this.serviceType
    }
  }

  close(){
    this.closePopup.emit(false);
  }

  requestOrder(){
    let dataToSend: RequestDataType = {
      service: '',
      name: '',
      phone: '',
      type: ''
    }

    if(this.services && this.services.length > 0) {
      dataToSend = this.popupForm
      dataToSend.type = 'order'
    }else {
      dataToSend.name = this.popupForm.name;
      dataToSend.phone = this.popupForm.phone;
      dataToSend.type = 'consultation'
      delete dataToSend.service
    }

    this.requestService.requestExpertise(dataToSend).subscribe(res => {
      if(res.error){
        this.error = true
        return
      }
      this.error = false
      this.success = true;
    })
  }


  closeOverLay(mouseEvent: MouseEvent) {
    const clickedInside = this.popupRef.nativeElement.contains(mouseEvent.target);
    if (!clickedInside) {
      this.closePopup.emit(false);
    }
  }
}
