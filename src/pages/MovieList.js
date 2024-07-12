import { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Table, Modal, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import MovieCard from '../components/MovieCard';
import UserContext from '../UserContext';

const GET_MOVIES_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/getMovies';
const ADD_MOVIE_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/addMovie';

export default function MovieList() {
    const {user} = useContext(UserContext);

    const [ movies, setMovies ] = useState([]);
    const [ showModal, setShowModal ] = useState(false);

    const [ movieTitle, setMovieTitle ] = useState("");
    const [ movieDirector, setMovieDirector ] = useState("");
    const [ movieYear, setMovieYear ] = useState("");
    const [ movieGenre, setMovieGenre ] = useState("");
    const [ movieDesc, setMovieDesc ] = useState("");

    function setOpenModal() {
        setShowModal(true);
    }

    function setCloseModal() {
        setShowModal(false);
        setMovieTitle("");
        setMovieDirector("");
        setMovieDesc("");
        setMovieGenre("");
        setMovieYear("");
    }

    function fetchMovies() {
        fetch(GET_MOVIES_URL, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        }).then(res => res.json()).then((data) => {
            console.log({ data });
            setMovies(data.movies);
        });
    }

    function addMovie(e) {
        e.preventDefault();

        const formattedBody = {
            title: movieTitle,
            director: movieDirector,
            year: Number(movieYear),
            genre: movieGenre,
            description: movieDesc,
        }
        fetch(ADD_MOVIE_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            console.log({ updatedMovie: data });
            setCloseModal();

            if (data) {
                Swal.fire({
                    title: "Movie added successfully!",
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Failed to update movie",
                    icon: "error",
                });
            }
            
            fetchMovies();
        });
    }

    useEffect(() => {
        fetchMovies();
    }, []);

	return (
		<>
        <Row className='mt-3'>
            <Col className='text-center'>
                <h3>Movie List</h3>
            </Col>
        </Row>
        {user.isAdmin &&
            <Row className='mt-3'>
                <Col>
                    <Button className='btn btn-success' onClick={(e) => setOpenModal()}>Add Movie</Button>
                </Col>
            </Row>
        }
        <Row className='mt-3'>
            {movies.length ?
                <>
                    {movies.map((movie) => {
                        return (
                            <Col md={6} className='mb-3'>   
                                <MovieCard movie={movie} />
                            </Col>
                        )
                    })}
                </>
                :
                <h5>No added movies yet.</h5>
            }
        </Row>
        <Modal show={showModal} onHide={setCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Add Movie</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => addMovie(e)}>
            <Modal.Body>
                <Form.Group controlId="title">
                    <Form.Label>Movie Title:</Form.Label>
                    <Form.Control 
                        type="text"
                        placeholder="Enter the movie title"
                        value={movieTitle}
                        onChange={(e) => setMovieTitle(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="director" className='mt-3'>
                    <Form.Label>Director:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter the movie's director"
                        value={movieDirector}
                        onChange={(e) => setMovieDirector(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="year" className='mt-3'>
                    <Form.Label>Year:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter the year of the movie was released"
                        value={movieYear}
                        onChange={(e) => setMovieYear(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="genre" className='mt-3'>
                    <Form.Label>Genre:</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter the movie's genre"
                        value={movieGenre}
                        onChange={(e) => setMovieGenre(e.target.value)}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="description" className='mt-3'>
                    <Form.Label>Description:</Form.Label>
                    <Form.Control 
                        as="textarea" rows={5}
                        placeholder="Enter the movie's description"
                        value={movieDesc}
                        onChange={(e) => setMovieDesc(e.target.value)}
                        required
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={(e) => setCloseModal()}>
                Close
            </Button>
            <Button variant="primary" type="submit">
                Save Changes
            </Button>
            </Modal.Footer>
            </Form>
        </Modal>
		</>
	)
}