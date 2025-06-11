import {Component, Input, OnInit} from '@angular/core';
import {CommentsType} from '../../../../types/comments.type';
import {ArticlesService} from '../../services/articles.service';
import {DefaultResponse} from '../../../../types/default-response.type';
import {DatePipe, NgForOf, NgIf, NgOptimizedImage} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {RouterLink} from '@angular/router';
import {CommentService} from '../../services/comment.service';
import {FormsModule} from '@angular/forms';


@Component({
  selector: 'app-comments',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    NgForOf,
    DatePipe,

  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {

  @Input() articleId: string = ''
  comments!: CommentsType
  isLoggedIn: boolean = false;
  commentary: string = ''
  showLoadComments: boolean = true;

  param = {
    offset: 3,
    article: '',
  }

  constructor(private CommentService: CommentService, private AuthService: AuthService) {
    this.isLoggedIn = this.AuthService.getIsLoggedIn()
  }


  ngOnInit() {
    if (this.articleId && this.articleId.length > 0) {
      this.getComments()
      console.log(this.comments)
    }
  }

  getComments() {
    this.param.article = this.articleId;
    this.CommentService.getArticleComments(this.param)
      .subscribe((data: DefaultResponse | CommentsType) => {
        if ((data as DefaultResponse).error !== undefined) {
          throw new Error((data as DefaultResponse).message)
        }
        console.log(data as CommentsType)
        this.comments = data as CommentsType;
      })
  }

  addComment() {
    if (this.commentary && this.commentary.length > 0) {
      this.CommentService.addComment(this.commentary, this.articleId)
        .subscribe((data: DefaultResponse) => {
        })
    }
  }

  loadOtherComments() {
    this.param.offset = 0;
    this.getComments()
    this.showLoadComments = false
  }

  action(id: string, value: string) {
    if (value && value.length > 0) {
      const updatedComment = this.comments.comments.find((comment) => comment.id === id)
      if (updatedComment) {
        if (value === 'like') {
          updatedComment.likesCount = String(+updatedComment.likesCount + 1)
        } else if (value === 'dislike') {
          updatedComment.dislikesCount = String(+updatedComment.dislikesCount + 1)
        }

        this.CommentService.doAction(id, value)
          .subscribe((data: DefaultResponse) => {
            if(data.error) {
              if (value === 'like') {
                updatedComment.likesCount = String(+updatedComment.likesCount - 1)
              } else if (value === 'dislike') {
                updatedComment.dislikesCount = String(+updatedComment.dislikesCount - 1)
              }
            }
          })

      }
    }
  }
}
