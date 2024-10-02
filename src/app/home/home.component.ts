import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SocketService } from '../Services/socketService.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  constructor(private socketService: SocketService, private router: Router) {}

  createRoom(roomName: string) {
    this.socketService.createRoom(roomName);
    this.socketService.onRoomCreated((room: any) => {
      console.log(`Sala creada: ${room}`);
      this.router.navigate(['/room', room]); // Redireccionar a la sala creada
    });
  }

  joinRoom(roomName: string) {
    this.socketService.joinRoom(roomName);
    this.socketService.onRoomJoined((room: any) => {
      console.log(`Unido a la sala: ${room}`);
      this.router.navigate(['/room', room]); // Redireccionar a la sala unida
    });
  }

  inviteToRoom(roomName: string, userId: string) {
    this.socketService.inviteToRoom(roomName, userId);
  }
}