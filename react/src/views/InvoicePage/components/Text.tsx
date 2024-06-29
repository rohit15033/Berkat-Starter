import React, { FC } from 'react';
import { Text as PdfText } from '@react-pdf/renderer';

interface Props {
    className?: string;
    pdfMode?: boolean;
    children?: React.ReactNode;
}

const Text: FC<Props> = ({ className, pdfMode, children }) => {
    return (
        <>
            {pdfMode ? (
                <PdfText style={styles.text}>{children}</PdfText>
            ) : (
                <span className={'span ' + (className ? className : '')}>{children}</span>
            )}
        </>
    );
}

const styles = {
    text: {
        fontSize: 14,
        fontFamily: 'Nunito',
    },
};

export default Text;
