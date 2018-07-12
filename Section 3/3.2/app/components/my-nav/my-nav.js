export default class MyNav extends HTMLElement {
    constructor() {
        super();
        const parser = new DOMParser();
        const templateStr = /*html*/`
        <template id="my-nav">
            <nav class="navbar navbar-dark bg-info">
                <div class="dropright">
                    <a href="" class="navbar-brand dropdown-toggle"></a>
                    <div class="dropdown-menu">
                        <a class="dropdown-item" href="#/support">Support</a>
                        <a class="dropdown-item" href="#/about">About</a>
                    </div>
                </div>
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
        const dmenu = shadowTemplate.querySelector('.dropdown-menu');
        const dright = shadowTemplate.querySelector('.dropright');
        dright.addEventListener('mouseover', (event) => {
            dmenu.classList.add('show');
            dright.classList.add('show');
        });
        dright.addEventListener('mouseout', (event) => {
            dmenu.classList.remove('show');
            dright.classList.remove('show');
        });
        navbarBrand.textContent = this.getAttribute('brand-name');
        navbarBrand.href = this.getAttribute('href');
        this.appendChild(shadowTemplate);
    }

    static register() {
        customElements.define('my-nav', this);
    }
}