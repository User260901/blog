import {Component, OnInit} from '@angular/core';
import {ArticlesService} from '../../shared/services/articles.service';
import {ArticlesType} from '../../../types/articles.type';
import {DefaultResponse} from '../../../types/default-response.type';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {BlogActiveParamsType} from '../../../types/blog-activeParams.type';
import {FilterCategories} from '../../../types/filter-categories.type';
import {ArticlesComponent} from '../../shared/articles/articles.component';

@Component({
  selector: 'app-blogs',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    ArticlesComponent
  ],
  standalone: true,
  templateUrl: './blogs.component.html',
  styleUrl: './blogs.component.scss'
})
export class BlogsComponent implements OnInit {

  activeParams: BlogActiveParamsType = {page: 1, categories: []};
  filterOpen = false;
  articles: ArticlesType = {
    count: 0,
    pages: 0,
    items: []
  };

  appliedFilter:FilterCategories[] = []
  filterCategories: FilterCategories[] = []
  pages: number[] = []

  constructor(private ArticlesService: ArticlesService, private ActivatedRoute: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.getCategories();
  }

  getParams(){
    this.ActivatedRoute.queryParams.subscribe(params => {
      if (params.hasOwnProperty('page')) {
        this.activeParams.page = +params['page'];
      }

      if (params.hasOwnProperty('categories')) {
        const catParam = params['categories'];
        if (Array.isArray(catParam)) {
          this.activeParams.categories = catParam;
        } else {
          this.activeParams.categories = [catParam]
        }

      } else {
        this.activeParams.categories = [];
      }

      this.filterCategories.forEach(fc => {
        fc.filterApplied = this.activeParams.categories.includes(fc.url);
      });

      this.appliedFilter = this.filterCategories.filter(category => {
        return this.activeParams.categories.includes(category.url);
      })

      this.getArticles()

    })
  }

  getCategories() {
    this.ArticlesService.getArticleCategories().subscribe(categories => {
      if ((categories as DefaultResponse).error !== undefined) {
        throw new Error((categories as DefaultResponse).message)
      }
      this.filterCategories = categories as FilterCategories[];
      this.getParams()
    })
  }

  getArticles(){
    this.pages = []
    this.ArticlesService.getArticles(this.activeParams).subscribe((articles: ArticlesType | DefaultResponse) => {
      if ((articles as DefaultResponse).error !== undefined) {
        throw new Error((articles as DefaultResponse).message);
      }
      this.articles = articles as ArticlesType;
      for (let i = 1; i <= this.articles.pages; i++) {
        this.pages.push(i);
      }
    })
  }


  applyFilter(filter: FilterCategories) {
    const filterExist = this.activeParams.categories.includes(filter.url);
    if (filterExist) {
      filter.filterApplied = false;
      this.activeParams.categories = this.activeParams.categories.filter(category => category !== filter.url);
    } else {
      this.activeParams.categories = [...this.activeParams.categories, filter.url];
      filter.filterApplied = true;
    }

    this.activeParams.page = 1
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });

  }


  openPrevPage() {
    if(this.activeParams.page > 1){
      this.activeParams.page = this.activeParams.page - 1;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      });
    }
  }

  openPage(page: number) {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  openNextPage() {
    if(this.activeParams.page < this.pages.length) {
      this.activeParams.page = this.activeParams.page + 1;
      this.router.navigate(['/articles'], {
        queryParams: this.activeParams
      })
    }
  }

  removeFilter(url: string) {
    this.activeParams.categories = this.activeParams.categories.filter(category => category !== url);
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  toggle() {
    this.filterOpen = !this.filterOpen;
  }

}
