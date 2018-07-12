var websocket = require('ws').Server;

class ChatServer {
    constructor(server) {
        const wsServer = new websocket({
            server,
            verifyClient : this.verifyConnection
        });
        wsServer.on('connection', this.onConnection.bind(this));
        this.clients = {};
    }

    verifyConnection(event) {
        if(event.origin === 'http://localhost:1234') {
            return true;
        }
        else {
            return false;
        }
    }

    onConnection(ws) {
        let user = '';
        ws.on('message', (msg) => {
            const parsedMsg = JSON.parse(msg);
            if(parsedMsg['type'] === 'auth') {
                user = parsedMsg.msg;
                this.clients[user] = ws;
                console.log(`${user} connected!`);
            }
        });
        ws.on('message', this.receiveMessage.bind(this));
        ws.on('close', () => {
            console.log(`${user} disconnected!`);
            delete this.clients[user];
        });
    }

    sendMessage(ws, msgObj) {
        ws.send(JSON.stringify(msgObj));
    }

    receiveMessage(msg) {
        const allowedTypes = ['image', 'text'];
        const parsedMsg = JSON.parse(msg);
        if(allowedTypes.indexOf(parsedMsg.type) !== -1) {
            let receivingUsers = [];
            if(typeof parsedMsg.to === 'string') {
                receivingUsers.push(parsedMsg.to);
            }
            else if(typeof parsedMsg.to === 'object') {
                receivingUsers = parsedMsg.to.members;
                parsedMsg.to = parsedMsg.to.id;
            }
            for(const user of receivingUsers) {
                if(this.clients[user] !== undefined) {
                    this.sendMessage(this.clients[user], parsedMsg);
                }
            }
        }
    }
}

module.exports = ChatServer;