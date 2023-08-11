import { Manager, Socket } from "socket.io-client"

let socket: Socket;

export const connectToServer = (token: string) => {
    const manager = new Manager('http://localhost:3000/socket.io/socket.io.js', {
        extraHeaders: {
            hola: 'mundo',
            authentication: token
        }
    });

    socket?.removeAllListeners();
    socket = manager.socket('/');

    addListeners();
}

const addListeners = () => {
    const serverStatusLevel = document.querySelector('#server-status')!;
    const clientsUl = document.querySelector('#clients-ul');

    const messagForm = document.querySelector<HTMLFormElement>('#message-form');
    const messageInput = document.querySelector<HTMLInputElement>('#message-input');
    const messagesUl = document.querySelector('#messages-ul');

    socket.on('connect', () => {
        serverStatusLevel.innerHTML = 'connected';
    });
    socket.on('disconnect', () => {
        serverStatusLevel.innerHTML = 'disconnected';
    });
    socket.on('clients-updated', (clients: string[]) => {
        let clientHtml = '';
        clients.forEach(clientId => {
            clientHtml += `
                <li>${clientId}</li>
            `
        });
        clientsUl!.innerHTML = clientHtml;
    });

    messagForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        if (messageInput!.value.trim().length <= 0) return;

        socket.emit('message-from-client', {
            id: 'yo',
            message: messageInput?.value
        });

        messageInput!.value = '';
    });

    socket.on('message-from-server', (payload: { fullName: string, message: string }) => {
        const newMessage = `
            <li>
                <strong>${payload.fullName}:</strong>
                <span> ${payload.message}</span>
            </li>
        `;
        const li = document.createElement('li');
        li.innerHTML = newMessage;
        messagesUl!.append(li);
    });
}