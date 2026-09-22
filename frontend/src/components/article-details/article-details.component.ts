import {Component, OnInit} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from "@angular/router";
import {FormatDatePipe} from "../../shared/pipes/format-date.pipe";
import { UserService } from 'src/core/services/user.service';

@Component({
  selector: 'app-article-details',
  templateUrl: './article-details.component.html',
  styleUrls: ['./article-details.component.scss'],
  providers: [FormatDatePipe],
})
export class ArticleDetailsComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private formatDatePipe: FormatDatePipe,
    private route: ActivatedRoute,
    private userService: UserService,
    private router: Router,
  ) {
  }

  article: any = null;

  currentUser: any = null;
  loading: boolean = true;
  article_slug: string = "";

  ngOnInit() {
    this.userService.me$()?.subscribe({
      next: (user) => this.currentUser = user,
    });

    this.article_slug = this.route.snapshot.params['article_slug'];

    this.http.get(`/api/articles/${(this.article_slug)}`).subscribe({
      next: (data: any) => {
        this.article = data;
      },
      error: (err) => {
        console.error('Article not found', err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }

  isOwner(): boolean {
    return this.currentUser && this.article?.author_id === this.currentUser.id;
  }

  editArticle() {
    this.router.navigate(['/edit', this.article.slug]).then(r => r);
  }

  onClapClick() {
    this.http.post(`/api/articles/${(this.article_slug)}/clap`, "").subscribe({
      next: (claps: any) => {
        this.article.claps = claps;
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        this.loading = false;
      },
    });
  }
}
