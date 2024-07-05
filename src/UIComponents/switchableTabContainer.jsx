
import React from "react";
import { Button } from "../StyledComponents/default";

/** 
* @param nameToTabComponent example { "Color Settings": \<Settings/> }
*/
export class SwitchableTabContainer extends React.Component{
    constructor(props) {
        super(props);

        this.state = {
            currentTabIndex: 0
        }

        this.names = Object.keys(this.props.nameToTabComponent);
        this.tabComponents = Object.values(this.props.nameToTabComponent);
        this.numberOfTabs = this.tabComponents.length;
    }

    getDisplayStyleForTabComponent = (tabIndex) =>
        this.state.currentTabIndex === tabIndex ? "block" : "none";

    wrapSingleTabComponent = (component, tabIndex) => 
        <div key={tabIndex} 
             style={{display: this.getDisplayStyleForTabComponent(tabIndex)}}> 
            {component}
        </div>

    getWrappedTabComponents = () => 
        this.tabComponents.map( (component, tabIndex) =>
            this.wrapSingleTabComponent(component, tabIndex)
        );

    handleTabSwitch(tabIndex) {
        if(tabIndex < this.numberOfTabs)
            this.setState({currentTabIndex: tabIndex});
    }

    createTabButton = (name, tabIndex) => 
        <Button key={tabIndex}
                onClick={ () => this.handleTabSwitch(tabIndex) }>
            {name}
        </Button>

    render() {
        const tabs = this.getWrappedTabComponents();

        const bar = this.names.map( (name, tabIndex) => 
            this.createTabButton(name, tabIndex)
        );

        return ( <>
                <div>
                    {bar}
                </div>
                <div>
                    {tabs}
                </div>
            </>
        );
    }
}