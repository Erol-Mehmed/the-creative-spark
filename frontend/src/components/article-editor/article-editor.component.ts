import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from 'src/core/services/upload.service';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-article-editor',
  templateUrl: './article-editor.component.html',
  styleUrls: ['./article-editor.component.scss'],
})
export class ArticleEditorComponent implements OnInit {
  form: FormGroup;
  uploading = false;
  saving = false;
  error: string | null = null;
  imagePreview: string | null = null;
  isEditing = false;
  articleSlug: string | null = null;
  topics: Array<{ id: number; name: string }> = [];
  selectedTopics: string[] = [];

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.form = this.fb.group({
      title: [''],
      slug: [''],
      topic: [''],
      topics: [[]],
      content: [''],
      image_url: [''],
    });
  }

  ngOnInit() {
    this.loadTopics();

    const slug = this.route.snapshot.params['slug'];
    if (slug) {
      this.isEditing = true;
      this.articleSlug = slug;
      this.loadArticle(slug);
    }
  }

  loadTopics() {
    this.http
      .get<Array<{ id: number; name: string }>>('/api/topics')
      .subscribe({
        next: (topics) => {
          this.topics = topics;
        },
        error: () => {
          console.error('Failed to load topics');
        },
      });
  }

  toggleTopic(topicName: string) {
    const index = this.selectedTopics.indexOf(topicName);
    if (index > -1) {
      this.selectedTopics.splice(index, 1);
    } else {
      this.selectedTopics.push(topicName);
    }
    this.form.patchValue({ topics: this.selectedTopics });
  }

  isTopicSelected(topicName: string): boolean {
    return this.selectedTopics.includes(topicName);
  }

  loadArticle(slug: string) {
    this.http.get(`/api/articles/${slug}`).subscribe({
      next: (article: any) => {
        const articleTopics =
          article.topics && Array.isArray(article.topics)
            ? article.topics.map((t: any) =>
                typeof t === 'string' ? t : t.name,
              )
            : [];

        this.form.patchValue({
          title: article.title,
          slug: article.slug,
          topic: articleTopics[0] || article.topic || '',
          topics: articleTopics,
          content: article.content,
          image_url: article.image,
        });
        this.selectedTopics = articleTopics;
        this.imagePreview = article.image;
      },
      error: () => {
        this.error = 'Failed to load article.';
      },
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.error = null;

    this.uploadService.uploadArticleImage(file).subscribe({
      next: (res) => {
        this.form.patchValue({ image_url: res.image_url });
        this.imagePreview = res.image_url;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Upload failed.';
      },
      complete: () => (this.uploading = false),
    });
  }

  save() {
    this.saving = true;
    this.error = null;

    if (this.selectedTopics.length === 0) {
      this.error = 'Please select at least one topic.';
      this.saving = false;
      return;
    }

    const primaryTopic = this.selectedTopics[0];
    const formValue: any = {
      ...this.form.value,
      slug: (this.form.value.slug || '').toLowerCase(),
      topics: [...this.selectedTopics],
    };

    if (primaryTopic) {
      formValue.topic = primaryTopic;
    } else {
      delete formValue.topic;
    }

    if (this.isEditing && this.articleSlug) {
      this.http
        .patch(`/api/articles/${this.articleSlug}`, formValue)
        .subscribe({
          next: (article: any) => {
            if (article?.authorSlug && article?.slug) {
              this.router.navigate(['/', article.authorSlug, article.slug]);
              return;
            }
            this.router.navigate(['/']);
          },
          error: (err) => {
            this.error = err?.error?.message || 'Save failed.';
            this.saving = false;
          },
        });
    } else {
      this.http.post('/api/articles', formValue).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (err) => {
          this.error = err?.error?.message || 'Save failed.';
          this.saving = false;
        },
      });
    }
  }

  get pageTitle(): string {
    return this.isEditing ? 'Edit article' : 'Create article';
  }

  get submitLabel(): string {
    return this.isEditing ? 'Save changes' : 'Publish article';
  }
}
