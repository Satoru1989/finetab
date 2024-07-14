import React from 'react';
import FileUrlInputSetting from '../UIComponents/fileUrlInputSetting';
import BackgroundFillOptions from './backgroundFillOptions';
import { Button, ContainerDiv } from '../StyledComponents/default';
import OnOffSwitch from '../UIComponents/onOffSwitch';
import BackgroundSaver from '../Background/backgroundSaver';
import settingStore from '../PersistentStorage/settingsStore';
import styled from 'styled-components';
import TitleToInput from '../UIComponents/titleToInput';

export default class GeneralSettingsWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            isFile: true,
            errorMessage: ""
        };

        this.backgroundSaver = new BackgroundSaver();
        this.backgroundDataRef = React.createRef();
        this.desktopSwitchWithMouseAllowed = settingStore.getSetting('desktopSwitchWithMouseAllowed');
        if (this.desktopSwitchWithMouseAllowed === undefined || this.desktopSwitchWithMouseAllowed === null) {
            settingStore.setSetting('desktopSwitchWithMouseAllowed', 'on');
            this.desktopSwitchWithMouseAllowed = 'on';
        }
    }

    handleOptionChange = () => {
        this.setState( {isFile: !this.state.isFile} );
    }

    handleApply = () => {
        this.backgroundSaver.onErrorCallback = (errorMessage) =>
            this.setState({errorMessage: errorMessage})
        
        if (this.state.isFile) {
            let blob = this.backgroundDataRef.current.files[0];
            this.backgroundSaver.saveBlob(blob);
        } else {
            let url = this.backgroundDataRef.current.value;
            this.backgroundSaver.saveUrl(url);
        }
    }

    render() {
        let ErrorMessageLabel = styled.label`
            color: red;
            font-size: 1.3em;
        `;

        return (
            <ContainerDiv>
                <ErrorMessageLabel> {this.state.errorMessage} </ErrorMessageLabel>
                <FileUrlInputSetting 
                    title="Background"
                    selectedOption={this.state.isFile ? 'file' : 'link'}
                    handleOptionChange={this.handleOptionChange}
                    accept="image/*,video/mp4"
                    inputRef={this.backgroundDataRef}
                />
                <BackgroundFillOptions/>
                <TitleToInput
                    title={ 'Mouse desktop switch' }
                    inputSetting={
                    <OnOffSwitch 
                        onOptionChange={(option) => {settingStore.setSetting('desktopSwitchWithMouseAllowed', option)}} 
                        selected={this.desktopSwitchWithMouseAllowed}
                        onText="on" offText="off"/>
                    }
                />
                <Button onClick={this.handleApply}>Apply</Button>
            </ContainerDiv>
        );
    }
}
