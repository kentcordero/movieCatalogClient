import { useContext, useEffect, useState } from 'react';
import { Button, Row, Col, Table, Modal, Form, Card, ListGroup } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import UserContext from '../UserContext';
import Swal from 'sweetalert2';

const GET_MOVIE_BY_ID_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/getMovie';
const UPDATE_MOVIE_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/updateMovie';
const DELETE_MOVIE_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/deleteMovie';
const ADD_COMMENT_URL = 'https://moviecatalogapi-cordero.onrender.com/movies/addComment';

export default function MovieCatalog() {
    const params = useParams();
    const navigate = useNavigate();
    const {user} = useContext(UserContext);

    const [ movie, setMovie ] = useState({});
    const [ showModal, setShowModal ] = useState(false);

    const [ movieTitle, setMovieTitle ] = useState("");
    const [ movieDirector, setMovieDirector ] = useState("");
    const [ movieYear, setMovieYear ] = useState("");
    const [ movieGenre, setMovieGenre ] = useState("");
    const [ movieDesc, setMovieDesc ] = useState("");
    const [ newComment, setNewComment ] = useState("");

    function setOpenModal() {
        setShowModal(true);
        setMovieTitle(movie.title);
        setMovieDirector(movie.director);
        setMovieDesc(movie.description);
        setMovieGenre(movie.genre);
        setMovieYear(movie.year);
    }

    function setCloseModal() {
        setShowModal(false);
        setMovieTitle("");
        setMovieDirector("");
        setMovieDesc("");
        setMovieGenre("");
        setMovieYear("");
    }

    function getMovieDetails() {
        fetch(GET_MOVIE_BY_ID_URL + `/${params.id}`, {
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            }
        }).then(res => res.json()).then((data) => {
            setMovie(data);
        });
    }

    function updateMovie(e) {
        e.preventDefault();

        const formattedBody = {
            title: movieTitle,
            director: movieDirector,
            year: Number(movieYear),
            genre: movieGenre,
            description: movieDesc,
        }
        fetch(UPDATE_MOVIE_URL + `/${params.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            setCloseModal();

            if (data.message === 'Movie updated successfully') {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                });
            } else {
                Swal.fire({
                    title: "Failed to update movie",
                    icon: "error",
                });
            }
            
            getMovieDetails();
        });
    }

    function deleteMovie() {
        fetch(DELETE_MOVIE_URL + `/${params.id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
        }).then(res => res.json()).then((data) => {
            if (data.message === 'Movie deleted successfully') {
                Swal.fire({
                    title: data.message,
                    icon: "success",
                });

                navigate('/movies');
            } else {
                Swal.fire({
                    title: "Failed to delete movie",
                    icon: "error",
                });
            }
        });
    }

    function addComment(e) {
        e.preventDefault();

        const formattedBody = {
            comment: newComment,
        }
        fetch(ADD_COMMENT_URL + `/${params.id}`, {
            method: 'PATCH',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${ localStorage.getItem('token') }`
            },
            body: JSON.stringify(formattedBody)
        }).then(res => res.json()).then((data) => {
            setNewComment("");
            getMovieDetails();
        });
    }

    useEffect(() => {
        getMovieDetails();
    }, []);

	return (
		<>
        <Row>
            <Col lg={9} className='mt-3'>
                <Link className='btn btn-secondary' to='/movies'>Back</Link>
            </Col>
            {user.isAdmin && 
                <Col lg={3} className='mt-3 d-flex flex-row-reverse justify-content-between'>
                    <Button className='btn btn-danger' onClick={(e) => deleteMovie()}>Delete</Button>
                    <Button className='btn btn-success' onClick={(e) => setOpenModal()}>Update</Button>
                </Col>
            }
        </Row>
        <Row className='mt-3'>
            <Col sm={12}>
                <Card className='align-middle'>
                    <Card.Header className='text-center align-middle'><h4>{movie.title}</h4></Card.Header>
                    <Card.Body>
                        <Card.Text>{movie.description}</Card.Text>
                        <Card.Text>Director: {movie.director}</Card.Text>
                        <Card.Text>Genre: {movie.genre}</Card.Text>
                        <Card.Text>Year: {movie.year}</Card.Text>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
        <Row className='my-3'>
            <Col sm={12}>
                <Card className='align-middle'>
                    <Card.Body>
                        <Card.Text>Comments</Card.Text>
                    </Card.Body>
                    {movie.comments &&
                        <ListGroup className="list-group-flush">
                            {movie.comments.map((comment) => {
                                return (
                                    <ListGroup.Item className='bg-grey'>{comment.comment}</ListGroup.Item>
                                )
                            })}
                            <ListGroup.Item className='bg-grey'>
                                <Form onSubmit={(e) => addComment(e)}> 
                                    <Form.Group controlId="comment">
                                        <Form.Control 
                                            type="text"
                                            placeholder="Enter your comment here"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            required
                                        />
                                    </Form.Group>
                                    <Button variant="primary" type="submit" disabled={newComment === ""} className='mt-2'>Post</Button>
                                </Form>
                            </ListGroup.Item>
                        </ListGroup>
                    }
                </Card>
            </Col>
        </Row>
        <Modal show={showModal} onHide={setCloseModal}>
            <Modal.Header closeButton>
            <Modal.Title>Update Movie Details</Modal.Title>
            </Modal.Header>
            <Form onSubmit={(e) => updateMovie(e)}>
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