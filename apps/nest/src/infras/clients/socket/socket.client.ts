import { Logger } from '@nestjs/common';
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';


@WebSocketGateway({ cors: true }) // Permet le CORS si le front est sur un autre domaine
export class SocketClient
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('message')
  handleMessage(_client: Socket, payload: string): void {
    console.log(`Message reçu: ${payload}`);
  }

  // Méthode pour envoyer une notification spécifique
  sendNotification(userId: string, message: string) {
    Logger.log(`notification:${userId}`)
    this.server.emit(`notification:${userId}`, message); // Émet un événement spécifique à l'utilisateur
  }
}