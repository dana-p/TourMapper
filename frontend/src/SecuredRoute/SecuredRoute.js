import React from 'react';
import { Route } from 'react-router-dom'
import auth0Client from '../Auth'

function SecuredRoute(props){
    const {component: Component, path, checkingSession} = props; 
    return (
        <Route path={path} render={()=>{
            // Check if token is saved 
            if (checkingSession) return <h3 className="text-center">Validating session...</h3>

            // Check if user is authenticated before showing page
            if (!auth0Client.isAuthenticated()){
                auth0Client.signIn(); 
                return <div></div>
            }
            return <Component/>
            }} />
    );
}

export default SecuredRoute; 