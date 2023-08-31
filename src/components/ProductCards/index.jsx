import "./ProductCards.scss";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cart/cartSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
import Sale from "../Sale";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function ProductCards({ product }) {
  const store_name = localStorage.getItem("store_name");
  const dispatch = useDispatch();
  const [imageSrc, setImageSrc] = useState(product.image_product1);

  const handleMouseEnter = () => {
    setImageSrc(product.image_product2);
  };

  const handleMouseLeave = () => {
    setImageSrc(product.image_product1);
  };
  return (
    <div className='card-product'>
      <Link
        className='link-hover'
        to={`/store/${store_name}/product/${product.name}`}
      >
        <div className='sale-icon-product-card'>
          <Sale />
        </div>

        <TransitionGroup component={null}>
          <CSSTransition key={imageSrc} timeout={300} classNames='fade'>
            <img
              src={imageSrc}
              alt='Product Image'
              className='image-product-card'
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          </CSSTransition>
        </TransitionGroup>

        <div className='name-product-card'>{product.name}</div>
        <div className='price-product-card'>
          <div className='price-main-product-card'>{`$${product.price_main}`}</div>
          <div className='price-sale-product-card'>{`$${product.price_sale}`}</div>
        </div>
      </Link>
      <div
        className='add-to-cart-product-card'
        onClick={() => dispatch(addToCart({ product, quantity: 1 }))}
      >
        Add to cart
      </div>
    </div>
  );
}
ProductCards.propTypes = {
  product: PropTypes.shape({
    image_product1: PropTypes.string.isRequired,
    image_product2: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price_main: PropTypes.number.isRequired,
    price_sale: PropTypes.number.isRequired,
  }).isRequired,
};
export default ProductCards;
