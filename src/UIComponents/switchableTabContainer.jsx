import React from "react";
import { Button, BackgroundDiv } from "../StyledComponents/default";
import styled from "styled-components";

/** 
* @param nameToTabComponent example { "Color Settings": \<Settings/> }
*/
export class SwitchableTabContainer extends React.Component{
    constructor(props) {
        super(props);

        this.names = Object.keys(this.props.nameToTabComponent);
        this.tabComponents = Object.values(this.props.nameToTabComponent);
        this.numberOfTabs = this.tabComponents.length;
        this.tabRefs = new Array(this.numberOfTabs).fill(null);
        this.currentTabIndex = 0;

        this.tabs = this.getWrappedTabComponents();

        this.bar = this.names.map( (name, tabIndex) => 
            this.createTabButton(name, tabIndex)
        );
    }

    wrapSingleTabComponent = (component, tabIndex) => {
        this.tabRefs[tabIndex] = React.createRef();

        return (<div key={tabIndex} ref={this.tabRefs[tabIndex]}
             style={{display: 0 === tabIndex ? "block" : "none"}}> 
            {component}
        </div>);
    }

    getWrappedTabComponents = () => 
        this.tabComponents.map( (component, tabIndex) =>
            this.wrapSingleTabComponent(component, tabIndex)
        );

    handleTabSwitch = (tabIndex) => {
        if(tabIndex < this.numberOfTabs) {
            this.tabRefs[this.currentTabIndex].current.style.display = "none";
            this.currentTabIndex = tabIndex;
            this.tabRefs[this.currentTabIndex].current.style.display = "block";
        }
    }

    createTabButton = (name, tabIndex) => 
        <Button key={tabIndex}
                onClick={ () => this.handleTabSwitch(tabIndex) }>
            {name}
        </Button>

    render() {
        const Div = styled(BackgroundDiv)`
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 5px;
            `;
        
        return ( 
            <Div style={{
                height: "75vh",
                width: "70vw",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }} >
                <div>
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between"
                }}>
                    <div>
                        {this.bar}
                    </div>
                    <Button $height="1.6em" $width="1.6em"
                        onClick={this.props.onCloseCallback}
                        >X</Button>
                </div>
                    {this.tabs}
                </div>

                <div>
                    {this.props.children}
                </div>
            </Div>
        );
    }
}