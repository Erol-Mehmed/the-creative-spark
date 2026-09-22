import { Component, OnInit } from '@angular/core';
import { Author } from '../../shared/interfaces';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/core/services/user.service';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss'],
})
export class AuthorComponent implements OnInit {
  author: Author = {
    name: '',
    description: '',
    image: '',
  };

  currentUser: any = null;
  editing = false;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
  ) {}

  ngOnInit() {
    window.scrollTo(0, 0);

    this.userService.currentUser$.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.applyCurrentUserToAuthor(user);
      },
    });

    this.userService.me$()?.subscribe({
      next: (user) => {
        this.currentUser = user;
        this.userService.setCurrentUser(user);
      },
    });
  }

  setAuthorInfo($event: Author) {
    this.author = $event;
  }

  isOwner() {
    const username = this.route.snapshot.params['username'];
    return this.currentUser && this.currentUser.username === username;
  }

  toggleEdit() {
    this.editing = !this.editing;
  }

  onProfileEditClose(updatedUser: any) {
    this.editing = false;
    if (updatedUser) {
      this.applyCurrentUserToAuthor(updatedUser);
    }
  }

  private applyCurrentUserToAuthor(user: any) {
    if (!user || !this.isOwner()) {
      return;
    }

    const name =
      `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
      user.username;
    this.author = {
      ...this.author,
      name,
      description: user.bio || '',
      image: user.image_url || '',
    };
  }
}
