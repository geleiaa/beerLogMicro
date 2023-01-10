import React, { useState, useEffect } from "react";
import CommentsCreat from "./CommentsCreat";
import CommentsList from "./CommentsList";
import axios from "axios";

export default () => {
    const [beers, setBeers] = useState({});

    const fetchBeers = async () =>{
        const res = await axios.get('http://localhost:4002/beers');

        setBeers(res.data)
    }

    useEffect(() =>{
        fetchBeers();
    }, [])

    const renderedBeers = Object.values(beers).map(beer => {
        return (
        <div 
        className="card" 
        style={{ width: '30%', marginBottom: '20px' }} 
        key={beer.id}
        >
            <div className="card-body">
                <h3>{beer.title}</h3>
                <CommentsList comments={beer.comments} />
                <CommentsCreat beerId={beer.id} />
            </div>
        </div>
        );
    })

    return <div className="d-flex flex-row flex-wrap justify-content-between">{renderedBeers}</div>
}