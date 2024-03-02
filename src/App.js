import './App.css';
import React from 'react';

import styled, { ThemeProvider } from 'styled-components';
import Settings from './Settings/settings';
import { BackgroundComponent } from './Background/backgroundComponent';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            theme: {
                "backgroundColor":"#14141fbf",
                "primaryColor":"#28283ed9",
                "secondaryColor":"#141414ff",
                "textColor":"#ff66d6d9"
            }
        }

        this.settignsRef = React.createRef();
    }

    componentDidMount() {
        window.addEventListener('keypress', this.handleKeySPress);
    }

    componentWillUnmount() {
        window.removeEventListener('keypress', this.handleKeySPress);
    }

    handleKeySPress = (event) => {
        event.stopPropagation();
        if (event.key === 's' || event.key === 'S') {
            this.settignsRef.current.toggleVisibility();
        }
    }

    render() {
        return (
            <div className="App">
                <ThemeProvider theme={this.state.theme}>
                    <BackgroundComponent/>
                    <Settings ref={this.settignsRef}/>
                </ThemeProvider>
            </div>
        );
    }
}

export default App;
