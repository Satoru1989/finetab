import styled from 'styled-components';

export const ContainerDiv = styled.div`
    > * {
        margin: 5px;
    }
    text-align: center;
    margin: 20px;
`;

export const BackgroundDiv = styled.div`
    background-color: ${props => props.theme.backgroundColor || "black"};
    border-radius: ${props => props.borderRadius || '5px'};
    height: "auto";
    width: "auto";
`;

export const HighlightDiv = styled.div`
    background-color: ${props => props.theme.secondaryColor || "gray"};
    border-radius: ${props => props.borderRadius || '5px'};
    height: "auto";
    width: "auto";
`;

export const ContentCenteredDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0px;
    margin: 0px;
`;

export const Button = styled.button.attrs(props => ({
    type: props.type || 'button'
}))` 
    background-color: ${props => props.theme.primaryColor};
    color: ${props => props.theme.textColor};
    border-radius: ${props => props.borderRadius || '5px'};
    border-color: ${props => props.secondaryColor};
    font-size: ${props => props.fontSize || "1.2rem"};
    width: ${props => props.width || "auto"};
    margin: ${props => props.$margin || '0px'};
    padding: ${props => props.padding || '4px'};
    height: auto;
    display: inline;
    white-space: nowrap;
`;

export const Label = styled.label`
    color: ${props => props.theme.textColor};
    font-size: 1.5rem;
    margin: 5px;
`;

export const SmallLabel = styled.label`
    color: ${props => props.theme.textColor};
    font-size: 17px;
    margin: ${props => props.margin || '5px'};
    white-space: nowrap;
`;

export const TextInput = styled.input.attrs({ type: 'text' })`
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.secondaryColor};
    margin: ${props => props.margin || '0px'};
    maxlength: ${props => props.maxLength}
    font-size: 17px;
    width: 250px;
    align-self: center;
`;

export const FileInput = styled.input.attrs({ type: 'file' })`
    color: ${props => props.theme.textColor};
    background-color: ${props => props.theme.secondaryColor};
    margin: ${props => props.margin || '0px'};
    align-self: center;
`;