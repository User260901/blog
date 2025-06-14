import {Component, Input, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {ArticlePreviewType} from '../../../types/articlePreview.type ';

@Component({
  selector: 'articles',
  imports: [
    RouterLink,
  ],
  templateUrl: './articles.component.html',
  styleUrl: './articles.component.scss'
})
export class ArticlesComponent implements OnInit {

  @Input() article!: ArticlePreviewType;


  ngOnInit(): void {

  }

}
