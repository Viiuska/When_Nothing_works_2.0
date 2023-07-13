import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-profiles',
  templateUrl: './view-profiles.component.html',
  styleUrls: ['./view-profiles.component.css']
})
export class ViewProfilesComponent implements OnInit {
  user:Object;

  constructor(private authService:AuthService, 
    private router:Router,
    private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe((params)=>{
      this.authService.getViewProfiles(params['username']).subscribe(data=>{
        this.user = data.user
      }, err=>{
        console.log(err);
        return false;
      })

    })
  }

}
