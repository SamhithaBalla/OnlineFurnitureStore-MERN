import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import { getProducts, createOrder } from "./apiCore";
import Card from "./Card";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import {emptyCart} from './cartHelpers'


const userId = isAuthenticated() && isAuthenticated().user._id;
    const token = isAuthenticated() && isAuthenticated().token;

const Checkout = ({ products }) => {

    const getTotal = () => {
        return products.reduce((currentValue, nextValue) => {
            return currentValue + nextValue.count * nextValue.price;
        }, 0);
    };


const buy = () => {

        const createOrderData = {
            products:products
        }
        createOrder(userId, token, createOrderData)

        {emptyCart()}

}


    const showCheckout = () => {
        return isAuthenticated() ? (
            <button onClick={buy} className="btn btn-success">Checkout</button>
        ) : (
            <Link to="/signin">
                <button className="btn btn-primary">Sign in to checkout</button>
            </Link>
        );
    };

    return (
        <div>
            <h2>Total: ${getTotal()}</h2>

            {showCheckout()}
        </div>
    );
};

export default Checkout;
