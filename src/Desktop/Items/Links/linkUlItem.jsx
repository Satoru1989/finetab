import React from "react";
import iconExtractor from "./getIcon";
import { Button } from "../../../StyledComponents/default";
import TitleToInput from "../../../UIComponents/titleToInput";

export default class LinkUlItem extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            iconUrl: ""
        };

        iconExtractor.getIconUrl(this.props.link).then(
            (url) => this.setState({iconUrl: url})
        );
    }

    render() {
        const iconAvailable = this.state.iconUrl !== "";

        return (
            <li>
                <TitleToInput
                    title={this.props.link}
                    inputSetting={
                    <>
                        { iconAvailable && 
                            <Button fontSize="17px" onClick={ () => {
                                this.props.setLinkInputValue(this.state.iconUrl);
                            }}>copy icon url</Button>
                        }
                        <Button fontSize="17px" onClick={this.props.onDelete}>delete</Button>
                    </>}  
                />
            </li>
        );
    }
}
