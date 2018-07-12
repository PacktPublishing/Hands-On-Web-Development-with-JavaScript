export default class BuzzApp extends HTMLElement {
    constructor() {
        super();
        const templateStr = /*html*/`
        <template id="buzz-app">
            <div class="col-md-3 bg-dark p-0 scrollable float-left">
                <nav class="navbar navbar-dark bg-info">
                    <a href="" class="navbar-brand"></a>
                </nav>
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
        const navbarBrand = shadowTemplate.querySelector('.navbar-brand');
        navbarBrand.textContent = this.getAttribute('brand-name');
        navbarBrand.href = this.getAttribute('href');
        this.appendChild(shadowTemplate);
    }

    static register() {
        customElements.define('buzz-app', this);
    }
}