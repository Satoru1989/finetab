import React from "react";
import styled from 'styled-components';
import ContextMenu from "./contextMenu";
import Desktop from "./desktop";

export default class DesktopWithUI extends React.Component {    
    constructor(props) {
        super(props);

        this.componentsIsMounted = false;

        this.contextMenuRef = React.createRef();

        this.state = {
            itemForm: null
        } 
    }    

    handleRightClick = (e) => {
        e.preventDefault();

        if (this.contextMenuRef.current === null) return;

        this.contextMenuRef.current.onRightClick(
            e.pageX,
            e.pageY,
            e.detail
        );
    }

    render() {
        const Div = styled.div`
            position: absolute;
            width: 100%;
            height: 100%;
        `;

        return (
            <Div onContextMenu={this.handleRightClick} 
                 onClick={(e) => {
                    if (this.contextMenuRef.current === null) return;
                    this.contextMenuRef.current.hide();
                 }}
                 onKeyDown={ (e) => e.stopPropagation() }>

                <Desktop/>

                <ContextMenu 
                    ref={this.contextMenuRef}
                    newFromCallback={ (newForm) => this.setState({itemForm: newForm}) }
                    onFormCloseCallback={ () => this.setState({itemForm: null}) }/>

                {this.state.itemForm}
            </Div>
        );
    }
}