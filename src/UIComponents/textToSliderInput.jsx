import React from "react";
import { SmallLabel } from "../StyledComponents/default";
import TitleToInput from "./titleToInput";

export default class TextToSliderInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: this.props.value
        }
    }

    handleValueChange = (event) => {
        this.setState({value: event.target.value});
        this.props.onChange(event.target.value);
    }

    render() {
        return (
            <TitleToInput
                title={this.props.title}
                inputSetting={
                    <>
                    <SmallLabel>{this.state.value}</SmallLabel>
                    <input type="range" 
                           min={this.props.min} max={this.props.max}
                           name={this.props.name}
                           value={this.state.value} 
                           onChange={ this.handleValueChange }/>
                    </>
                }
            />
        );
    }
}