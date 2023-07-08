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
  subject: String;
  post: String;

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
        subject: this.subject,
        post: this.post
      }
      this.authService.addPost(newPost).subscribe(data => {
      if(data.success) {
        this.authService.storeUserData(data.token, data.user);
        this.flashMessage.show('New post created', {cssClass: 'alert-success', timeout: 5000});
        this.router.navigate(['home']);
      } else {
        this.flashMessage.show(data.msg, {cssClass: 'alert-danger', timeout: 5000});
        this.router.navigate(['login']);
      }
    },
     err => {
       console.log(err);
       return false;
     });
     
  });

    

  }
}
