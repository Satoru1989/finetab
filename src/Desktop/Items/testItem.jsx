import React from "react";
import Draggable from "../../UIComponents/darragable";

export default class TestItem extends React.Component {
    render() {
        return (
            <Draggable>
                <div 
                    onClick={ (e) => { 
                        console.log('click'); 
                    }}
                    style={ {height: '50px', width: '50px', backgroundColor: 'blue'} }>
                </div>
            </Draggable>
        );
    }
}