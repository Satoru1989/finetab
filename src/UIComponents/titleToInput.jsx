import React from "react";
import { HighlightDiv, ContentCenteredDiv, Label } from "../StyledComponents/default";

/**
 * @param title
 * @param inputSetting
 */
export default class TitleToInput extends React.Component {
    render() {
        return (
            <HighlightDiv style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                paddingLeft: "5px",
                paddingRight: "7px"
                }}>
                <ContentCenteredDiv>
                    <Label> {this.props.title} </Label>
                </ContentCenteredDiv>
                <ContentCenteredDiv>
                    {this.props.inputSetting}
                </ContentCenteredDiv>
            </HighlightDiv>
        );
    }
}