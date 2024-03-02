
import React from 'react';
import { Button } from "../StyledComponents/default";
import { withTheme } from 'styled-components';
import TitleToInput from '../UIComponents/titleToInput';

class BackgroundFillOptions extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: this.props.selected || "none"
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = (event) => {
        let newState = event.target.name;
        this.setState({ selectedOption: newState});
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
                    {this.renderButton("uniformFill", "uniform fill")}
                    {this.renderButton("fillAll", "fill all")}
                </>}
            />
        );
    }
}

export default withTheme(BackgroundFillOptions); 