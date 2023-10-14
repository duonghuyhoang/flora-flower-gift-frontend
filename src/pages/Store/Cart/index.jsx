import { useSelector, useDispatch } from "react-redux";
import DefaultLayoutStore from "../DefaultLayoutStore";
import Pickup from "../../../components/Pickup";
import {
  increaseQuantity,
  decreaseQuantity,
  removeFromCart,
} from "../../../features/cart/cartSlice";
import { FetchApi } from "../../../api/FetchAPI";
import "./Cart.scss";
import { useNavigate } from "react-router-dom";
import ProductCards from "../../../components/ProductCards";
import { useEffect, useState } from "react";
import { Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Cart() {
  const [loading, setLoading] = useState(true);
  const items = useSelector((state) => state.cart.items);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const store_name = localStorage.getItem("store_name");
  const [data, setData] = useState([]);
  const page = 1;

  useEffect(() => {
    if ((store_name, page)) {
      getProducts(store_name, page);
    }
  }, []);

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

  const totalValue = items.reduce(
    (total, item) =>
      total + item.quantity * parseFloat(item.product.price_sale.slice()),
    0
  );

  const handleToCatalog = () => {
    navigate(`/store/${store_name}/collections`);
  };
  function handleIncreaseQuantity(productId) {
    dispatch(increaseQuantity(productId));
  }

  function handleDecreaseQuantity(productId) {
    dispatch(decreaseQuantity(productId));
  }

  function handleRemoveFromCart(productId) {
    dispatch(removeFromCart(productId));
  }
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
        <div className='wrapper-cart'>
          {loading ? (
            <Spin className='loading pt-40' indicator={antIcon} />
          ) : (
            <>
              {items && items.length > 0 ? (
                <div className='wrapper-has-product'>
                  <div className='wrapper-title-cart'>
                    <div className='title-cart'>Your cart</div>
                    <div
                      className='continue-shopping-cart'
                      onClick={() => handleToCatalog()}
                    >
                      Continue Shopping
                    </div>
                  </div>
                  <table className='table-cart'>
                    <thead>
                      <tr>
                        <th>PRODUCT</th>
                        <th>QUANTITY</th>
                        <th>TOTAL</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr className='tr-table' key={item.product.id}>
                          <td
                            className='detail-item-table'
                            style={{ padding: "20px 0" }}
                          >
                            <img
                              className='image-item-table'
                              src={item.product.image_product1}
                              alt=''
                            />
                            <div
                              style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: "3px",
                              }}
                            >
                              <div className='name-item-table'>
                                {item.product.name}
                              </div>
                              <div className='price-item-table'>
                                ${item.product.price_sale}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: "20px 0" }} className='td-2'>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                gap: "20px",
                              }}
                            >
                              <div className='quantily-change-product-card-detail-item-table '>
                                <button
                                  className='btn-decrement'
                                  onClick={() =>
                                    handleDecreaseQuantity(item.product.id)
                                  }
                                >
                                  -
                                </button>
                                <input
                                  type='number'
                                  className='input-quantily'
                                  value={item.quantity}
                                />
                                <button
                                  className='btn-increment'
                                  onClick={() =>
                                    handleIncreaseQuantity(item.product.id)
                                  }
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className='icon-trash'
                                onClick={() =>
                                  handleRemoveFromCart(item.product.id)
                                }
                              >
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  width='16'
                                  height='16'
                                  fill='currentColor'
                                  className='bi bi-trash3'
                                  viewBox='0 0 16 16'
                                >
                                  <path d='M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z' />
                                </svg>
                              </button>
                            </div>
                          </td>
                          <td style={{ padding: "20px 0" }}>
                            <div className='total-price-item'>
                              $
                              {item.quantity *
                                parseFloat(item.product.price_sale.slice())}
                              .00
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className='wrapper-checkout'>
                    <div className='title-total-price'>
                      <span className='title-total'>Subtotal</span> $
                      {totalValue.toFixed(2)} USD
                    </div>
                    <div className='sub-title-total'>
                      Taxes and shipping calculated at checkout
                    </div>
                    <div className='pickup-cart'>
                      <Pickup />
                    </div>

                    <button className='btn-go-to-check-out'>Check out</button>
                  </div>
                  <div className='featured-collection'>Featured collection</div>
                  <div>
                    <div className='product-card-cart'>
                      {data.slice(1, 5).map((product) => (
                        <div key={product.id}>
                          <ProductCards product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className='wrapper-no-item'>
                  <div className='title-no-item'>Your cart is empty</div>
                  <button
                    className='continue-shopping-no-item'
                    onClick={() => handleToCatalog()}
                  >
                    Continue shopping
                  </button>
                  <div className='featured-collection'>Featured collection</div>
                  <div>
                    <div className='product-card-cart'>
                      {data.slice(1, 5).map((product) => (
                        <div key={product.id}>
                          <ProductCards product={product} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      }
    />
  );
}

export default Cart;
