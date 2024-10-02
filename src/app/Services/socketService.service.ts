import { EventEmitter, Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Socket } from 'ngx-socket-io';

import { environment } from 'src/environments/environment';  // Asegúrate de configurar la URL en environment

@Injectable({
  providedIn: 'root'
})
export class SocketService extends Socket{
  private socket: Socket;
   
  @Output() outEven: EventEmitter<any> = new EventEmitter();
  @Output() callback: EventEmitter<any> = new EventEmitter();
  constructor(
    private  cookieService: CookieService
  ) { 
    super({
      url: environment.apiUrl,
      options: {
        query:{
          nameRoom: cookieService.get('room')
        }
      }
    })

    this.listen()
  }

  listen = () => {
    this.ioSocket.on('event', (res: any) => this.callback.emit(res));   

  }

  emitEvent = (payload = {}) => {
    this.ioSocket.emit('event', payload)
  }


  createRoom(roomName: string) {
    this.ioSocket.emit('createRoom', roomName);
  }

  onRoomCreated(callback: (room: any) => void) {
    this.ioSocket.on('roomCreated', callback);
  }

  joinRoom(roomName: string) {
    this.ioSocket.emit('joinRoom', roomName);
  }

  onRoomJoined(callback: (room: any) => void) {
    this.ioSocket.on('roomJoined', callback);
  }

  inviteToRoom(roomName: string, userId: string) {
    this.ioSocket.emit('inviteToRoom', roomName, userId);
  }
}
