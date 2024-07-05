import React from "react";
import TitleToInput from "./titleToInput";
import { TextInput, FileInput, Button } from "../StyledComponents/default";
import { withTheme } from "styled-components";

/**
 * @param title
 */
class FileUrlInputSetting extends React.Component {
    render() {
        const { theme } = this.props;

        return (
            <TitleToInput
                title={this.props.title}
                inputSetting={
                    <>
                        { this.props.selectedOption === 'link' ? 
                            <TextInput name={this.props.name} maxLength="1024" ref={this.props.inputRef} /> : 
                            <FileInput name={this.props.name} accept={this.props.accept} ref={this.props.inputRef} />
                        }
                        <Button 
                            onClick={() => this.props.handleOptionChange('link')}
                            style={{ border: this.props.selectedOption === 'link' ? `2px solid ${theme.textColor}` : 'none' }}>
                            Link
                        </Button>
                        <Button 
                            onClick={() => this.props.handleOptionChange('file')}
                            style={{ border: this.props.selectedOption === 'file' ? `2px solid ${theme.textColor}` : 'none' }}>
                            File
                        </Button>
                    </>
                }
            />
        );
    }
}

export default withTheme(FileUrlInputSetting);