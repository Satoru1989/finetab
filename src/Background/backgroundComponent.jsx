import React from "react";
import { BackgroundLoader } from "./backgroundLoader";
import { newBackgroundUploadedEventName } from "./backgroundBean";
import styled from "styled-components";
import settingStore from "../PersistentStorage/settingsStore";

export class Background extends React.Component {
    constructor(props) {
        super(props);
        this.backgroundLoader = new BackgroundLoader();
        this.isComponentMounted = false;
        
        let fit = settingStore.getSetting("background-object-fit");
        settingStore.subscribeToSettingChange("background-object-fit", this.handleObjectFitStyleValueChange);
        if (!fit) fit = "contain";

        this.state = {
            background: {},
            objectFitValue: fit
        }

        this.videoRef = React.createRef();

        window.addEventListener(newBackgroundUploadedEventName, this.handleNewBackgroundEvent);
        
        this.backgroundLoader.getBackgroundBeanPromise().then(
            (bk) => this.setState({background: bk})
        );
    }

    handleVideoOnEnded = (e) => {
        if (this.videoRef.current != null)
            this.videoRef.current.play();
    }

    handleObjectFitStyleValueChange = (newObjectFitStyleValue) => {
        this.setState({objectFitValue: newObjectFitStyleValue});
    }

    handleNewBackgroundEvent = (newBackgroundEvent) => {
        this.setState({background: newBackgroundEvent.detail});
    }

    componentWillUnmount() {
        window.removeEventListener(newBackgroundUploadedEventName, this.handleNewBackgroundEvent);
    }

    render() { 
        const baseStyle = props => `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: 100%;
            max-height: 100%;
            border: 0;
            margin: 0;
            user-select: none;
            -webkit-user-drag: none;
            width: 100%;
            height: 100%;
            object-fit: ${this.state.objectFitValue};
        `;

        const Video = styled.video.attrs({
            onContextMenu: (e) => e.preventDefault(),
        })`${baseStyle}`;

        const Img = styled.img.attrs({
            draggable: "false",
            onContextMenu: (e) => e.preventDefault(),
        })`
            ${baseStyle}
        `;
    
        const IframeContainer = styled.div`
            border: 0;
            margin: 0;
            width: 100vw;
            height: 100vh;
            overflow: hidden;
            position: relative;
            user-select: none;
            display: flex; 
            justify-content: center;
            align-items: center;
        `;
          
        // in the current configuration iframe is buggy/doesn't work
        const StyledIframe = styled.iframe.attrs({
            tabIndex: -1
        })`
            position: absolute;
            border: 0;
            margin: 0;
            top: -8%;
            width: 100%;
            height: 108%;
            pointer-events: none;
            user-select: none;
        `;

        const IframeOverlay = styled.div`
            position: absolute;
            top: 0%;
            left: 0%;
            width: 100%;
            height: 100%;
        `;

        return (
            <div>
                 {
                    this.state.background.type === "video" && 
                    <Video ref={this.videoRef} onEnded={this.handleVideoOnEnded} disablePictureInPicture autoPlay muted> 
                        <source src={this.state.background.data} type="video/mp4"/>
                    </Video> 
                } {
                    this.state.background.type === "youtubeUrl" &&
                    <>
                        <IframeContainer>
                            <StyledIframe title="backgroundIframe" 
                                width="100%" height="100%" src={this.state.background.data}>
                            </StyledIframe>
                        </IframeContainer>
                        <IframeOverlay/>
                    </>
                } {
                    this.state.background.type === "image" &&
                    <Img src={this.state.background.data} alt="oops"/> 
                }
            </div>
        );
    }
}