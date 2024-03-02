import React, { Component } from 'react';
import { BackgroundDiv, Button } from '../StyledComponents/default';
import Settings from './../Settings/settings';
import styled from 'styled-components';

export default class CollapsingTaskbar extends Component {

    constructor(props) {
        super(props);

        this.collapsedHeight = "3px";
        this.expandedHeight = "3%";

        this.state = {
            isCollapsed: true,
            currentHeight: this.collapsedHeight,
            windowModal: null
        }
    };

    expandHeight = () => {
        this.setState({ 
            isCollapsed: false,
            currentHeight: this.expandedHeight
        });
    }

    collapseHeight = () => {
        this.setState({ 
            isCollapsed: true,
            currentHeight: this.collapsedHeight
        });
    }

    switchWindow = (windowModalComponent) => {
        this.setState({windowModal: windowModalComponent});
    }

    closeWindow = () => {
        this.setState({windowModal: null});
    }

    openSettingsWindow = () => 
        this.switchWindow(<Settings onClosing={this.closeWindow}/>) 

    render() {
        const taskbarStyle = {
            position: 'absolute',
            top: '0%',
            left: '0%',
            width: '100%',
            height: this.state.currentHeight,
        };

        const TaskbarButton = styled(Button)`
            height: auto;
            width: auto;
        `;

        return (
            <BackgroundDiv style={taskbarStyle} 
                           onMouseOver={this.expandHeight} 
                           onMouseLeave={this.collapseHeight} >
                {!this.state.isCollapsed && 
                    <TaskbarButton onClick={this.openSettingsWindow}>
                        ⚙
                    </TaskbarButton>}
                {this.state.windowModal}
            </BackgroundDiv>
        );
    }
}
