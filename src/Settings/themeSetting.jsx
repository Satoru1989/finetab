import React from "react";
import {Button, ContainerDiv, Label} from "../StyledComponents/default";

import { ColorSelector, formatColorToHex } from "../UIComponents/colorSelector";
import Theme from "../StyledComponents/theme";

export default class ThemeSettingsWindow extends React.Component {
    constructor(props) {
        super(props);
        this.theme = new Theme();

        this.state = {
            theme: this.theme.getTheme()
        }
    }

    onSubmit(e) {
        e.preventDefault();
 
        this.theme.setTheme({
            backgroundColor: formatColorToHex(e.target.background.value, e.target.backgroundOpacity.value),
            primaryColor: formatColorToHex(e.target.primary.value, e.target.primaryOpacity.value),
            secondaryColor: formatColorToHex(e.target.secondary.value, e.target.secondaryOpacity.value),
            textColor: formatColorToHex(e.target.text.value, e.target.textOpacity.value)
        });
    }
    
    render() {
        return ( 
            <>
            <form onSubmit={ (e) => this.onSubmit(e)}>
            <ContainerDiv>
                <div align="right">     
                    <Label >opacity / color </Label>
                </div> 
                <ColorSelector color={this.state.theme.backgroundColor} name={"background"} title={"Background Color"} />
                <ColorSelector color={this.state.theme.primaryColor} name={"primary"} title={"Elements Color"}/>
                <ColorSelector color={this.state.theme.secondaryColor} name={"secondary"} title={"Highlight Color"}/>
                <ColorSelector color={this.state.theme.textColor} name={"text"} title={"Text Color"}/>
                <Button type="submit">Apply</Button>
            </ContainerDiv>
            </form>
            </>
        );
    }
}