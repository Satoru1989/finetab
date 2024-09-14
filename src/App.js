import './App.css';
import React from 'react';

import { ThemeProvider } from 'styled-components';
import { Background } from './Background/backgroundComponent';
import Theme from './StyledComponents/theme';
import settingStore from './PersistentStorage/settingsStore';
import DesktopWithUI from './Desktop/desktopUI';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.theme = new Theme();
        this.state = {
            theme: this.theme.getTheme()
        }
    }

    setNewTheme = (newTheme) => {
        let theme = JSON.parse(newTheme);
        this.setState( { theme: theme });
    }

    componentDidMount() {
        settingStore.subscribeToSettingChange("theme", this.setNewTheme );
    }

    render() {  
        return (
            <div className="App">
                <ThemeProvider theme={this.state.theme}>
                    <Background/>
                    <DesktopWithUI/>
                </ThemeProvider>
            </div>
        );
    }
}

export default App;
