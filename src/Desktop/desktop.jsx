import React from "react";
import DesktopModel from "./desktopModel";

const desktopModel = new DesktopModel();
desktopModel.innitialize();

export default class Desktop extends React.Component {    
    constructor(props) {
        super(props);

        this.desktopModel = desktopModel;
        this.componentsIsMounted = false;

        this.state = {
            items: []
        } 
    }

    componentDidMount() {
        if (!this.componentsIsMounted) {
            this.desktopModel.setUpdateItemsCallback( (newItems) => {
                this.setState( {items: newItems} );
                console.log("Updaing desktop items");
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