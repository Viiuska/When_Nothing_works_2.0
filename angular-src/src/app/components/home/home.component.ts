import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any [];
  post:any[];
  user: Object;
  newSubject: String;
  newPostContent: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService,
    private route:ActivatedRoute
  ) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params =>{
      const searchIds = {id : params['id']};
      if(searchIds.id){
        this.authService.getPostsById(searchIds).subscribe(data =>{
          this.posts = data.post
        },
        err=>{
          console.log(err);
          return false;
        })
      } else{
        this.authService.getPosts().subscribe(content=>{
        this.posts = content.post
        },
        err => {
          console.log(err);
          return false;
        });
      }
    })
  }


  onPostSubmit(){
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      const newPost={
        username: profile.user.username,
        subject: this.newSubject,
        content: this.newPostContent
      }
      this.authService.addPost(newPost).subscribe(data => {
        if(data.success) {
          this.flashMessage.show('New post created', {cssClass: 'alert-success', timeout: 5000});
          location.reload();
        } else {
          this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
          this.router.navigate(['login']);
        }
    },
     err => {
       console.log(err);
       return false;
     });
     
  },err =>{
    console.log(err);
    this.flashMessage.show('Login first to create a post', {cssClass: 'alert-danger', timeout: 5000});
    this.router.navigate(['login']);
    return false;
  });
  }



  onViewComment(post: any){
    this.router.navigate(['comment'], { queryParams: {postInfo: post._id}});
  }

  onViewProfile(post:any){
    this.router.navigate(['view-profiles'], {queryParams:{username:post.username}})
  }

  onThumbsUp(post: any){
    this.authService.getProfile().subscribe(profile => {
      const liked={
        username:profile.user.username,
        id:post._id
      }
      this.authService.addThumbsUp(liked).subscribe(data=>{
        if(data.success) {
          location.reload();
        }else {
          this.flashMessage.show("Something went wrong", {cssClass: 'alert-danger', timeout: 5000});
          location.reload();
        }
      })
    },
     err => {
       console.log(err);
       this.flashMessage.show('Login first to like a post', {cssClass: 'alert-danger', timeout: 5000});
       return false;
     });

  }
}
