/* eslint-disable react/no-unknown-property */
import "./DetailProduct.scss";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../features/cart/cartSlice";
import Pickup from "../../../components/Pickup";
import { useEffect, useState } from "react";
import { FetchApi } from "../../../api/FetchAPI";
import { useNavigate, useParams } from "react-router-dom";
import Sale from "../../../components/Sale";
import AddToCart from "../../../components/ButtonAddToCart";
import DefaultLayoutStore from "../DefaultLayoutStore";
import ProductCardsLess from "./../../../components/ProductCardsLess";
import { Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function DetailProduct() {
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const store_name = localStorage.getItem("store_name");
  const [data, setData] = useState([]);
  const page = 1;
  const navigate = useNavigate();
  const { name } = useParams();
  const dispatch = useDispatch();

  const getProducts = async (store_name, page) => {
    if ((store_name, page)) {
      const result = await FetchApi.getProductsByStore(store_name, page);
      if (result) {
        setData(result.data);
        setLoading(false);
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };
  const product = data.find((product) => product.name === name);
  useEffect(() => {
    if ((store_name, page)) {
      getProducts(store_name, page);
    }
  }, []);
  useEffect(() => {
    if (product) {
      setSelectedImage(product.image_product1);
    }
  }, [product]);

  const otherProducts = data
    .filter((product) => product.name !== name)
    .slice(0, 5);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + 1;
      // onQuantityChange(newQuantity);
      return newQuantity;
    });
  };

  const handleDecrement = () => {
    setQuantity((prevQuantity) => {
      const newQuantity = Math.max(1, prevQuantity - 1);
      // onQuantityChange(newQuantity);
      return newQuantity;
    });
  };
  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const handleQuantityChange = (event) => {
    const value = event.target.value;
    const newQuantity = Math.max(1, parseInt(value));
    setQuantity(newQuantity);
    // onQuantityChange(newQuantity);
  };
  const handleToCart = () => {
    navigate(`/store/${store_name}/cart`);
  };

  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );
  return (
    <DefaultLayoutStore
      content={
        <div className='wrapper-detailproduct'>
          {loading ? (
            <Spin className='loading' indicator={antIcon} />
          ) : (
            <>
              <div className='datail-product'>
                <div className='wrapper-product-image-datail'>
                  <div data-bs-toggle='modal' data-bs-target='#exampleModal'>
                    <img
                      src={selectedImage}
                      alt={product.name}
                      className='product-image-datail'
                    />
                  </div>

                  <div className='wrapper-sub-product-image-datail '>
                    <img
                      src={product.image_product1}
                      className={`sub-product-image-datail ${
                        selectedImage === product.image_product1
                          ? "selected"
                          : ""
                      }`}
                      alt=''
                      onClick={() => handleImageClick(product.image_product1)}
                    />
                    <img
                      src={product.image_product2}
                      className={`sub-product-image-datail ${
                        selectedImage === product.image_product2
                          ? "selected"
                          : ""
                      }`}
                      alt=''
                      onClick={() => handleImageClick(product.image_product2)}
                    />
                  </div>
                </div>

                <div className='datail-product-content'>
                  <h1 className='name-datail-product-content'>
                    {product.name}
                  </h1>
                  <p className='description-datail-product-content'>
                    {product.description}
                  </p>
                  <div className='price-product-card-datail'>
                    <div className='price-main-product-card-detail'>
                      {product.price_main}
                    </div>
                    <div className='price-sale-product-card-detail'>
                      {product.price_sale}
                    </div>
                    <div>
                      <Sale />
                    </div>
                  </div>{" "}
                  <div className='buy-product-card-datail'>
                    <div className='quantily-product-card-detail'>Quantity</div>

                    <div className='quantily-change-product-card-detail'>
                      <button
                        className='btn-decrement'
                        onClick={handleDecrement}
                      >
                        -
                      </button>
                      <input
                        className='input-quantily'
                        type='number'
                        value={quantity}
                        onChange={handleQuantityChange}
                        min='1'
                      />
                      <button
                        className='btn-increment'
                        onClick={handleIncrement}
                      >
                        +
                      </button>
                    </div>
                    <div className='share'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        width='16'
                        height='16'
                        fill='currentColor'
                        class='bi bi-arrow-bar-up share-icon'
                        viewBox='0 0 16 16'
                      >
                        <path
                          fill-rule='evenodd'
                          d='M8 10a.5.5 0 0 0 .5-.5V3.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 3.707V9.5a.5.5 0 0 0 .5.5zm-7 2.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5z'
                        />
                      </svg>
                      <span className='share-title'>Share</span>
                    </div>
                    <div className='pickup-datail-product'>
                      <Pickup />
                    </div>
                    <div
                      className='add-to-cart-product-detail'
                      onClick={() => dispatch(addToCart({ product, quantity }))}
                    >
                      <AddToCart />
                    </div>

                    <div className='get-everyone-involved-product-card-datail'>
                      Get everyone involved
                    </div>
                    <div className='wrapper-pickup-product-card-datail'>
                      <div className='pickup-product-card-datail'>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          width='16'
                          height='16'
                          fill='currentColor'
                          class='bi bi-check-lg pickup-icon-product-card-datail'
                          viewBox='0 0 16 16'
                        >
                          <path d='M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425a.247.247 0 0 1 .02-.022Z' />
                        </svg>
                        <span className='pickup-title-product-card-datail'>
                          Pickup available at 11 Thai Ha
                        </span>
                      </div>
                      <div
                        className='pickup-title-product-card-datail'
                        style={{ marginLeft: "20px", fontSize: "13.5px" }}
                      >
                        Usually ready in 5+ days
                      </div>
                    </div>
                    <div
                      className='view-cart-product-card-datail'
                      onClick={() => handleToCart()}
                    >
                      View store information
                    </div>
                  </div>
                </div>
              </div>
              <div className='recommend-product-card-datail'>
                You may also like
              </div>
              <div className='wrapper-product-card-less'>
                {otherProducts.slice(0, 4).map((product) => (
                  <div key={product.id}>
                    <ProductCardsLess product={product} />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      }
    />
  );
}

export default DetailProduct;
