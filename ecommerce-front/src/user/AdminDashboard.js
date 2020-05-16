import React, { useState, useEffect } from "react";
import Layout from "../core/Layout";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import { getPurchaseHistory } from "./apiUser";
import moment from "moment";


const AdminDashboard = () => {
    const [history, setHistory] = useState([]);
    const {
        user: { _id, name, email, role }
    } = isAuthenticated();
    const token = isAuthenticated().token;
    const init = (userId, token) => {
        getPurchaseHistory(userId, token).then(data => {
            if (data.error) {
                console.log(data.error);
            } else {
                setHistory(data);
            }
        });
    };
        useEffect(() => {
        init(_id, token);
    }, []);

    const adminLinks = () => {
        return (
            <div className="card">
                <h4 className="card-header">Admin Links</h4>
                <ul className="list-group">
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/category">
                            Create Category
                        </Link>
                    </li>
                    <li className="list-group-item">
                        <Link className="nav-link" to="/create/product">
                            Create Product
                        </Link>
                    </li>

                    <li className="list-group-item">
                        <Link className="nav-link" to="/admin/products">
                            Manage Products
                        </Link>
                    </li>
                </ul>
            </div>
        );
    };


        const purchaseHistory = history => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">Purchase history</h3>
                <ul className="list-group">
                    <li className="list-group-item">
                        {history.map((h, i) => {
                            return (
                                <div>
                                    <hr />
                                    {h.products.map((p, i) => {
                                        return (
                                            <div key={i}>
                                                <h6>Product name: {p.name}</h6>
                                                <h6>
                                                    Product price: ${p.price} </h6>
                                                  <h6>Count:  {p.count}</h6>
                                                  <h6>Total: {p.count * p.price} </h6>

                                                
                                                
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </li>
                </ul>
            </div>
        );
    };

    const adminInfo = () => {
        return (
            <div className="card mb-5">
                <h3 className="card-header">User Information</h3>
                <ul className="list-group">
                    <li className="list-group-item">{name}</li>
                    <li className="list-group-item">{email}</li>
                    <li className="list-group-item">
                        {role === 1 ? "Admin" : "Registered User"}
                    </li>
                </ul>
            </div>
        );
    };

    return (
        <Layout
            title="Dashboard"
            description={`Hello ${name}!`}
            className="container-fluid"
        >
            <div className="row">
                <div className="col-4 ml-5">{adminLinks()}</div>
                <div className="col-5 ml-5">{adminInfo()}</div>
            </div>
            <div className="mt-5">
            
            {purchaseHistory(history)}
            </div>
        </Layout>
    );
};

export default AdminDashboard;
