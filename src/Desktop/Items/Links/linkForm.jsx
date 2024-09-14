import React from "react";
import { SwitchableTabContainer } from "../../../UIComponents/switchableTabContainer";
import LinkDetailsForm from "./linkDetailsForm";
import { Button } from "../../../StyledComponents/default";
import CustumizeLinkForm from "./custumizeLinkForm";
import { formatColorToHex } from "../../../UIComponents/colorSelector";

export default class LinkForm extends React.Component {
    constructor(props) {
        super(props);
        this.links = [];
        this.linkDetailsRef = React.createRef();
    }

    getImageDimensions(preferedDiagonal, src) {
        const maxWidth = (window.innerWidth * 0.75);
        const maxHeight = (window.innerHeight * 0.75)

        let img = new Image();

        if (this.isFile)
            src = URL.createObjectURL(src);

        return new Promise(resolve => {
            img.onload = () => {
                let width = img.width;
                let height = img.height;
                const originalDiagonal = Math.round(Math.sqrt(width * width + height * height));
                const factor = preferedDiagonal / originalDiagonal;
                
                width = img.width * factor;
                height = img.height * factor;

                if (maxHeight < height)
                    height = maxHeight - (img.height * factor) % maxHeight;
                if (maxWidth < width)
                    width = maxWidth - (img.height * factor) % maxWidth;

                if (this.isFile)
                    URL.revokeObjectURL(src);

                resolve([width, height]);
            };
            img.src = src;
        });
    }

    async sendData(e) {
        
        let src = e.target.src;
        src = this.isFile ? src.files[0] : src.value; 

        let isImgSrcUnchanged = (src === '' || src === undefined || src === null)
        if (isImgSrcUnchanged) {
            if (this.props.defaultData == null) {
                this.linkDetailsRef.current.displayError("Image not selected");
                return;
            }

            src = this.props.defaultData.src;
        }

        const [ imgWidth, imgHeight ] = await this.getImageDimensions(e.target.diagonalSize.value, src);         

        const textColorOpacity = parseInt(e.target.textColorOpacity.value);
        const textColor = formatColorToHex(e.target.textColor.value, textColorOpacity);

        const data = {
            src: src,
            title: e.target.title.value,
            isFile: this.isFile,
            imgWidth: imgWidth, 
            imgHeight: imgHeight,
            links: this.links,
            textColor: textColor,
            borderRadius: e.target.borderRadius.value,
            fontSize: e.target.fontSize.value
        }

        this.props.onSubmit(data);
        this.props.onClosing();
    } 

    handleSubmit = (e) => {
        e.preventDefault();
        e.stopPropagation();

        this.sendData(e);
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <SwitchableTabContainer 
                    onCloseCallback={this.props.onClosing}
                    nameToTabComponent={{ 
                    "Main": <LinkDetailsForm 
                        defaultData={this.props.defaultData}
                        setNewLinks={(newArr) => this.links = newArr}
                        setIsFile={ (newVal) => this.isFile = newVal}
                        ref={this.linkDetailsRef}/>,
                    "Customize": <CustumizeLinkForm
                        defaultData={this.props.defaultData}/>
                }}>
                    <Button type="submit"> Apply </Button>
                </SwitchableTabContainer>
            </form>
        );
    }
}