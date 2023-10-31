import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets/interfaces';

@WebSocketGateway(8000, { cors: true })
export class MyGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`ID: (${client.id}) connected`);
  }

  handleDisconnect(client: Socket) {
    console.log(`ID : ${client.id} disconnected`);
  }

  @SubscribeMessage('sendMessageEvents')
  handleEvent(@MessageBody() data: object, @ConnectedSocket() client: Socket) {
    this.server.emit('onMessage', {
      Client_ID: client.id,
      Message: data,
    });

    console.log(`${client.id}: ${data}`);
  }

  onCardCreated(card: any) {
    this.server.emit('onCardCreated', card);
  }
}
