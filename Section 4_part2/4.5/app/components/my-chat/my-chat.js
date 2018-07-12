import './my-chat.scss';

export default class MyChat extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-chat">
            <my-modal modal-title="Rate Image" primary-action="Like" secondary-action="Dislike"></my-modal>
            <my-modal id="view-modal" modal-title="Image Preview" primary-action="Close" secondary-action="Okay"></my-modal>
            <div id="image-gallery" class="d-none"></div>
            <div id="chat-messages"></div>
            <div id="input-area">
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
            chatImageEl.click();
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
                chatImageEl.value = '';
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
        const msgs = this.getMessagesForFriend(userId);
        let msgTemplate = '';
        let displayNames = '';
        if(this.frndStore.isGroup(userId)) {
            const grp = this.frndStore.getById(userId);
            if(grp.friendList.length > 0) {
                const friendNames = grp.friendList.map(id => this.frndStore.getAnyUserById(id).name);
                displayNames = `Members: ${friendNames.join(', ')}`;
            }
        }
        else {
            const friendName = this.frndStore.getAnyUserById(userId).name;
            displayNames = `${friendName}`
        }
        msgTemplate += `<div class="card card-body bg-dark text-light rounded-0 py-1 flex-row"><span>${displayNames} </span><span id="view-images" class="ml-auto link">View Images</span></div>`;

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
        const imageList = messagesEl.querySelectorAll('img');
        imageList.forEach(img => {
            if(img.dataset.from !== authUser.userid) {
                img.addEventListener('click', (event) => {
                    this.openModalForImage(img);
                    event.preventDefault();
                    event.stopPropagation();
                });
            }
        });

        messagesEl.querySelector('#view-images').addEventListener('click', () => {
            let imagesTemplate = `<div class="btn btn-primary float-right oi oi-x"></div><div class="d-flex flex-wrap justify-content-around">`;
            imagesTemplate += `</div>`;
            const galleryEl = this.querySelector('#image-gallery');
            const inputAreaEl = this.querySelector('#input-area');
            const viewImagesEl = messagesEl.querySelector('#view-images');
            
            [inputAreaEl, viewImagesEl, messagesEl].forEach(el => el.classList.add('d-none'));

            galleryEl.innerHTML = imagesTemplate;
            const flex = galleryEl.querySelector('div.d-flex');

            imageList.forEach(image => {
                image = image.cloneNode(true);
                image.classList.add('p-3');
                image.addEventListener('click', () => {
                    this.viewImage(image);
                });
                flex.appendChild(image);
            });

            galleryEl.classList.remove('d-none');

            galleryEl.querySelector("div.oi-x").addEventListener('click', (event) => {
                [inputAreaEl, viewImagesEl, messagesEl].forEach(el => el.classList.remove('d-none'));
                galleryEl.classList.add('d-none');
                event.preventDefault();
                event.stopPropagation();
            });
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

    viewImage(imgEl) {
        const modalEl = this.querySelector('#view-modal');
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