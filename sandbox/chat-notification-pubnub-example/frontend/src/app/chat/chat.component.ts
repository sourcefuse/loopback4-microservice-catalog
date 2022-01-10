import {Component, OnInit} from '@angular/core';
import {NgxNotificationService} from 'ngx-notification';
import {PubNubAngular} from 'pubnub-angular2';
import {environment} from '../../environments/environment';
import {Chat, ChatMessage} from '../chat.model';
import {UserService} from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  // styleUrls: ['./chat.component.css']
  styles: [
    `
      ::ng-deep nb-layout-column {
        display: flex;
        justify-content: center;
      }
      :host {
        display: flex;
      }
      nb-chat {
        width: 300px;
        margin: 1rem;
      }
    `,
  ],
})
export class ChatComponent implements OnInit {
  constructor(
    private readonly userHttpService: UserService,
    private readonly pubnub: PubNubAngular,
    private readonly ngxNotificationService: NgxNotificationService,
  ) {}

  ngOnInit(): void {
    this.channelUUID = environment.CHAT_ROOM;
  }
  public messages: ChatMessage[] = [];
  public senderUUID = '';
  public channelUUID = environment.CHAT_ROOM;
  public token = '';
  public inRoom = true;

  enterToken() {
    this.userHttpService.getUserTenantId(this.token).subscribe(data => {
      this.senderUUID = data;
    });
  }

  leaveRoom() {
    this.messages = [];
    this.pubnub.unsubscribe(this.channelUUID);
    this.inRoom = false;
  }

  getMessages() {
    this.inRoom = true;
    this.userHttpService.get(this.token, this.channelUUID).subscribe(data => {
      this.messages = [];
      for (const d of data) {
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: false,
          sender: 'sender',
        };
        if (d.createdBy === this.senderUUID) {
          temp.sender = 'User';
          temp.reply = true;
        }
        this.messages.push(temp);
      }
    });

    this.subcribeToNotifications();
  }

  subcribeToNotifications() {
    this.pubnub.subscribe({
      channels: [this.channelUUID],
      triggerEvents: ['message'],
    });

    this.pubnub.getMessage(this.channelUUID, msg => {
      const receivedMessage: ChatMessage = {
        body: msg.message.description,
        subject: msg.message.title,
        reply: false,
        sender: 'sender',
      };
      if (msg.message.title !== this.senderUUID) {
        this.messages.push(receivedMessage);
        this.ngxNotificationService.sendMessage(
          `New message from sender: ${msg.message.description}`,
          'info',
          'top-left',
        );
      }
    });
  }

  sendMessage(event: {message: string}, userName: string, avatar: string) {
    if (!this.inRoom) {
      return;
    }
    const chatMessage: ChatMessage = {
      body: event.message,
      subject: 'new message',
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
      reply: true,
      sender: userName,
    };

    const dbMessage: Chat = {
      body: event.message,
      subject: this.senderUUID,
      toUserId: this.channelUUID,
      channelId: this.channelUUID,
      channelType: '0',
    };

    this.userHttpService.post(dbMessage, this.token).subscribe(response => {
      this.messages.push(chatMessage);
    });
  }
}
