import { NgIf, NgOptimizedImage } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../api.service';
import { User } from '../user';
import { SessionService } from '../session.service';

@Component({
  selector: 'app-chatbox',
  standalone: true,
  imports: [NgIf, FormsModule, NgOptimizedImage],
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.css',  '../../../node_modules/bootstrap-icons/font/bootstrap-icons.css']
})
export class ChatboxComponent {
  @Input() chatuser: any;
  @Output() onmessage = new EventEmitter();

  message: string = '';
  conversation: any[] = [];
  user: User|null;
  constructor(
    private apiService: ApiService,
    private sessionService: SessionService
  ) {
    this.user = this.sessionService.getUser();
    setInterval(() => {
      this.refreshUser()
      this.refreshConversation()
    }, 500);
  }

  refreshUser() {
    this.user = this.sessionService.getUser()
  }

  refreshConversation() {
    this.conversation = this.chatuser.conversation;
  }

  formatDate(d: Date|string): string {
    const datePast = new Date(d);
    const seconds = Math.floor((new Date().getTime() - datePast.getTime()) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);

    if (seconds < 60) {
        return 'just now';
    } else if (minutes < 60) {
        return minutes + 'm';
    } else if (hours < 24) {
        return hours + 'h';
    } else if (days < 30) {
        return days + 'd';
    } else if (months < 12) {
        return months + 'M';
    } else {
        return years + 'y';
    }
  }

  getPhotoPath(uid: string) {
    return uid ? `${this.apiService.apiUrl}/photos/${uid}` : '/assets/photo-default.jpg';
  }

  onChatSubmit(ev: any) {
    const form = ev.target;
    if ([!this.user?._id, !this.chatuser.userid, !this.message].some((v) => v === true)) {
      return;
    }
    this.apiService.messageChat(this.user!._id, this.chatuser.userid, this.message).subscribe((response) => {
      this.message = "";
      form.reset();
    });
  }
}
