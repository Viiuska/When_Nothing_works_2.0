import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user:Object;
  bioContent:String="";
  
  constructor(
    private authService:AuthService, 
    private flashMessage: FlashMessagesService,
    private router:Router,
    private route:ActivatedRoute) { }

    ngOnInit() {
      this.authService.getProfile().subscribe(profile => {
        this.user = profile.user;
        this.bioContent = profile.user.bio;
      },
       err => {
         console.log(err);
         return false;
       });
    }

    onUpdateBio(){
      this.authService.getProfile().subscribe(profile => {
        console.log(profile.user.username)
        const user={
          username: profile.user.username,
          bio: this.bioContent
        }
        this.authService.updateProfile(user).subscribe(user =>{
          if(user.success) {
            location.reload();
          } else {
            this.flashMessage.show(user.msg, {cssClass: 'alert-danger', timeout: 5000});
            location.reload();
          }
        }
      )},
        err => {
          console.log(err);
          return false;
        });
      
    }
  
  }
