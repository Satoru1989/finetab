import React from "react";
import {SmallLabel} from "../StyledComponents/default";
import TitleToInput from "./titleToInput";

export function formatColorFromHex(rgba) {
    const rgb = rgba.slice(0, 7);
    const opacityHex = rgba.slice(7);

    const decimalValue = parseInt(opacityHex, 16);
    const percentage = (decimalValue / 255) * 100;

    return {initialOpacity: Math.round(percentage), initialColor: rgb}
}

export function formatColorToHex(color, opacity) {
    let opacityDec = Math.round(opacity / 100 * 255);
    let opacityHex = opacityDec.toString(16).padStart(2, '0');
    return color + opacityHex;
}

export class ColorSelector extends React.Component {
    constructor(props) {
        super(props);
        const { color } = props;
        const { initialOpacity } = formatColorFromHex(color);
        this.state = {
            opacityValue: initialOpacity
        };

        this.colorRef = React.createRef();
    }

    getColor() {
        return formatColorToHex(this.colorRef.current.value, this.state.opacityValue);
    }

    handleOpacityChange = (event) => {
        this.setState({opacityValue: event.target.value});
    }

    render() {
        const { title, name, color } = this.props;
        const { initialColor } = formatColorFromHex(color);
        return (
            <TitleToInput
                title={title}
                inputSetting={
                <div>
                    <SmallLabel>{this.state.opacityValue}%</SmallLabel>
                    <input type="range" min="0" max="100" name={name + "Opacity"}
                            value={this.state.opacityValue} onChange={ this.handleOpacityChange }/>
                    <input ref={this.colorRef} type="color" name={name} defaultValue={initialColor} />
                </div>
                }
            />
        );
    }
}