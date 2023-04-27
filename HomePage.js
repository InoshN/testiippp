import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartPlus,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import Sidebar from "./SideBar";

import "./style.css";
import ApiService from "../Services/ApiService";
import { toast } from "react-toastify";

const HomePage = () => {
  

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const res = await ApiService.getAllProducts();

      setProducts(res.data.products);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((currentIndex - 1 + products.length) % products.length);
  };

  const goToNext = () => {
    setCurrentIndex((currentIndex + 1) % products.length);
  };

  const handleAddToCart = async (productId) => {
    const customerId = localStorage.getItem("id");

    const data = {
      productId: productId,
      customerId: customerId,
    };

    await ApiService.addProductToCart(data).then((res) => {
      if (res.status === 200) {
        toast("Product added to cart !", {
          theme: "colored",
          type: "success",
          autoClose: 1500,
        });
      } else {
        toast("Something went wrong, please try again.", {
          theme: "colored",
          type: "error",
          autoClose: 2000,
        });
      }
    });
  };

  useEffect(() => {
    // Initialize Owl Carousel
    const owl = window.jQuery(".owl-carousel").owlCarousel({
      items: 1,
      loop: true,
      autoplay: true,
      autoplayTimeout: 2000,
      autoplayHoverPause: false,
    });

    // Destroy Owl Carousel when component unmounts
    return () => {
      owl.trigger("destroy.owl.carousel");
    };
  }, [products]);

  if (isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <>
      <Sidebar />
      <div className="mx-auto w-75 row d-flex justify-content-center pt-5">
        <div className="container row">
          <div className="owl-carousel">
            <div className="item">
              <img src="slide1.png" />
            </div>
            <div className="item">
              <img src="slide2.jpg" />
            </div>
            <div className="item">
              <img src="slide3.jpg" />
            </div>
          </div>
        </div>
        <div className="container">
          <h2>Featured Products</h2>
          <hr />
          <div className="row">
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <button
                className="btn btn-primary"
                onClick={goToPrevious}
                disabled={currentIndex === 0}
              >
                <FontAwesomeIcon icon={faChevronLeft} />
              </button>
            </div>
            {products.slice(currentIndex, currentIndex + 5).map((product) => (
              <div key={product._id} className="col-md-2">
                <div className="card">
                  <img
                    className="card-img-top"
                    src={product.image}
                    alt="Product"
                  />
                  <div className="card-body">
                    <h6 className="card-title">{product.productName}</h6>
                    <p className="card-text">Rs. {product.price}</p>
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => handleAddToCart(product._id)}
                    >
                      <FontAwesomeIcon icon={faCartPlus} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            <div className="col-md-1 d-flex justify-content-center align-items-center">
              <button
                className="btn btn-primary"
                onClick={goToNext}
                disabled={currentIndex + 5 >= products.length}
              >
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
