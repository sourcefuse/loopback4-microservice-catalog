// Copyright IBM Corp. 2020. All Rights Reserved.
// Node module: @loopback/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT
import {Socket, socketio} from '@loopback/socketio';
import {JSONObject} from '@loopback/core';

/**
 * A demo controller for socket.io
 */
@socketio('/')
export class SocketIoController {
  constructor(
    @socketio.socket()
    private readonly socket: Socket,
  ) {}

  /**
   * Register a handler for 'chat message' events
   * @param msg
   */
  @socketio.subscribe('subscribe-to-channel')
  registerChannel(msg: string[]) {
    if (Array.isArray(msg) && msg.length > 0) {
      msg.forEach(item => {
        this.socket.join(item);
      });
    } else {
      throw new Error('Channels data not appropriate');
    }
  }

  /**
   * Register a handler for 'general-message' events
   * @param msg
   */
  @socketio.subscribe('general-message')
  handleNotificationMessage(msg: string) {
    const parsedMsg: {
      subject: string;
      body: string;
      receiver: {
        to: {
          id: string;
          name?: string;
        }[];
      };
      type: string;
      sentDate: Date;
      options?: JSONObject;
    } = JSON.parse(msg);

    if (parsedMsg?.receiver?.to?.length > 0) {
      parsedMsg.receiver.to.forEach(item =>
        this.socket.nsp.to(item.id).emit('userId', {
          subject: parsedMsg.subject,
          body: parsedMsg.body,
          options: parsedMsg.options,
        }),
      );
    } else {
      throw new Error('Inappropriate message data');
    }
  }
}
