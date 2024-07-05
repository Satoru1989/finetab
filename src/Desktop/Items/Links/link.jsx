import React from "react";
import styled from "styled-components";
import Draggable from "../../../UIComponents/darragable";

export default class Link extends React.Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;

        console.log("link data ", this.data);
        this.imgSrc = this.data.isFile ? URL.createObjectURL(this.data.src) : this.data.src;


        this.x = window.innerWidth * 0.25;
        this.y = window.innerHeight * 0.25
    }

    componentWillUnmount() {
        if (this.data.isFile)
            URL.revokeObjectURL(this.imgSrc);
    }

    onClick(e) {
        this.data.links.map(link => window.open(link, '_blank'));
    }

    render() {
        const Img = styled.img`
            width: ${this.data.imgWidth}px;
            height: ${this.data.imgHeight}px;
            user-select: none;
        `;

        console.log(`src: ${this.imgSrc}`)

        return (
            <Draggable newPosition={ (x, y) => {
                    this.x = x;
                    this.y = y;  
                }}
                initialX ={this.x} initialY={this.y}>
                
                <div 
                    style={ {height: '100px', width: '100px', backgroundColor: 'red'} }>
                </div>

            </Draggable>
        );
    }
}