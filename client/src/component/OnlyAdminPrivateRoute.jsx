import {useSelector } from 'react-redux'
import {Outlet, Navigate } from 'react-router-dom'

import React from 'react'

export default function OnlyAdminPrivateRoute() {
    const {currentUser } = useSelector((state) => state.user)
    console.log(currentUser.isAdmin)
    return currentUser.isAdmin ? <Outlet/> : <Navigate to= '/signin'/>
}
