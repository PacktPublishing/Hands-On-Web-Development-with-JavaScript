export default class ChatClient {
    constructor(userid) {
        this.ws = new WebSocket('ws://localhost:1234');
        this.user = userid;
        this.ws.onopen = this.initClient.bind(this);
        this.ws.onmessage = this.receiveMessage.bind(this);
        this.callbacks = [];
    }

    initClient() {
        this.sendMessage({
            type: 'auth',
            msg: this.user
        });
    }

    sendMessage(msgObj) {
        this.ws.send(JSON.stringify(msgObj));
    }

    receiveMessage(event) {
        const parsedMsg = JSON.parse(event.data);
        this.callbacks.forEach(fn => {
            fn(parsedMsg);
        });
    }

    subscribe(callbackFn) {
        if(this.callbacks.indexOf(callbackFn) === -1)  {
            this.callbacks.push(callbackFn);
        }
    }

    unsubscribe(callbackFn) {
        const idx = this.callbacks.indexOf(callbackFn);
        if(idx !== -1) {
            this.callbacks.splice(idx, 1);
        }
    }
}