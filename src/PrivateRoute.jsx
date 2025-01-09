import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function PrivateRoute(props) {
    const { Component } = props
    const Navigate = useNavigate()
    useEffect(() => {
        const tokenData = sessionStorage.getItem('token');
        if (!tokenData) {
            Navigate('signin')
        }
    }, [])
    return (
        <>
            <Component />
        </>
    )
}

export default PrivateRoute