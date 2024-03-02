import React from 'react';
import FileUrlInputSetting from '../UIComponents/fileUrlInputSetting';
import BackgroundFillOptions from './backgroundFillOptions';
import { Button } from '../StyledComponents/default';
import BackgroundSaver from '../Background/backgroundSaver';
import styled from 'styled-components';


class BackgroundSettingsWindow extends React.Component {

    constructor(props) {
        super(props);
        this.state = { 
            isFile: true,
            errorMessage: ""
        };

        this.backgroundSaver = new BackgroundSaver();
        this.backgroundDataRef = React.createRef();
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
        let Container = styled.div`
            > * {
                margin: 5px;
            }
            text-align: center;
            margin: 20px;
        `;

        let ErrorMessageLabel = styled.label`
            color: red;
            font-size: 1.3em;
        `;

        return (
            <Container>
                <ErrorMessageLabel> {this.state.errorMessage} </ErrorMessageLabel>
                <FileUrlInputSetting 
                    title="Background"
                    selectedOption={this.state.isFile ? 'file' : 'link'}
                    handleOptionChange={this.handleOptionChange}
                    accept="image/*,video/mp4"
                    inputRef={this.backgroundDataRef}
                />
                <BackgroundFillOptions/>
                <Button onClick={this.handleApply}>Apply</Button>
            </Container>
        );
    }
}

export default BackgroundSettingsWindow;
