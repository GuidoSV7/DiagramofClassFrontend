import { AfterViewInit, OnInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('canvas') canvas: ElementRef;



  constructor(
    private cookieService:CookieService

  ) {} // Inyecta HttpClient



  public ngOnInit(): void {




  }

}



