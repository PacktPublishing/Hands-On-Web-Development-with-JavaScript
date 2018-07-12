import './my-chat.scss';

export default class MyChat extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-chat">
            <my-modal modal-title="Rate Image" primary-action="Like" secondary-action="Dislike"></my-modal>
            <div id="chat-messages"></div>
            <div class="fixed-bottom position-absolute">
                <div class="input-group">
                    <textarea class="form-control rounded-0" placeholder="Write your message here.." id="chat-input" rows="3" autocomplete="off"></textarea>
                    <div class="input-group-append">
                        <button id="chat-image-wrapper" class="btn btn-secondary rounded-0">
                            <span class="oi oi-image"></span>
                            <input type="file" class="d-none" id="chat-image"/>
                        </button>
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

    setStores(msgStore, frndStore) {
        this.msgStore = msgStore;
        this.msgStore.subscribe(this.dataChanged.bind(this));
        this.frndStore = frndStore;
    }

    dataChanged() {
        this.renderMessagesForFriend(this.selectedFriend);
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
        const chatImageEl = shadowTemplate.querySelector('#chat-image');
        shadowTemplate.querySelector('#chat-image-wrapper').addEventListener('click', event => {
            chatImageEl.click()
            event.preventDefault();
            event.stopPropagation();
        });
        chatImageEl.addEventListener('click', event => {
            event.stopPropagation();
        });
        chatImageEl.addEventListener('change', event => {
            const file = event.target.files[0];
            const reader = new FileReader();
            reader.onload = event => {
                const result = event.target.result;
                const blobObj = new Blob([new Uint8Array(result)]);
                this.sendMessage('', {
                    blob: window.URL.createObjectURL(blobObj),
                    file
                });
            };
	        reader.readAsArrayBuffer(file);
        });
        this.appendChild(shadowTemplate);
        this.querySelector('my-modal').setCallbacks(() => {
            this.sendMessage(`${this.frndStore.getAuthUser().name} likes the image you sent! :)`);
        }, () => {
            this.sendMessage(`${this.frndStore.getAuthUser().name} is not a fan of the image you sent! :/`);
        });
    }

    sendMessage(msg, image = null) {
        const msgObj = {
            text: msg,
            image: image,
            to: this.selectedFriend,
            time: new Date().toLocaleString()
        };

        let groupMembers = [];
        
        if(this.frndStore.isGroup(msgObj.to)) {
            groupMembers = this.frndStore.getById(msgObj.to).friendList.map(user => user);
        }

        this.msgStore.sendMessage(msgObj, groupMembers);
    }

    renderMessagesForFriend(userId) {
        this.selectedFriend = userId;
        let msgs = this.getMessagesForFriend(userId);
        let msgTemplate = '';
        if(this.frndStore.isGroup(userId)) {
            const grp = this.frndStore.getById(userId);
            if(grp.friendList.length > 0) {
                const friendNames = grp.friendList.map(id => this.frndStore.getAnyUserById(id).name);
                msgTemplate += `<div class="card card-body bg-dark text-light rounded-0 py-1">Members: ${friendNames.join(', ')}</div>`;
            }
        }
        else {
            msgs = msgs.filter(msg => !this.frndStore.isGroup(msg.to));
        }
        msgs.forEach(msg => {
            const imageTemplate = msg.image ? `<img src="${msg.image}" class="img-thumbnail" data-from='${msg.from}'/>` : '';
            msgTemplate += `<div class="card card-body bg-info text-light mx-3 my-2 px-3 py-2">
                <div class="card-title message-meta font-weight-bold">
                    ${msg.from}
                    <span class="font-weight-normal float-right">${msg.time}</span>
                </div>
                <div class="card-text message-text">
                    ${imageTemplate}
                    ${msg.text}
                </div>
            </div>`;
        });
        const messagesEl = this.querySelector('#chat-messages');
        messagesEl.innerHTML = msgTemplate;

        const authUser = this.frndStore.getAuthUser();
        messagesEl.querySelectorAll('img').forEach(img => {
            if(img.dataset.from !== authUser.userid) {
                img.addEventListener('click', (event) => {
                    this.openModalForImage(img);
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });
    }

    openModalForImage(imgEl) {
        const modalEl = this.querySelector('my-modal');
        const src = imgEl.getAttribute('src').trim();
        modalEl.setBody(`
            <img class='img-fluid' src='${src}'/>
        `);
        modalEl.open();
    }

    static register() {
        customElements.define('my-chat', this);
    }
}