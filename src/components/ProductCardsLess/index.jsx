import "./ProductCardsLess.scss";
import { Link } from "react-router-dom";
import Sale from "../Sale";
import { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

function ProductCardsLess({ product }) {
  const [imageSrc, setImageSrc] = useState(product.image_product1);
  const store_name = localStorage.getItem("store_name");

  const handleMouseEnter = () => {
    setImageSrc(product.image_product2);
  };

  const handleMouseLeave = () => {
    setImageSrc(product.image_product1);
  };
  return (
    <div className='card-product-less'>
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
          <div className='price-main-product-card'>{product.price_main}</div>
          <div className='price-sale-product-card'>{product.price_sale}</div>
        </div>
      </Link>
    </div>
  );
}

export default ProductCardsLess;
