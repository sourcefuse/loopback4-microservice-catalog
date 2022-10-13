// Copyright IBM Corp. and LoopBack contributors 2020. All Rights Reserved.
// Node module: @sourceloop/example-socketio
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {JSONObject} from '@loopback/core';
import {Socket, socketio} from '@loopback/socketio';
import debugFactory from 'debug';

const debug = debugFactory('loopback:socketio:controller');

/**
 * A demo controller for socket.io
 *
 * ```ts
 * @socketio('/')
 * ```
 * This specifies the namespace / for this controller
 * Regex or strings are acceptable values for namespace
 */
@socketio('/')
export class SocketIoController {
  constructor(
    @socketio.socket() // Equivalent to `@inject('ws.socket')`
    private socket: Socket,
  ) {}

  /**
   * The method is invoked when a client connects to the server
   *
   * @param socket - The socket object for client
   */
  @socketio.connect()
  connect(socket: Socket) {
    debug('Client connected: %s', this.socket.id);
    return socket.join('room 1');
  }

  /**
   * Register a handler for 'subscribe-to-channel' events
   *
   * @param msg - The message sent by client
   */
  /**
   * Register a handler for 'general-message-forward' events
   *
   * @param msg - The message sent by client
   */
  @socketio.subscribe('general-message-forward')
  // @socketio.emit('namespace' | 'requestor' | 'broadcast')
  handleChatMessage(msg: unknown) {
    debug('General forwarded message: %s', msg);
    this.socket.nsp.emit('general-message-forward', msg);
  }

  /**
   * Register a handler for 'general-message' events
   *
   * @param msg - The message sent by client
   */

  /**
   * Register a handler for all events
   */
  @socketio.subscribe(/.+/)
  logMessage(...args: unknown[]) {
    debug('Message: %s', args);
  }

  /**
   * The method is invoked when a client disconnects from the server
   * @param socket
   */
  @socketio.disconnect()
  disconnect() {
    debug('Client disconnected: %s', this.socket.id);
  }

  @socketio.subscribe('subscribe-to-channel')
  registerChannel(msg: string[]) {
    if (Array.isArray(msg) && msg.length > 0) {
      msg.forEach(item => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        this.socket.join(item);
      });
    } else {
      throw new Error('Channels data not appropriate');
    }
  }
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
        this.socket.nsp.to(item.id).emit('userNotif', {
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
