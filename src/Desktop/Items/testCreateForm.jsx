import React from "react";
import { Button } from "../../StyledComponents/default";

export default class TestItemForm extends React.Component {

    handleSubmit = () => {
        this.props.onSubmit({
            name: "testItem",
            info: "bananas"
        });
    }

    render() {
        console.log("sou desune");
        return (
            <div style={ {
                    height: '100px', width: '100px', backgroundColor: 'black',
                    left: '50%', top: '50%',
                    position: 'absolute'
                } }>

                <Button onClick={this.handleSubmit}> Submit </Button>
            </div>
        );
    }
}