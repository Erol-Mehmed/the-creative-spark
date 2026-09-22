import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MostLikedArticlesComponent } from './most-liked-articles.component';

describe('MostLikedArticlesComponent', () => {
  let component: MostLikedArticlesComponent;
  let fixture: ComponentFixture<MostLikedArticlesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MostLikedArticlesComponent],
    });
    fixture = TestBed.createComponent(MostLikedArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
