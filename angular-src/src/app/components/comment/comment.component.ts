import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  postInfo: String;
  post: any [];
  comment: any [];
  subject:String;
  newCommentSubject:String;
  newContent:String;
  

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.authService.getPostAndComments(params['postInfo']).subscribe(data=>{
      this.post = data.post
      this.comment = data.comments
      },
      err => {
        console.log(err);
        return false;
      });
    })
  }

  onCommentSubmit(){
    this.authService.getProfile().subscribe(profile => {
      this.route.queryParams.subscribe((params)=>{
        //this.subject= params['postInfo']
        this.authService.getPostAndComments(params['postInfo']).subscribe(data=>{
          const newComment={
            username: profile.user.username,
            postId: data.post._id,
            subSubject: this.newCommentSubject,
            content: this.newContent
          }
          this.authService.addComment(newComment).subscribe(data => {
            if(data.success) {
              this.flashMessage.show('New comment created', {cssClass: 'alert-success', timeout: 5000});
              location.reload();
            } else {
              this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 5000});
              location.reload();
            }
          }, err => {
              console.log(err);
              return false;
            });
        }, err => {
            console.log(err);
            return false;
          });
    })}, 
    err =>{
      console.log(err);
      this.flashMessage.show('Login first to create a comment', {cssClass: 'alert-danger', timeout: 5000});
      this.router.navigate(['login']);
      return false;
    });
    
  }

  

}
