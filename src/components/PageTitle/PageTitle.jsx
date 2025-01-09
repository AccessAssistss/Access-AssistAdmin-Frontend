import React from 'react'

function PageTitle({
    children,
    className
}) {
    return (
        <h3 className={`${className}`}>{children}</h3>
    )
}

export default PageTitle;