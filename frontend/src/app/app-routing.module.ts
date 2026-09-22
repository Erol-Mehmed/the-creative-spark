import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorComponent } from 'src/components/author/author.component';
import { HomeComponent } from 'src/components/home/home.component';
import { ArticleDetailsComponent } from '../components/article-details/article-details.component';
import { ArticleEditorComponent } from 'src/components/article-editor/article-editor.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'create', component: ArticleEditorComponent },
  { path: 'edit/:slug', component: ArticleEditorComponent },
  { path: ':username/:article_slug', component: ArticleDetailsComponent },
  { path: ':username', component: AuthorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
