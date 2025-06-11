import {Component, Input, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {ArticlePreviewType} from '../../../types/articlePreview.type ';

@Component({
  selector: 'articles',
  imports: [
    NgForOf,
    RouterLink,
    NgIf
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {

  @Input() article!: ArticlePreviewType;


  ngOnInit(): void {

  }

}
