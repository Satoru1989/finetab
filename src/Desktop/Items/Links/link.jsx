import React from "react";
import styled from "styled-components";
import Draggable from "../../../UIComponents/darragable";

export default class Link extends React.Component {
    constructor(props) {
        super(props);

        this.data = this.props.data;
        this.imgSrc = this.data.isFile ? URL.createObjectURL(this.data.src) : this.data.src;
    }

    componentWillUnmount() {
        if (this.data.isFile)
            URL.revokeObjectURL(this.imgSrc);
    }

    onClick = (e) => {
        this.data.links.map(link => window.open(link, '_blank'));
    }

    render() {
        const Title = styled.span`
            font-size: ${this.data.fontSize}px;
            font-family: sans-serif;
            border-size: 0px;
            padding: 0px;
            margin: 0px;
            color: black;
            display: block;
            text-align: center;
            color: ${this.data.textColor};
        `;

        const Img = styled.img`
            width: ${this.data.imgWidth}px;
            height: ${this.data.imgHeight}px;
            user-select: none;
            border-radius: ${this.data.borderRadius}px;
        `;

        return (
            <Draggable newPosition={ (x, y) => {
                    this.data['x'] = x;
                    this.data['y'] = y;
                    this.props.saveItemState(this.data);
                }}
                initialX ={this.data.x} initialY={this.data.y}>
                
                <Img draggable="false" alt="ops no image" 
                     src={this.imgSrc} 
                     onClick={this.onClick}
                     />
                <Title>{this.data.title}</Title>
            </Draggable>
        );
    }
}