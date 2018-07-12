export default class MyChat extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-chat">
            <div id="chat-messages"></div>
            <div class="fixed-bottom position-absolute">
                <div class="input-group">
                    <textarea class="form-control rounded-0" placeholder="Write your message here.." id="chat-input" rows="3" autocomplete="off"></textarea>
                    <div class="input-group-append">
                        <button id="chat-send" class="btn btn-dark rounded-0">Send</button>
                    </div>
                </div>
            </div>
        </template>`;
        this.msgStore = {};
        this.selectedFriend = '';
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        if(!this.hasChildNodes())
            this.render();
    }

    setMessagesStore(msgStore) {
        this.msgStore = msgStore;
    }

    getMessagesForFriend(userId) {
        return this.msgStore.getMessagesByUser(userId);
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-chat').content.cloneNode(true);
        shadowTemplate.querySelector('#chat-send').addEventListener('click', (event) => {
            const chatInpEl = this.querySelector('#chat-input');
            if(chatInpEl.value) {
                this.sendMessage(chatInpEl.value);
                chatInpEl.value = '';
            }
            event.preventDefault();
            event.stopPropagation();
        });
        this.appendChild(shadowTemplate);
    }

    sendMessage(msg) {
        const msgObj = {
            text: msg,
            from: 'cathy',
            to: this.selectedFriend,
            time: new Date().toLocaleString()
        }

        this.msgStore.sendMessage(msgObj);
        this.renderMessagesForFriend(this.selectedFriend);
    }

    renderMessagesForFriend(userId) {
        this.selectedFriend = userId;
        const msgs = this.getMessagesForFriend(userId);
        let msgTemplate = '';
        msgs.forEach(msg => {
            msgTemplate += `<div class="card card-body bg-info text-light mx-3 my-2 px-3 py-2">
                <div class="card-title message-meta font-weight-bold">
                    ${msg.from}
                    <span class="font-weight-normal float-right">${msg.time}</span>
                </div>
                <div class="card-text message-text">
                    ${msg.text}
                </div>
            </div>`;
        });
        this.querySelector('#chat-messages').innerHTML = msgTemplate;
    }

    static register() {
        customElements.define('my-chat', this);
    }
}