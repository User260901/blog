import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../../shared/services/articles.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ArticleType} from '../../../types/article.type';
import {NgForOf, NgIf} from '@angular/common';
import {BestArticlesType} from '../../../types/best-articles.type';

@Component({
  selector: 'app-article',
  imports: [
    NgIf,
    NgForOf,
    RouterLink
  ],
  standalone: true,
  templateUrl: './article.component.html',
  styleUrl: './article.component.scss'
})
export class ArticleComponent implements OnInit {

  article!: ArticleType
  relatedArticles: BestArticlesType[] = []

  constructor(private ArticleService: ArticlesService,  private ActivatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.ActivatedRoute.params.subscribe(params => {
      if(params['url']){
        this.ArticleService.getArticle(params['url']).subscribe(article => {
          this.article = article

          this.ArticleService.getRelatedArticles(params['url']).subscribe(relatedArticles => {
            this.relatedArticles = relatedArticles;
          })

        })
      }
    })
  }

}
