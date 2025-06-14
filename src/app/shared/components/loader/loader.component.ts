import {Component, CUSTOM_ELEMENTS_SCHEMA, Input, input, OnDestroy, OnInit} from '@angular/core';
import {LoaderService} from '../../services/loader.service';
import {NgIf} from '@angular/common';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-loader',
  imports: [
    NgIf
  ],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class LoaderComponent implements OnInit, OnDestroy {
  showSpinner = false;
  private loaderSub$!:Subscription
  constructor(private loaderService: LoaderService) {}

  @Input() isSmall = false

  ngOnInit() {
    this.loaderSub$ = this.loaderService.isShowed$.subscribe(isShowed => {
      this.showSpinner = isShowed;
    })
  }

  ngOnDestroy() {
    this.loaderSub$.unsubscribe();
  }
}
