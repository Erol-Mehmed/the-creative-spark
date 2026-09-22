import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UploadService } from 'src/core/services/upload.service';
import { UserService } from 'src/core/services/user.service';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
})
export class ProfileEditComponent implements OnInit {
  form: FormGroup;
  uploading = false;
  saving = false;
  error: string | null = null;
  imagePreview: string | null = null;

  @Output() close = new EventEmitter<any>();

  constructor(
    private fb: FormBuilder,
    private uploadService: UploadService,
    private userService: UserService,
  ) {
    this.form = this.fb.group({
      first_name: [''],
      last_name: [''],
      bio: [''],
      image_url: [''],
    });
  }

  ngOnInit(): void {
    // Prefill with current user data if available
    this.userService.me$().subscribe({
      next: (me: any) => {
        if (!me) return;
        this.form.patchValue({
          first_name: me.first_name || '',
          last_name: me.last_name || '',
          bio: me.bio || '',
          image_url: me.image_url || '',
        });

        this.imagePreview = me.image_url || null;
      },
      error: () => {},
    });
  }

  onFileChange(event: any) {
    const file: File = event.target.files?.[0];
    if (!file) return;

    this.uploading = true;
    this.error = null;

    this.uploadService.uploadUserImage(file).subscribe({
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

    this.userService.updateProfile(this.form.value).subscribe({
      next: (user) => {
        this.userService.setCurrentUser(user);
        this.close.emit(user);
      },
      error: (err) => {
        this.error = err?.error?.message || 'Save failed.';
        this.saving = false;
      },
    });
  }

  cancel() {
    this.close.emit(null);
  }
}
