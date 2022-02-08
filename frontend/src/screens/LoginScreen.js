import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Form, Row, Col, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";

import { login } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Message from "../components/Message";
import Loader from "../components/Loader";

const LoginScreen = ({ location, history }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo, error, loading } = userLogin;

  useEffect(() => {
    if (userInfo) {
      history.push(redirect);
    }
  }, [userInfo, history, redirect]);

  const submitLoginHandler = (e) => {
    e.preventDefault();

    //Dispatch login
    dispatch(login(email, password));
  };

  return (
    <FormContainer>
      <h1>Sign up</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitLoginHandler}>
        <Form.Group controlId="email">
          <Form.Label>Email Address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter Email"
            onChange={(e) => setEmail(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
          ></Form.Control>
        </Form.Group>
        <Button type="submit" variant="primary">
          Sign In
        </Button>
      </Form>
      <Row className="py-3">
        <Col>
          New Customer?
          <Link to={redirect ? `/register/?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
