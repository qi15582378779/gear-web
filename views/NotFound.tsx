import styled from 'styled-components';

const StyledNotFound = styled.div`
    align-items: center;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 64px);
    justify-content: center;
`;

const NotFound = ({ statusCode = 404 }: { statusCode?: number }) => {
    return <StyledNotFound>{statusCode} 页面未找到</StyledNotFound>;
};

export default NotFound;
