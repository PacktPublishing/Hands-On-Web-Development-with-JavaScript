export default class BuzzApp extends HTMLElement {
    constructor() {
        super();
        const templateStr = /*html*/`
        <template id="buzz-app">
            <div class="col-md-3 bg-dark p-0 scrollable float-left">
                <my-nav></my-nav>
            </div>
            <div class="col-md-9 bg-secondary p-0 scrollable"></div>
        </template>`;
        const parser = new DOMParser();
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#buzz-app').content.cloneNode(true);
        const navbarBrand = shadowTemplate.querySelector('my-nav');
        navbarBrand.setAttribute('brand-name', this.getAttribute('brand-name'));
        navbarBrand.setAttribute('href', this.getAttribute('href'));
        this.appendChild(shadowTemplate);
    }

    static register() {
        customElements.define('buzz-app', this);
    }
}