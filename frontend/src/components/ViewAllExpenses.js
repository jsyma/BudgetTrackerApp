import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col } from 'react-bootstrap';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { GoTrash } from 'react-icons/go';
import Navbar from './Navbar';

const ViewAllExpenses = ({ token, onLogout }) => {
  const [categories, setCategories] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const monthText = new Date(0, month - 1).toLocaleString('default', { month: 'short' });

  useEffect(() => {
    const fetchCategories = async () => {
      if (token) {
        try {
          const response = await axios.get('http://127.0.0.1:8000/api/categories/', {
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
          const response = await axios.get('http://127.0.0.1:8000/api/expenses/', {
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

  const deleteExpense = async (expenseId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this expense?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/expenses/${expenseId}/`, {
          headers: {
            Authorization: `Token ${token}`,
          },
        });
        setExpenses((updatedExpenses) => updatedExpenses.filter((expenses) => expenses.id !== expenseId));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const filteredExpenses = expenses.filter((expenses) => {
    const expenseDate = new Date(expenses.date);
    return (
      expenseDate.getUTCMonth() + 1 === month &&
      expenseDate.getUTCFullYear() === year 

    );
  });

  const groupedExpenses = categories.map((category) => {
    const categoryExpenses = filteredExpenses.filter(
      (expenses) => expenses.category === category.id
    );
    const totalCategoryAmount = categoryExpenses.reduce(
      (total, expenses) => total + parseFloat(expenses.amount), 0
    );
    const totalHeight = 
      categoryExpenses.length > 0
        ? categoryExpenses.length * 45 + 50
        : 45 * 2 + 50; 

    return {
      category,
      expenses: categoryExpenses,
      totalCategoryAmount,
      totalHeight,
    };
  });

  const getSelectedMonthTotal = () => {
    return filteredExpenses.reduce((total, expenses) => total + parseFloat(expenses.amount), 0);
  };

  const columnDefs = [
    { field: 'name', headerName: 'Expense Name', sortable: true },
    { field: 'date', headerName: 'Date', sortable: true },
    { field: 'amount', headerName: 'Amount', sortable: true },
    {
      headerName: 'Actions',
      field: 'id',
      cellRenderer: (expense) => 
        <div className="text-center">
          <button className="delete-button" onClick={() => deleteExpense(expense.data.id)}>
            <GoTrash style={{ fontSize: '15px', color: 'red' }} />
          </button>
        </div>
    },
  ];

  return (
    <div className="d-flex flex-column vh-100 vw-100" style={{ backgroundColor: "var(--primary-beige)" }}>
      <Navbar token={token} onLogout={onLogout} />
      <div className="mt-4">
        <Container>
          <Row>
            <Col lg={5} className="d-flex align-items-center justify-content-center mt-3 mb-3">
              <h2 className="text-decoration-underline">Past Expenses</h2>
            </Col>
            <Col lg={7} className="d-flex flex-row align-items-center justify-content-center mt-3 mb-3">
              <div style={{ fontFamily: 'Nunito' }}>
                <span>Select Month:</span>
                <select
                  value={month}
                  onChange={(e) => setMonth(Number(e.target.value))}
                  style={{ marginLeft: '10px', width: 'auto' }}
                >
                  {[...Array(12).keys()].map((month) => (
                    <option key={month} value={month + 1}>
                      {new Date(0, month).toLocaleString('default', { month: 'long' })}
                    </option>
                  ))}
                </select>
                <span style={{ marginLeft: '20px' }}>Select Year:</span>
                <select
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  style={{ marginLeft: '10px', width: 'auto' }}
                >
                  {[...Array(5).keys()].map((yearOffset) => (
                    <option key={yearOffset} value={new Date().getFullYear() - yearOffset}>
                      {new Date().getFullYear() - yearOffset}
                    </option>
                  ))}
                </select>
              </div>
            </Col>
          </Row>
          <Row>
            <h4>Total for {monthText}. {year}: ${getSelectedMonthTotal().toFixed(2)}</h4>
          </Row>
          {groupedExpenses.map(({ category, expenses, totalCategoryAmount, totalHeight }) => (
              <Row key={category.id} className="mb-4">
              <Col lg={{ span: 8, offset: 2 }} md={{ span: 10, offset: 1 }} className="mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex justify-content-between w-100 mt-4">
                    <h4>— {category.name}</h4>
                    <h4>Total: ${totalCategoryAmount.toFixed(2)} —</h4>
                  </div>                  
                  <div className="ag-theme-alpine w-100" style={{ height: `${totalHeight}px`, fontFamily: 'var(--primary-font)' }}>
                    <AgGridReact
                      rowData={expenses.length > 0 ? expenses : []}
                      columnDefs={columnDefs}
                      defaultColDef={{ flex: 1, minWidth: 100 }}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          ))}
        </Container>
      </div>
    </div>
  );
};

export default ViewAllExpenses;
