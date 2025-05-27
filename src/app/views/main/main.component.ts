import {Component, OnInit} from '@angular/core';
import {NgbCarouselModule} from '@ng-bootstrap/ng-bootstrap';
import {NgForOf} from '@angular/common';
import {ArticlesService} from '../../shared/services/articles.service';
import {DefaultResponse} from '../../../types/default-response.type';
import {BestArticlesType} from '../../../types/best-articles.type';
import {environment} from '../../../environments/environment';
import {RouterLink} from '@angular/router';
import {CarouselModule, OwlOptions} from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-main',
  imports: [NgbCarouselModule, NgForOf, RouterLink, CarouselModule],
  templateUrl: './main.component.html',
  standalone: true,
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit{

  services = [
    {
      image: '/service1.png',
      name: 'Создание сайтов',
      description: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: "7 500",
    },
    {
      image: '/service2.png',
      name: 'Продвижение',
      description: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: "3 500",
    },
    {
      image: '/service3.png',
      name: 'Реклама',
      description: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: "1 000",
    },
    {
      image: '/service4.png',
      name: 'Копирайтинг',
      description: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: "750",
    }
  ]
  bestArticles: BestArticlesType[] = []
  serverStaticPath = environment.serverStaticPath
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots:false,
    navSpeed: 700,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
    },
    nav: false,
  }
  reviews = [
    {
      image: 'review1.png',
      name: 'Станислав',
      review: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      image: 'review2.png',
      name: 'Алёна',
      review: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      image: 'review3.png',
      name: 'Мария',
      review: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    }
  ]

  constructor(private articlesService: ArticlesService) {
  }

  ngOnInit() {
    this.articlesService.getBestArticles().subscribe(data => {
      if((data as DefaultResponse).error !== undefined){
        throw new Error((data as DefaultResponse).message)
      }

      this.bestArticles = data as BestArticlesType[];

      console.log(this.bestArticles);
    })
  }

}
