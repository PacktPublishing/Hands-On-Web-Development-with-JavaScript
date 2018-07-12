export default class MyNav extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-nav">
            <nav class="navbar navbar-dark bg-info">
                <a href="" class="navbar-brand"></a>
            </nav>
        </template>`;
        this.template = parser.parseFromString(templateStr, "text/html");
    }

    connectedCallback() {
        this.render();
    }

    render() {
        const shadowTemplate = this.template.querySelector('template#my-nav').content.cloneNode(true);
        const navbarBrand = shadowTemplate.querySelector('.navbar-brand');
        navbarBrand.textContent = this.getAttribute('brand-name');
        navbarBrand.href = this.getAttribute('href');
        this.appendChild(shadowTemplate);
    }

    static register() {
        customElements.define('my-nav', this);
    }
}