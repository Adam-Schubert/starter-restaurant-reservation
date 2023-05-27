import React from 'react';
import ErrorAlert from './ErrorAlert';

export default function Loading({error}){
    return (
        <div>
            <ErrorAlert error={error} />
            <h1>Loading...</h1>
        </div>
    );
} 