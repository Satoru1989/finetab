import React from "react";
import { BackgroundDiv, Button } from "../StyledComponents/default";
import styled from 'styled-components'
import ItemFormFactory from "./itemFormFactory";
import ItemEvent from "./itemEvent"
import Settings from "../Settings/settings";

export default class ContextMenu extends React.Component {

    constructor(props) {
        super(props);
    
        this.itemFormFactory = new ItemFormFactory();
        this.itemFormFactory.setOnCloseCallback(
            () => this.props.onFormCloseCallback()
        );

        this.itemJson = {};

        this.state = {
            isVisible: false,
            x: 0,
            y: 0
        }
    }

    setNewForm = (form) => {
        this.props.newFromCallback(form);
    }

    hide = () => {
        this.setState({isVisible: false});
    }

    onRightClick = (x, y, json) => {
        this.itemJson = structuredClone(json);



        this.setState({
            isVisible: !this.state.isVisible,
            x: x,
            y: y
        });
    }

    render() {
        const Div = styled(BackgroundDiv)`
            position: absolute;
            width: auto;
            height: auto;
            padding: 5px;
            left: ${this.state.x}px;
            top: ${this.state.y}px;
            visibility: ${this.state.isVisible ? 'visible' : 'hidden'};
            text-align: center;
            & > * {
                display: block;
            }
        `;

        const clickedOnItem = this.itemJson.id !== null && this.itemJson.name !== null &&
            this.itemJson.id !== undefined && this.itemJson.name !== undefined

        return (
            <Div>
                {
                    /**
                     *      TODO:
                     *      To create any item easily there needs to be 
                     *      some sort of item selection menu where when item is selected the callback
                     *      will return the name of the item so that ContextMenu class could create it
                     *      using factory
                     * 
                     *  <Button width="100%"> Add Item</Button>
                    */
                } 
                
                <Button $width="100%" 
                    onClick={ () => this.setNewForm(
                            this.itemFormFactory.getCreateFormByName("link")
                        )}> 
                        Add Link </Button>
                <Button $width="100%" 
                    onClick={ () => this.setNewForm(
                            <Settings onCloseCallback={this.props.onFormCloseCallback}/>
                        )}>
                     Settings
                </Button>
                { clickedOnItem && 
                    <Button $width="100%" 
                        onClick={() => this.setNewForm(
                            this.itemFormFactory.getEditFormByName(this.itemJson)
                        )}> 
                        Edit </Button> }
                { clickedOnItem && 
                    <Button $width="100%" onClick={() => {
                        let itemEvent = new ItemEvent();
                        itemEvent.isDeleteEventType = true;
                        itemEvent.itemJson = {name: this.itemJson.name, id: this.itemJson.id}
                        itemEvent.dispatchEvent();
                    }}> Delete </Button> }
            </Div>
        );
    }
}