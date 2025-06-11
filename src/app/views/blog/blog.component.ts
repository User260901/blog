import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../../shared/services/articles.service';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {ArticleType} from '../../../types/article.type';
import {NgForOf, NgIf} from '@angular/common';
import {ArticlePreviewType} from '../../../types/articlePreview.type ';
import {ArticlesComponent} from '../../shared/articles/articles.component';
import {CommentsComponent} from '../../shared/components/comments/comments.component';


@Component({
  selector: 'app-blog',
  imports: [
    NgIf,
    NgForOf,
    ArticlesComponent,
    CommentsComponent
  ],
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.scss'
})
export class BlogComponent implements OnInit {

  article!: ArticleType;
  relatedArticles: ArticlePreviewType[] = [];

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
