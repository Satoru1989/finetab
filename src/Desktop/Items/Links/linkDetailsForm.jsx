import React, {useState} from "react";
import styled from "styled-components";
import FileUrlInputSetting from "../../../UIComponents/fileUrlInputSetting";
import TitleToInput from "../../../UIComponents/titleToInput";
import { Button, Label, ContainerDiv, TextInput } from "../../../StyledComponents/default";

const LinkItem = ({ link, onDelete }) => {
    const iconAvailable = false;
    let iconUrl = "";

    return (
        <li>
            <TitleToInput
                title={link}
                inputSetting={
                <>
                    { iconAvailable && 
                    <Button fontSize="17px" onClick={ () => {
                        navigator.clipboard.writeText(iconUrl);
                    }}>copy icon url</Button>
                    }
                    <Button fontSize="17px" onClick={onDelete}>delete</Button>
                </>}  
            />
        </li>
    );
};

export default class LinkDetailsForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedOption: 'file',
            links: [],
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
        if (this.inputRef.current !== null && this.inputRef.current !== undefined &&
            this.props.defaultData !== undefined && !this.innitialized) {
            if (!this.props.defaultData.isFile)
                this.inputRef.current.value = this.props.defaultData.src;
            
            this.innitialized = true;
        }
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
            height: 235px; 
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
                        <input type="text" name="title" maxLength="255" default={this.titlePlaceholder}  ref={this.titleRef}/>
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
                        <Button $margin="0px 5px 0px 0px" onClick={this.handleAddLink}>add</Button> 
                        <TextInput type="text" maxLength="512" ref={this.linkRef} />
                        </>
                    }
                />
                <Label>Links:</Label>
                <Ul>
                    {links.map((link, index) => <LinkItem key={index} link={link} onDelete={() => this.deleteLink(index)} />)}
                </Ul>
            </ContainerDiv>
        );
    }
}