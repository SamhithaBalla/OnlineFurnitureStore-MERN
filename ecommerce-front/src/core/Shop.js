import React, { useState, useEffect } from "react";
import Layout from "./Layout";
import Card from "./Card";
import { getCategories, getFilteredProducts } from "./apiCore";
import Checkbox from "./Checkbox";
import RadioBox from "./RadioBox";
import { prices } from "./fixedPrices";

const Shop = () => {
    const [myFilters, setMyFilters] = useState({
        filters: { category: [], price: [] }
    });
    const [categories,setCategories] = useState([]);
    const [error, setError] = useState(false);
    const [limit, setLimit] = useState(6);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage,setPostsPerPage] = useState(6);
    const [filteredResults, setFilteredResults] = useState([]);



    const Pagination = ({ postsPerPage, totalPosts }) => {
  const pageNumbers = [];

  //console.log("paginsize"+totalPosts)
  for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className='page-item'>
            <a onClick={() => loadMore(number)} className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

    const init = () => {
        getCategories().then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setCategories(data);
            }
        });
    };

 const loadFilteredResults = newFilters => {
        console.log("loadinggg");
        getFilteredProducts(skip, 0, newFilters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                setFilteredResults(data.data.slice(0,6));
                setSize(data.size);
                setSkip(0);
            }
        });
    };


    const loadMore = (number) => {
        let toSkip = skip + limit;
        
        const indexOfLastPost = number * postsPerPage;
        const indexOfFirstPost = indexOfLastPost - postsPerPage;
        //console.log("curr"+currentPage+ "last" +indexOfLastPost +"first"+indexOfFirstPost);

        getFilteredProducts(0, 0, myFilters.filters).then(data => {
            if (data.error) {
                setError(data.error);
            } else {
                console.log(data.data)
                setFilteredResults(data.data.slice(indexOfFirstPost,indexOfLastPost));
                //console.log(filteredResults)
                setSkip(0);
            }
        });
    };



    useEffect(() => {
        init();
        loadFilteredResults(skip, limit, myFilters.filters);
    }, []);

    const handleFilters = (filters, filterBy) => {
        const newFilters = { ...myFilters };
        newFilters.filters[filterBy] = filters;

        if (filterBy === "price") {
            let priceValues = handlePrice(filters);
            newFilters.filters[filterBy] = priceValues;
        }
        loadFilteredResults(myFilters.filters);
        setMyFilters(newFilters);
    };

    const handlePrice = value => {
        const data = prices;
        let array = [];

        for (let key in data) {
            if (data[key]._id === parseInt(value)) {
                array = data[key].array;
            }
        }
        return array;
    };

    return (
        <Layout
            title="Shop Page"
            description="Search any furniture"
            className="container-fluid"
        >
            <div className="row">
                <div className="col-3">
                    <h4>Filter by categories</h4>
                    <ul>
                        <Checkbox
                            categories={categories}
                            handleFilters={filters =>
                                handleFilters(filters, "category")
                            }
                        />
                    </ul>

                    <h4>Filter by price range</h4>
                    <div>
                        <RadioBox
                            prices={prices}
                            handleFilters={filters =>
                                handleFilters(filters, "price")
                            }
                        />
                    </div>
                </div>

                <div className="col-8">
                    <h2 className="mb-4">Products</h2>
                    <div className="row">
                        {filteredResults.map((product, i) => (
                            <div key ={i} className = "col-4 mb-3">
                            <Card product={product} />
                            </div>
                        ))}
                    </div>
                 
                 <Pagination
                postsPerPage={postsPerPage}
                totalPosts={size}
                 />

                </div>
            </div>
        </Layout>
    );
};

export default Shop;




