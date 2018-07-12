export default class MyModal extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-modal">
        <div class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"></h5>
                        <button type="button" id="close-button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" id="primary-button" class="btn btn-primary"></button>
                        <button type="button" id="secondary-button" class="btn btn-secondary" data-dismiss="modal"></button>
                    </div>
                </div>
            </div>
        </div>
        </template>`;
        this.template = parser.parseFromString(templateStr, "text/html");
        this.bodyTemplate = '';
        this.primaryCb = () => {};
        this.secondaryCb = () => {};
        this.backdrop = document.createElement('div');
        this.backdrop.classList.add('modal-backdrop', 'fade', 'show');
    }

    setBody(bodyTemplate) {
        this.bodyTemplate = bodyTemplate;
        this.querySelector('div.modal-body').innerHTML = this.bodyTemplate;
    }

    setCallbacks(primaryCb, secondaryCb) {
        this.primaryCb = primaryCb;
        this.secondaryCb = secondaryCb;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-modal').content.cloneNode(true);
        shadowTemplate.querySelector('h5.modal-title').textContent = this.getAttribute('modal-title');
        const primarybutton = shadowTemplate.querySelector('#primary-button');
        primarybutton.textContent = this.getAttribute('primary-action');
        primarybutton.addEventListener('click', (event) => {
            this.primaryCb(event);
            this.close();
            event.preventDefault();
            event.stopPropagation();
        });
        const secondarybutton = shadowTemplate.querySelector('#secondary-button');
        secondarybutton.textContent = this.getAttribute('secondary-action');
        secondarybutton.addEventListener('click', (event) => {
            this.secondaryCb(event);
            this.close();
            event.preventDefault();
            event.stopPropagation();
        });
        shadowTemplate.querySelector('#close-button').addEventListener('click', (event) => {
            this.close();
            event.preventDefault();
            event.stopPropagation();
        });
        this.appendChild(shadowTemplate);
    }

    open() {
        const modal = this.querySelector('div.modal.fade');
        modal.classList.add('show');
        modal.style.display = 'block';
        document.body.classList.add('modal-open');
        document.body.appendChild(this.backdrop);
    }

    close() {
        const modal = this.querySelector('div.modal.fade');
        modal.classList.remove('show');
        modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        document.body.removeChild(this.backdrop);
    }

    static register() {
        customElements.define('my-modal', this);
    }
}