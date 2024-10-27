import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Col, Row, Container } from 'react-bootstrap';
import '../../static/css/styles.css';
import Navbar from './Navbar';
import BudgetPhoto from '../../static/images/BudgetPhoto.png';

const AddExpense = ({ token, onLogout }) => {
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [amount, setAmount] = useState('');
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);

  const getCookie = (name) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + '=') {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  };

  useEffect(() => {
    const fetchCategories = async () => {
      if (token) {
        try {
          const response = await axios.get('https://budget-tracker-app-7n4u.onrender.com/api/categories/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setCategories(response.data);
        } catch (error) {
          console.error('Error fetching categories:', error);
        }
      }
    };

    const fetchExpenses = async () => {
      if (token) {
        try {
          const response = await axios.get('https://budget-tracker-app-7n4u.onrender.com/api/expenses/', {
            headers: {
              Authorization: `Token ${token}`,
            },
          });
          setExpenses(response.data);
        } catch (error) {
          console.error('Error fetching expenses:', error);
        }
      }
    };

    fetchCategories();
    fetchExpenses();
  }, [token]);

  const getCurrentMonthTotal = () => {
    const currentMonth = new Date().getUTCMonth();
    const currentYear = new Date().getUTCFullYear();

    const monthlyExpenses = expenses.filter((expense) => {
      const [year, month] = expense.date.split('-');
      const parsedYear = parseInt(year, 10);
      const parsedMonth = parseInt(month, 10) - 1;

      return parsedYear === currentYear && parsedMonth === currentMonth ;
    });
    return monthlyExpenses.reduce((total, expenses) => total + parseFloat(expenses.amount), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://budget-tracker-app-7n4u.onrender.com/api/expenses/', {
        name,
        category: categoryId,
        date,
        amount,
      },
      {
        headers: {
          Authorization: `Token ${token}`,
          'X-CSRFToken': getCookie('csrftoken'),
        },
      });
      setExpenses((updatedExpenses) => [...updatedExpenses, response.data]);

      alert('Expense added successfully');
      setName('');
      setCategoryId('');
      setDate('');
      setAmount('');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Error adding expense');
    }
  };

  return (
    <div className="d-flex flex-column vh-100 vw-100" style={{ backgroundColor: 'var(--primary-beige)' }}>
      <Navbar token={token} onLogout={onLogout} />
      <div style={{ marginTop: "50px" }}>
        <Container>
          <Row>
            <Col md={6} className="text-center">
              <img src={BudgetPhoto} height="300px" alt="Budget" />
            </Col>
            <Col md={6}>
              <form className="add-expenses-form" onSubmit={handleSubmit}>
                <h3>Add Expense</h3>
                <Row>
                  <Col md={12}>
                    <input
                      type="text"
                      placeholder="Expense Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={12}>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </Col>
                  <Col md={6}>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </Col>
                </Row>
                <Row className="justify-content-center">
                  <Col md={12} className="text-center">
                    <button type="submit">Add Expense</button>
                  </Col>
                </Row>
              </form>
            </Col>
          </Row>
          <Row className="justify-content-center"></Row>
          <Row>
            <Col md={12} className="text-center pt-5">
              <h3 className="d-inline">
                Total Spent in this Month: ${getCurrentMonthTotal().toFixed(2)}
              </h3>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default AddExpense;
