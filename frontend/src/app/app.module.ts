import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from '../components/header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthModalComponent } from '../components/auth-modal/auth-modal.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../store';
import { ReactiveFormsModule } from '@angular/forms';
import { MostLikedArticlesComponent } from '../components/most-liked-articles/most-liked-articles.component';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from 'src/core/core.module';
import { ArticlesListComponent } from 'src/components/articles-list/articles-list.component';
import { HomeComponent } from 'src/components/home/home.component';
import { TopicsComponent } from 'src/components/topics/topics.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AuthorComponent } from '../components/author/author.component';
import { HeroSectionComponent } from 'src/components/hero-section/hero-section.component';
import { ArticleDetailsComponent } from 'src/components/article-details/article-details.component';
import { ProfileEditComponent } from 'src/components/profile-edit/profile-edit.component';
import { ArticleEditorComponent } from 'src/components/article-editor/article-editor.component';
import { NgOptimizedImage } from '@angular/common';
import { SharedModule } from 'src/shared/shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthModalComponent,
    MostLikedArticlesComponent,
    ArticlesListComponent,
    HomeComponent,
    TopicsComponent,
    AuthorComponent,
    HeroSectionComponent,
    ArticleDetailsComponent,
    ProfileEditComponent,
    ArticleEditorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    StoreModule.forRoot(reducers),
    ReactiveFormsModule,
    HttpClientModule,
    CoreModule,
    NgbModule,
    InfiniteScrollModule,
    NgOptimizedImage,
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
