import React from "react";

/**
 * Wraps around any component to make it draggable.
 * 
 * ## Example Usage
 * ```jsx
 * <Draggable>
 *   <YourComponent/>
 * </Draggable>
 * ```
 *
 * ## Props: 
 *  @param newPosition - callback with new x,y position once drag ends.
 *                       Function signature: newPosition(x, y)
 *  @param initialX - The initial X position of the wrapper default(window.innerWidth * 0.25).
 *  @param initialY - The initial Y position of the wrapper default(window.innerHeight * 0.25).
 *  @param threshhold - by many coordinates mouse is moved before wrapper pos is updated default(10)
 *  @param cursorStyle - cursor style when dragging default('move')
*/
export default class Draggable extends React.Component {
    constructor(props) {
        super(props);

        this.threshhold = 10 || this.props.threshhold;
        this.cursorStyle = "move" || this.props.cursorStyle;

        let initialX = this.props.initialX ?? window.innerWidth * 0.25;
        let initilaY = this.props.initialY ?? window.innerHeight * 0.25;

        this.state = {
            x: initialX,
            y: initilaY,
            mouseOffsetX: 0,
            mouseOffsetY: 0,
            isDragged: false,
            isClickDisabled: false
        }

        this.childWrapperRef = React.createRef();
        this.wrapperHeight = -1;
        this.wrapperWidth = -1;
    }

    componentDidUpdate(prevProps) {
        if (this.wrapperHeight === -1 || this.wrapperWidth === -1) {
            this.wrapperHeight = this.childWrapperRef.current.offsetHeight;
            this.wrapperWidth = this.childWrapperRef.current.offsetWidth;
        }

        //saving position is on consumer
        if (this.props.initialX !== prevProps.initialX || 
            this.props.initialY !== prevProps.initialY) {
            this.setState({ x: this.props.initialX,
                            y: this.props.initialY});
        }
    }

    onDragStart = (e) => {
        e.dataTransfer.setDragImage(new Image(), 0, 0);
        e.dataTransfer.effectAllowed = "move";
        e.preventDefault();

        this.setState({
            mouseOffsetX: e.clientX - this.state.x,
            mouseOffsetY: e.clientY - this.state.y,
            isDragged: true,
            isClickDisabled: true
        });

        document.body.style.cursor = "move";
        document.addEventListener("mousemove", this.onMouseMove);
        document.addEventListener("mouseup", this.onMouseUp);
    }

    adjustPosForChildren = (mouseX, mouseY) => {
        // position for top left corner of wrapper
        let x = mouseX - this.state.mouseOffsetX;
        let y = mouseY - this.state.mouseOffsetY;
    
        // blocks from dragging outside the window borders
        x = Math.min(Math.max(x, 0), window.innerWidth - this.wrapperWidth);
        y = Math.min(Math.max(y, 0), window.innerHeight - this.wrapperHeight);

        return [x, y];
    }

    onMouseMove = (e) => {
        if (!this.state.isDragged) return;

        if (Math.abs(this.state.x - e.clientX) > this.threshhold ||
            Math.abs(this.state.y - e.clientY) > this.threshhold) {

            const [x, y] = this.adjustPosForChildren(e.clientX, e.clientY);

            this.setState({
                x: x,
                y: y 
            });
        }
    }

    onMouseUp = (e) => {
        if (!this.state.isDragged) return;

        const [x, y] = this.adjustPosForChildren(e.clientX, e.clientY);

        this.setState({
            x: x,
            y: y,
            mouseOffsetX: 0,
            mouseOffsetY: 0,
            isDragged: false
        });

        setTimeout(() => {
            this.setState({ isClickDisabled: false });
            }, 100);

        document.body.style.cursor = "auto";
        document.removeEventListener("mousemove", this.onMouseMove);
        document.removeEventListener("mouseup", this.onMouseUp);

        if (this.props.newPosition) 
            this.props.newPosition(x, y); 
    }

    render() {
        return (
        <div 
            ref={this.childWrapperRef}
            style={{
                position: "absolute",
                left: `${this.state.x}px`,
                top: `${this.state.y}px`, 
                pointerEvents: this.state.isClickDisabled ? "none" : "auto", 
                overflow: "hidden"
            }}  
                draggable="true" 
                onDragStart={this.onDragStart}>
            {this.props.children}
        </div>);
    }
}