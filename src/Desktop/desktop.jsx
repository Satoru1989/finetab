import React from "react";
import DesktopModel from "./desktopModel";

const desktopModel = new DesktopModel();

export default class Desktop extends React.Component {    
    constructor(props) {
        super(props);

        this.componentsIsMounted = false;

        this.state = {
            items: []
        } 
    }

    componentDidMount() {
        if (!this.componentsIsMounted) {
            desktopModel.setUpdateItemsCallback( (newItems) => {
                this.setState( {items: newItems} );
            });  
            this.componentsIsMounted = true;
        }
    }

    render() {
        return (
            <>
                {this.state.items.map((item) => item)}
            </>
        );
    }
}