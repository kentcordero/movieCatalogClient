import { useState, useEffect, useContext } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';

const REGISTER_URL = 'https://moviecatalogapi-cordero.onrender.com/users/register'

export default function Register() {
    const navigate = useNavigate();

	const {user} = useContext(UserContext);

	const [email,setEmail] = useState("");
	const [password,setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

    const [isActive, setIsActive] = useState(false);
    
    function registerUser(e) {

		e.preventDefault();

		fetch(REGISTER_URL,{
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password,
            })
		})
		.then(res => res.json())
		.then(data => {

            //determine the returned data. Especially useful when the given API is online.
            console.log(data);

            //data will only contain an email property if we can properly save our user.
            if(data.message === "Registered Successfully"){

                setEmail('');
                setPassword('');
                setConfirmPassword('');

                Swal.fire({
                    title: "Registration Successful",
                    icon: "success",
                    text: "Thank you for registering!"
                });

                navigate('/login');
            } 

		})
	}

	useEffect(()=>{

        if((email !== "" && password !=="" && confirmPassword !=="") && (password === confirmPassword)){

            setIsActive(true)

        } else {

            setIsActive(false)

        }

	},[email, password, confirmPassword])
    

	return (

        <Form onSubmit={(e) => registerUser(e)}>
        <h1 className="my-5 text-center">Register</h1>
            <Form.Group>
                <Form.Label>Email:</Form.Label>
                <Form.Control 
                type="email"
                placeholder="Enter your Email" 
                required 
                value={email} 
                onChange={e => {setEmail(e.target.value)}}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Password:</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Enter Password" 
                required 
                value={password} 
                onChange={e => {setPassword(e.target.value)}}/>
            </Form.Group>
            <Form.Group>
                <Form.Label>Confirm Password:</Form.Label>
                <Form.Control 
                type="password" 
                placeholder="Confirm Password" 
                required 
                value={confirmPassword} 
                onChange={e => {setConfirmPassword(e.target.value)}}/>
            </Form.Group>
            <Row className='mt-3'>
                <Col>
                {
                    isActive

                    ? <Button variant="primary" type="submit">Submit</Button>
                    : <Button variant="danger" disabled>Submit</Button>
                }
                </Col>
            </Row>
            
        </Form>
		
    )
}