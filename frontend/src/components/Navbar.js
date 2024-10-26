import React from 'react';
import { Navbar as BootstrapNavbar, Nav, Container } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ token, onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  }

  return (
    <BootstrapNavbar expand="md" className="custom-navbar w-100 pt-3">
      <Container fluid className="d-flex justify-content-between">
        <BootstrapNavbar.Brand>Budget Tracker</BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" style={{ width: '60px'}}/>
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {token ? (
              <>
                <Nav.Link as={Link} to='/add-expenses'>Add Expense</Nav.Link>
                <Nav.Link as={Link} to='/view-expenses'>View Expenses</Nav.Link>
                <Nav.Link as={Link} to='/view-all-expenses'>View Past Expenses</Nav.Link>
                <Nav.Link as={Link} to='/' onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <Nav.Link as={Link} to='/'>Login/Register Now</Nav.Link>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;
