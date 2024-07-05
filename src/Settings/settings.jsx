import React, {Component} from "react";

import { BackgroundDiv } from "../StyledComponents/default";
import { SwitchableTabContainer } from "../UIComponents/switchableTabContainer";
import GeneralSettingsWindow from './backgroundSettings';
import styled from "styled-components";
import ThemeSettingsWindow from "./themeSetting";

export default class Settings extends Component {
    constructor(props) {
        super(props);

        this.state = {
            visibility: "hidden"
        }
    }
    
    toggleVisibility() {
        let visibility = this.state.visibility === "hidden" ? "visible" : "hidden";
        this.setState( {visibility: visibility} );
    }
    
    render() {
        const SettignsDiv = styled(BackgroundDiv)`
            height: 75%;
            width: 75%;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            visibility: ${this.state.visibility};
        `;

        return (
            <SettignsDiv>
                <SwitchableTabContainer 
                    nameToTabComponent={{
                        "General": <GeneralSettingsWindow/>,
                        "Theme": <ThemeSettingsWindow/>
                     }}/>
            </SettignsDiv>
        );
    }
}
