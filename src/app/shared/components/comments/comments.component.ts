import {Component, Input, OnInit} from '@angular/core';
import {CommentsType} from '../../../../types/comments.type';
import {DefaultResponse} from '../../../../types/default-response.type';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../services/auth.service';
import {RouterLink} from '@angular/router';
import {CommentService} from '../../services/comment.service';
import {FormsModule} from '@angular/forms';
import {AllActionsType} from '../../../../types/all-actions.type';
import {LoaderComponent} from '../loader/loader.component';
import {MatSnackBar} from '@angular/material/snack-bar';
import {HttpErrorResponse} from '@angular/common/http';


@Component({
  selector: 'app-comments',
  imports: [
    NgIf,
    RouterLink,
    FormsModule,
    NgForOf,
    DatePipe,
    LoaderComponent,

  ],
  templateUrl: './comments.component.html',
  styleUrl: './comments.component.scss'
})
export class CommentsComponent implements OnInit {
  @Input() articleId: string = ''

  comments!: CommentsType
  isLoggedIn: boolean = false;
  actionsForAllComments: AllActionsType = []
  offset = 0;
  commentary: string = ''
  showLoadComments: boolean = false;
  addCommentLoader = false;
  loadCommentsLoader = false;

  constructor(private CommentService: CommentService, private AuthService: AuthService, private _SnackBar: MatSnackBar) {
    this.isLoggedIn = this.AuthService.getIsLoggedIn()
  }

  ngOnInit() {
    if (this.articleId && this.articleId.length > 0) {
      this.getComments()
    }
  }

  getComments() {
    this.CommentService.getArticleComments(this.offset, this.articleId)
      .subscribe((data: DefaultResponse | CommentsType) => {
        if ((data as DefaultResponse).error !== undefined) {
          throw new Error((data as DefaultResponse).message)
        }

        this.comments = data as CommentsType;
        this.comments.comments = this.comments.comments.slice(0, 3)
        this.offset = this.comments.comments.length

        if(this.comments.allCount > 3) {
          this.showLoadComments = true;
        }

        if(this.isLoggedIn) {
          this.CommentService.getActionForComments(this.articleId)
            .subscribe((data) => {
              if((data as DefaultResponse).error !== undefined) {
                throw new Error((data as DefaultResponse).message)
              }
              this.actionsForAllComments = data as AllActionsType

              this.comments.comments.forEach(comment => {
                this.actionsForAllComments.forEach(action => {
                  if(comment.id === action.comment) {
                    if(action.action === 'like'){
                      comment.alreadyLiked = true;
                    }else if (action.action === 'dislike'){
                      comment.alreadyDisliked = true;
                    }
                  }
                })

              })
            })
        }

      })
  }

  addComment() {
    if (this.commentary && this.commentary.length > 0) {
      this.addCommentLoader = true
      this.CommentService.addComment(this.commentary, this.articleId)
        .subscribe((data: DefaultResponse) => {
          if(!data.error){
            setTimeout(()=>{
              this.addCommentLoader = false
              this.commentary = ''
              this._SnackBar.open('комментарии добавлен', 'закрыть', {duration: 3000, horizontalPosition: "end"})
              this.comments.comments = []
              this.comments.allCount = 0
              this.offset = 0
              this.getComments()
            },1500)
          }else {
            this._SnackBar.open(data.message, 'закрыть', {duration: 3000, horizontalPosition: "end"})
          }
        })
    }
  }

  loadOtherComments() {
    this.CommentService.getArticleComments(this.offset, this.articleId)
      .subscribe((data: CommentsType | DefaultResponse) => {
        if ((data as DefaultResponse).error !== undefined) {
          throw new Error((data as DefaultResponse).message)
        }

        this.loadCommentsLoader = true;
        const result = data as CommentsType;
        setTimeout(()=>{
          this.loadCommentsLoader = false
          this.comments.comments.push(...result.comments);
          this.offset = this.comments.comments.length;
          if(this.comments.allCount === this.comments.comments.length) {
            this.showLoadComments = false;
          }
        },1500)
      })
  }

  action(id: string, value: string) {
    if (value && value.length > 0 && this.isLoggedIn) {
      let message = 'Ваш голос учтен'
      const updatedComment = this.comments.comments.find((comment) => comment.id === id)
      if (updatedComment) {
        if (value === 'like') {
          if(updatedComment.alreadyLiked){
            updatedComment.alreadyLiked = false
            updatedComment.likesCount = String(+updatedComment.likesCount - 1)
          }else {
            updatedComment.alreadyLiked = true
            updatedComment.likesCount = String(+updatedComment.likesCount + 1)

            if(updatedComment.alreadyDisliked){
              updatedComment.dislikesCount = String(+updatedComment.dislikesCount - 1)
              updatedComment.alreadyDisliked = false;
            }
          }
        } else if (value === 'dislike') {
          if(updatedComment.alreadyDisliked){
            updatedComment.alreadyDisliked = false
            updatedComment.dislikesCount = String(+updatedComment.dislikesCount - 1)

          }else {
            updatedComment.alreadyDisliked = true
            updatedComment.dislikesCount = String(+updatedComment.dislikesCount + 1)

            if(updatedComment.alreadyDisliked){
              updatedComment.likesCount = String(+updatedComment.dislikesCount - 1)
              updatedComment.alreadyLiked = false;
            }
          }
        }else if (value === 'violate'){
          message = 'Жалоба отправлена'
        }

        this.CommentService.doAction(id, value)
          .subscribe({
            next: (data) => {
              if(data.error) {
                if (value === 'like') {
                  updatedComment.alreadyLiked = false;
                  updatedComment.likesCount = String(+updatedComment.likesCount - 1)
                } else if (value === 'dislike') {
                  updatedComment.alreadyDisliked = false
                  updatedComment.dislikesCount = String(+updatedComment.dislikesCount - 1)
                }else if (value === 'violate'){
                  this._SnackBar.open(data.message, 'закрыть', {duration: 3000, horizontalPosition: "end"})
                }
              }else {
                this._SnackBar.open(message, 'закрыть', {duration: 3000, horizontalPosition: "end"})
              }
            },
            error: (error:HttpErrorResponse)=>{
              if(value === 'violate'){
                this._SnackBar.open('Жалоба уже отправлена', 'закрыть', {duration: 3000, horizontalPosition: "end"})
              }
            }
          })

      }
    }
  }
}

