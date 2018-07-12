class TryReact extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            names: []
        };
    }

    render() {
        return (
            <div>
                <button onClick={() => this.handleClick()}>Render List - Using React</button>
                {this.state.names.length > 0 && 
                    <ul>
                        {this.state.names.map((name, idx) => <li key={idx}>{name}</li>)}
                    </ul>
                }
            </div>
        );
    }

    handleClick() {
        const names = [
            'Ealasaid', 'Omero', 'Marge', 'Timofei', 'Heath', 'Devlen', 'Aubert', 'Annadiana', 'Elfrida', 'Kellen', 'Maria', 'Allie', 'Aloysia', 'Estele', 'Ebony', 'Myrle', 'Olimpia', 'Legra', 'Ray', 'Geno', 'York', 'Leese', 'Mersey', 'Melony', 'Melanie', 'Hermine', 'Tildy', 'Florie', 'Ilyssa', 'Ariella', 'Jonis', 'Humberto', 'Fax', 'Packston', 'Andrea', 'Dag', 'Ewan', 'Devonne', 'Leonie', 'Homerus', 'Julio', 'Yanaton', 'Hilliary', 'Bette', 'Melony', 'Merill', 'Craggy', 'Clayton', 'Salli', 'Lora'
        ];
        this.setState({names: names});
    }
}

ReactDOM.render(
    <TryReact></TryReact>,
    document.getElementById('root')
  );