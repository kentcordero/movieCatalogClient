import { useState } from 'react';
import { Button, Row, Col, Card, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
    const { _id: movieId, title, director, year, description, genre } = movie;
    return (
        <Card>
            <Card.Header className='text-center align-middle'><h4>{title}</h4></Card.Header>
            <Card.Body>
                <Card.Text>{description}</Card.Text>
                <Card.Text>Director: {director}</Card.Text>
                <Card.Text>{genre} | {year}</Card.Text>
            </Card.Body>
            <Card.Footer className='text-center'>
                <Link className='btn btn-primary' to={`/movies/${movieId}`}>Details</Link>
            </Card.Footer>
        </Card>
    )
}