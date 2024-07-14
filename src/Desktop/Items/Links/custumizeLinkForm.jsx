import React from "react";
import { ColorSelector } from "../../../UIComponents/colorSelector";
import TextToSliderInput from "../../../UIComponents/textToSliderInput";
import { ContainerDiv } from "../../../StyledComponents/default";

export default class CustumizeLinkForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            size: 225,
            fontSize: 26,
            borderRadius: 5
        }

        this.defaultColor = "#000000ff";
        if (this.props.defaultData !== undefined) {
            const width = this.props.defaultData.imgWidth;
            const height = this.props.defaultData.imgHeight;
            const imgDiagonalSize = Math.round(Math.sqrt(width * width + height * height));
            this.state = {
                size: imgDiagonalSize,
                fontSize: this.props.defaultData.fontSize,
                borderRadius: this.props.defaultData.borderRadius
            }
            this.defaultColor = this.props.defaultData.textColor;
        }

        this.colorRef = React.createRef();
    }

    render() {
        return (
            <ContainerDiv>
                <TextToSliderInput title="Diagonal Length" name="diagonalSize"
                    value={this.state.size} min={64} max={800} onChange={(value) => this.setState({size: value})}/>
                <TextToSliderInput title="Font Size" name="fontSize" min={0} max={64} 
                    value={this.state.fontSize} onChange={(value) => this.setState({fontSize: value})}/>
                <TextToSliderInput title="Roundness" name="borderRadius" min={0} max={100} 
                    value={this.state.borderRadius} onChange={(value) => this.setState({borderRadius: value})}/>
                <ColorSelector ref={this.colorRef} title="Text Color" name="textColor" color={this.defaultColor}/>
            </ContainerDiv>
        );
    }
}