import React, {Component} from "react";
import { SwitchableTabContainer } from "../UIComponents/switchableTabContainer";
import GeneralSettingsWindow from './generalSettings';
import ThemeSettingsWindow from "./themeSetting";

export default class Settings extends Component {
    render() {
        return (
            <SwitchableTabContainer 
                onCloseCallback={this.props.onCloseCallback}
                nameToTabComponent={{
                    "General": <GeneralSettingsWindow/>,
                    "Theme": <ThemeSettingsWindow/>
                }}/>
        );
    }
}
