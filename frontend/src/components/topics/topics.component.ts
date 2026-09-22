import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-topics',
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss'],
})
export class TopicsComponent implements OnInit {
  @Input() selectedTopic: string | null = null;
  @Output() topicChange = new EventEmitter<string | null>();

  topics: Array<{ id: number; name: string }> = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http
      .get<Array<{ id: number; name: string }>>('/api/topics')
      .subscribe({
        next: (topics) => {
          this.topics = topics;
        },
        error: () => {
          this.topics = [];
        },
      });
  }

  selectTopic(topic: string | null): void {
    this.topicChange.emit(topic);
  }
}
