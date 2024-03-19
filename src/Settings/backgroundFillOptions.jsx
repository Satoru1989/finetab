
import React from 'react';
import { Button } from "../StyledComponents/default";
import { withTheme } from 'styled-components';
import TitleToInput from '../UIComponents/titleToInput';
import settingStore from '../PersistentStorage/settingsStore';

class BackgroundFillOptions extends React.Component {    
    constructor(props) {
        super(props);
        this.settingName = "background-object-fit";
        let fillSetting = settingStore.getSetting(this.settingName);

        this.state = {
            selectedOption: fillSetting || "none"
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    setNewFillSetting = (newSetting) => {
        let newFillSetting = newSetting;
        settingStore.setSetting(this.settingName, newFillSetting);
    }

    handleOptionChange = (event) => {
        let newState = event.target.name;
        this.setState({ selectedOption: newState});
        this.setNewFillSetting(newState);

        if (this.props.onOptionChange !== undefined)
            this.props.onOptionChange(newState);
    }

    renderButton = (name, option) => {
        const { theme } = this.props;
        return (
            <Button
                name={name}
                onClick={this.handleOptionChange}
                style={{
                    marginLeft: "5px",
                    border: this.state.selectedOption === name ? `2px solid ${theme.textColor}` : 'none'
                }}
            >
                {option}
            </Button>
        );
    }

    render() {
        return (
            <TitleToInput
                title="Fill"
                inputSetting={ <>
                    {this.renderButton("none", "none")}
                    {this.renderButton("contain", "uniform fill")}
                    {this.renderButton("fill", "fill all")}
                </>}
            />
        );
    }
}

export default withTheme(BackgroundFillOptions); 