import React from 'react';
import Posts from './Posts';
import Postlist from './Postlist';

export default () =>{
    return <div className='container'>
        <h1>Create Post</h1>
        <Posts/>
        <hr/>
        <Postlist/>
    </div>;
}