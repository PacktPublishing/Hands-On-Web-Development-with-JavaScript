export default class MessagesStore {
    constructor(authUser, chatClient) {
        this.messages = [];
        this.authUser = authUser;
        this.chatClient = chatClient;
        this.chatClient.subscribe(this.receiveMessage.bind(this));
        this.callbacks = [];
    }

    loadData() {
        return new Promise((resolve, reject) => {
            this.messages = [];
            resolve(this.messages);
        });
    }

    getMessagesByUser(userId) {
        return this.messages.filter(msg => msg.from === userId || msg.to === userId);
    }

    sendMessage(msgObj, groupMembers) {
        msgObj.from = this.authUser;
        this.messages.push(msgObj);
        this.sendInstantMessage(msgObj, groupMembers);
        this.emitChangeEvent();
    }

    sendInstantMessage(msgObj, groupMembers) {
        const msg = {
            from: msgObj.from,
            to: msgObj.to,
            time: msgObj.time
        };
        if(groupMembers.length > 0) {
            let groupDetails = {};
            groupDetails.id = msgObj.to;
            groupDetails.members = groupMembers.filter(user => user !== this.authUser);
            msg.to = groupDetails;
        }
        msg.type = !msgObj.image ? 'text' : 'image';
        msg.msg = msgObj[msg.type];
        this.chatClient.sendMessage(msg);
    }

    receiveMessage(msgObj) {
        const msg = {
            from: msgObj.from,
            to: msgObj.to,
            time: msgObj.time
        };
        msg['text'] = '';
        msg['image'] = null;
        msg[msgObj.type] = msgObj.msg;
        this.messages.push(msg);
        this.emitChangeEvent();
    }

    emitChangeEvent() {
        this.callbacks.forEach(fn => {
            fn();
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