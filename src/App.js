import './App.css';
import React from 'react';

import { ThemeProvider } from 'styled-components';
import Settings from './Settings/settings';
import { Background } from './Background/backgroundComponent';
import Theme from './StyledComponents/theme';
import settingStore from './PersistentStorage/settingsStore';
import DesktopWithUI from './Desktop/desktopUI';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.theme = new Theme(this.persists);
        this.state = {
            theme: this.theme.getTheme()
        }

        this.settignsRef = React.createRef();
    }

    setNewTheme = (newTheme) => {
        let theme = JSON.parse(newTheme);
        this.setState( { theme: theme });
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeySPress);
        settingStore.subscribeToSettingChange("theme", this.setNewTheme );
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeySPress);
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
                    <Background/>
                    <DesktopWithUI/>
                    <Settings ref={this.settignsRef}/>
                </ThemeProvider>
            </div>
        );
    }
}

export default App;
