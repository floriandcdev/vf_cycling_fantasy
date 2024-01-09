import React, { useEffect } from 'react';

const AdComponent = ({ adSlot, adFormat = "auto", adLayout = "" }) => {
    useEffect(() => {
        if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
            window.adsbygoogle.push({});
        }
    }, []);

    return (
        <ins className="adsbygoogle"
             style={{ display: 'block' }}
             data-ad-client="ca-pub-1359392757710017"
             data-ad-slot={adSlot}
             data-ad-format={adFormat}
             data-ad-layout={adLayout}></ins>
    );
};

export default AdComponent;