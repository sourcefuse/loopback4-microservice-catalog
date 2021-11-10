import { Component, OnInit } from '@angular/core';
import { NgxNotificationService } from 'ngx-notification';
import { PubNubAngular } from 'pubnub-angular2';
import { Chat, ChatMessage } from '../chat.model';
import { UserService } from '../chat.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  // styleUrls: ['./chat.component.css']
  styles: [`
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
  `],
})
export class ChatComponent implements OnInit {

  constructor(private userHttpService: UserService,
    private pubnub: PubNubAngular,
    private ngxNotificationService: NgxNotificationService) { }

  ngOnInit(): void {
  }
  public messages:ChatMessage[] = [];
  public notifications:any[] = [];
  public senderUUID = '';
  public receiverUUID = '';
  public token = '';
  private uuid1 = '02d374a3-3d92-067b-6502-b513a7594087';
  private uuid2 = 'ff1b8600-0e86-e4cf-44da-67c0e627ab20';

  enterToken(){
    this.userHttpService.getUserTenantId(this.token)
    .subscribe(data => {
      console.log("sender UUID: ",data);
      this.senderUUID = data;

      if(this.senderUUID == this.uuid1){ this.receiverUUID = this.uuid2 }
      else{ this.receiverUUID = this.uuid1; }
      console.log("receiver UUID: ",this.receiverUUID);

      this.getMessages();
      this.subcribeToNotifications();
    });
  }

  getMessages(){
    this.userHttpService.get(this.token)
      .subscribe(data => {
        data.sort((a,b)=>{
          if(a.createdOn == b.createdOn){ return 0;}
          else if(a.createdOn! > b.createdOn!){ return 1;}
          else{return -1;}
          // return a.createdOn==b.createdOn?0:a.createdOn!>b.createdOn!?1:-1
        });
        console.log(data);
        this.messages = [];
        for(let i=0;i<data.length;i++){
          let temp:ChatMessage = {
            body: data[i].body,
            subject: data[i].subject,
            channelType: "0",
            reply: true,
            sender: 'User'
          }
          if(data[i].toUserId == this.senderUUID){
            temp.sender = 'sender'
            temp.reply = false;
          }
          this.messages.push(temp);
          // if(data[i].toUserId ==)
        }
      }),
        (error: any) => {
        console.log("Error in get()", error);
      }
  }

  subcribeToNotifications(){
    this.pubnub.subscribe({
      channels: [this.senderUUID],
      triggerEvents: ['message']
    });

    this.pubnub.getMessage(this.senderUUID,  (msg) => {
      console.log('pubnub getMessage() from DB',msg);

      let receivedMessage:ChatMessage = {
        body: msg.message.description,
        subject: msg.message.title,
        reply: false,
        sender: 'sender'
      }
      this.messages.push(receivedMessage);
      this.ngxNotificationService.sendMessage(`New message from sender: ${msg.message.description}`, 'info', 'top-left');
    });
  }

  sendMessage(event: any, userName: string, avatar: string) {
    let chatMessage:ChatMessage = {
      body: event.message,
      subject: 'new message',
      toUserId: this.receiverUUID,
      channelId: this.receiverUUID,
      channelType: "0",
      reply: true,
      sender: userName
    }

    let dbMessage:Chat = {
      body: event.message,
      subject: 'new message',
      toUserId: this.receiverUUID,
      channelId: this.receiverUUID,
      channelType: "0",
    }

    this.userHttpService.post(dbMessage,this.token)
      .subscribe( response => {
        console.log("Message sent");
        this.messages.push(chatMessage);
      }, error => {
        console.log("Error in form message post method", error);
      });    
  }
}
