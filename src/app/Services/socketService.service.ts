import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';  // Asegúrate de configurar la URL en environment

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  constructor() {
    // Inicializar la conexión al servidor de sockets
    this.socket = io(environment.apiUrl); // environment.apiUrl debería ser la URL de tu backend (NestJS)
  }

  // Emitir cambios del diagrama al servidor
  sendDiagramUpdate(diagramData: any): void {
    this.socket.emit('diagramUpdate', diagramData);
  }

  // Escuchar las actualizaciones del diagrama desde el servidor
  onDiagramUpdate(): Observable<any> {
    return new Observable((observer) => {
      this.socket.on('updateDiagram', (data) => {
        observer.next(data);  // Emitir los datos cuando se recibe una actualización
      });
    });
  }

  // Método opcional para desconectarse del socket (si lo necesitas)
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
