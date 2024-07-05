import React from "react";
import ContextMenu from "./contextMenu";
import Desktop from "./desktop";

export default class DesktopWrapper {
    constructor(props) {
        super(props)
        this.state = {
            currentItem: null
        }
    }

    itemRightClicked(e) {
        this.setState( {currentItem: e.detail} )
    }

    render() {
        return (
            <div>
                <ContextMenu item={this.state.currentItem}/>
                <Desktop/>
            </div>
        );
    }
}