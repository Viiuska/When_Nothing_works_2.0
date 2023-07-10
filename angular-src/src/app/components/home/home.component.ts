import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any [];
  user: Object;
  newSubject: String;
  newPostContent: String;

  constructor(
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService
  ) { }

  ngOnInit() {
    this.authService.getPosts().subscribe(content=>{
      this.posts = content.post
    },
    err => {
      console.log(err);
      return false;
    });
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
}
