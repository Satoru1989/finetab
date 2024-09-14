import React from "react";
import styled from "styled-components";
import FileUrlInputSetting from "../../../UIComponents/fileUrlInputSetting";
import TitleToInput from "../../../UIComponents/titleToInput";
import { Button, Label, SmallLabel, ContainerDiv, TextInput } from "../../../StyledComponents/default";
import LinkUlItem from "./linkUlItem";

export default class LinkDetailsForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: 'file',
            links: [],
            errorMsg: ""
        };

        this.titleRef = React.createRef();
        this.inputRef = React.createRef();
        this.linkRef = React.createRef();

        this.titlePlaceholder = "";

        if (this.props.defaultData !== undefined) {
            this.state.links = this.props.defaultData.links;
            this.titlePlaceholder = this.props.defaultData.title;
            this.state.selectedOption = this.props.defaultData.isFile ? 'file' : 'link';
        }
 
        this.props.setIsFile(this.state.selectedOption === 'file');

        this.innitialized = false;
    }

    componentDidMount() {
        if (this.props.defaultData !== undefined && !this.innitialized) {
            if (this.inputRef.current != null && !this.props.defaultData.isFile)
                this.inputRef.current.value = this.props.defaultData.src;
            if (this.titleRef.current != null)
                this.titleRef.current.value = this.titlePlaceholder;

            this.innitialized = true;
        }
    }

    displayError(msg) {
        this.setState({errorMsg: msg});
    }

    setLinkInputValue = (url) => {
        if (this.state.selectedOption !== 'link') {
            this.setState({selectedOption: 'link'}, 
                () => {
                     this.props.setIsFile(this.state.selectedOption === 'file');
                     this.setLinkInputValue(url);
                }) 
            return;
        }

        if (this.inputRef.current != null)
            this.inputRef.current.value = url;
    }

    handleOptionChange = (e) => this.setState({ 
        selectedOption: this.state.selectedOption === 'link' ? 'file' : 'link' 
    }, () => this.props.setIsFile(this.state.selectedOption === 'file'));
    
    handleAddLink = () => {
        this.setState(prevState => ({ links: [...prevState.links, this.linkRef.current.value] }),
            () => {
                this.linkRef.current.value = "";
                this.props.setNewLinks(this.state.links);
            }
        );
    }

    deleteLink = (index) => this.setState(prevState => ({ 
        links: prevState.links.filter((_, i) => i !== index) 
    }), () => this.props.setNewLinks(this.state.links));

    render() {
        const { links } = this.state;
        const Ul = styled.ul` 
            overflow-y: auto;
            list-style: none;
            margin: 0px;
            padding: 0px;
        `;

        return (    
            <ContainerDiv>
                <TitleToInput 
                    title="Title"
                    inputSetting={
                        <TextInput type="text" name="title" maxLength="255" ref={this.titleRef}/>
                    }/>
                <FileUrlInputSetting  
                    selectedOption={this.state.selectedOption} 
                    handleOptionChange={this.handleOptionChange} 
                    accept="image/*"
                    name="src"
                    title="Images: " 
                    inputRef={this.inputRef}/>
                <TitleToInput
                    title="Add Link: "
                    inputSetting={
                        <>
                        <TextInput type="text" maxLength="1024" ref={this.linkRef} />
                        <Button $margin="0px 0px 0px 5px" onClick={this.handleAddLink}>add</Button> 
                        </>
                    }
                />
                <Label>Links:</Label>
                <Ul style={{flexGrow: 1, height: "35%"}}>
                    {links.map((link, index) => 
                        <LinkUlItem 
                            key={index} 
                            link={link} 
                            setLinkInputValue={this.setLinkInputValue}
                            onDelete={() => this.deleteLink(index)} />)}
                </Ul>
                <SmallLabel fontSize="1.3em">{this.state.errorMsg}</SmallLabel>
            </ContainerDiv>
        );
    }
}