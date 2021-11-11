import {Component, OnInit} from '@angular/core';
import {NgxNotificationService} from 'ngx-notification';
import {PubNubAngular} from 'pubnub-angular2';
import {environment} from 'src/environments/environment';
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
    this.uuid1 = environment.USER1_UUID;
    this.uuid2 = environment.USER2_UUID;
  }
  public messages: ChatMessage[] = [];
  public senderUUID = '';
  public receiverUUID = '';
  public token = '';
  private uuid1 = '';
  private uuid2 = '';

  enterToken() {
    this.userHttpService.getUserTenantId(this.token).subscribe(data => {
      this.senderUUID = data;

      if (this.senderUUID === this.uuid1) {
        this.receiverUUID = this.uuid2;
      } else {
        this.receiverUUID = this.uuid1;
      }

      this.getMessages();
      this.subcribeToNotifications();
    });
  }

  getMessages() {
    this.userHttpService.get(this.token).subscribe(data => {
      data.sort((a, b) => {
        if (a.createdOn === b.createdOn) {
          return 0;
        } else if (a.createdOn && b.createdOn && a.createdOn > b.createdOn) {
          return 1;
        } else {
          return -1;
        }
      });

      this.messages = [];
      for (const d of data) {
        const temp: ChatMessage = {
          body: d.body,
          subject: d.subject,
          channelType: '0',
          reply: true,
          sender: 'User',
        };
        if (d.toUserId === this.senderUUID) {
          temp.sender = 'sender';
          temp.reply = false;
        }
        this.messages.push(temp);
      }
    });
  }

  subcribeToNotifications() {
    this.pubnub.subscribe({
      channels: [this.senderUUID],
      triggerEvents: ['message'],
    });

    this.pubnub.getMessage(this.senderUUID, msg => {
      const receivedMessage: ChatMessage = {
        body: msg.message.description,
        subject: msg.message.title,
        reply: false,
        sender: 'sender',
      };
      this.messages.push(receivedMessage);
      this.ngxNotificationService.sendMessage(
        `New message from sender: ${msg.message.description}`,
        'info',
        'top-left',
      );
    });
  }

  sendMessage(event: {message: string}, userName: string, avatar: string) {
    const chatMessage: ChatMessage = {
      body: event.message,
      subject: 'new message',
      toUserId: this.receiverUUID,
      channelId: this.receiverUUID,
      channelType: '0',
      reply: true,
      sender: userName,
    };

    const dbMessage: Chat = {
      body: event.message,
      subject: 'new message',
      toUserId: this.receiverUUID,
      channelId: this.receiverUUID,
      channelType: '0',
    };

    this.userHttpService.post(dbMessage, this.token).subscribe(response => {
      this.messages.push(chatMessage);
    });
  }
}
