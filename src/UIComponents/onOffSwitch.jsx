
import React from 'react';
import { Button } from "../StyledComponents/default";
import { withTheme } from "styled-components";

class OnOffSwitch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: this.props.selected
        }

        this.handleOptionChange = this.handleOptionChange.bind(this);
    }

    handleOptionChange = (event) => {
        let newState = this.state.selectedOption === 'on' ? 'off' : 'on'
        this.setState({ selectedOption: newState});
        if (this.props.onOptionChange !== undefined)
            this.props.onOptionChange(newState);
    }

    render() {
        const { theme } = this.props;

        return (
            <>
                <Button 
                    onClick={this.handleOptionChange}
                    style={{ border: this.state.selectedOption === 'on' ? `2px solid ${theme.textColor}` : 'none' }}>
                    {this.props.onText}
                </Button>
                <Button 
                    onClick={this.handleOptionChange}
                    style={{ border: this.state.selectedOption === 'off' ? `2px solid ${theme.textColor}` : 'none' }}>
                    {this.props.offText}
                </Button>
            </>
        );
    }
}

export default withTheme(OnOffSwitch); 