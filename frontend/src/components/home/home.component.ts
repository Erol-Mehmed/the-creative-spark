import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  hasArticles: boolean = false;
  selectedTopic: string | null = null;

  ngOnInit() {
    window.scrollTo(0, 0);

    this.http.get('/api/articles?has-articles=1').subscribe((boolean: any) => {
      this.hasArticles = boolean;
    });

    this.route.queryParams.subscribe((params) => {
      this.selectedTopic = params['topic'] || null;
    });
  }

  onTopicChange(topic: string | null): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { topic: topic || null },
      queryParamsHandling: 'merge',
    });
  }
}
