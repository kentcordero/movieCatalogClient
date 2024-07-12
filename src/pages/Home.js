import { useContext } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserContext from '../UserContext';

export default function Home() {
    const {user} = useContext(UserContext);

	return (
		<>
        <Row>
            <Col className="p-4 text-center">
                <h1>Welcome To our Movie Catalog</h1>
                <p>Create, Update, Delete and View Movies</p>
                {user?.id &&
                    <Link className="btn btn-primary" to={'/movies'}>Explore Movies!</Link>
                }
            </Col>
        </Row>
		</>
	)
}