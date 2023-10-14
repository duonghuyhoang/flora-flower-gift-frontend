import { Badge, Layout, Menu } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { resetLastAddedItem } from "../../features/cart/cartSlice";
import "./Header.scss";
import { FetchApi } from "../../api/FetchAPI";
import { Drawer, Button, notification } from "antd";
import { MenuOutlined } from "@ant-design/icons";

function Header() {
  const location = useLocation();
  const dispatch = useDispatch();
  const locationPart = location.pathname;
  const { Header } = Layout;
  const store_name = localStorage.getItem("store_name");
  const navigate = useNavigate();
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [visibleNotification, setVisibleNotification] = useState(true);
  const [notificationOpen, setNotificationOpen] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  const [searching, setSearching] = useState(false);
  const headerRef = useRef(null);
  const page = 1;
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const itemsCart = useSelector((state) => state.cart.items);
  const itemCount = itemsCart.reduce((total, item) => total + item.quantity, 0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [products, setProducts] = useState(false);
  const lastAddedItem = useSelector((state) => state.cart.lastAddedItem);
  const notificationClass = document.querySelector(".notification");
  const [scrollClass, setScrollClass] = useState("");
  const [inputStates, setInputStates] = useState({
    search: { isFocused: false, hasValue: false },
  });

  useEffect(() => {
    if ((store_name, page && searching === true)) {
      getProducts(store_name, page);
    }
  }, [searching]);

  const getProducts = async (store_name, page) => {
    if ((store_name, page)) {
      const result = await FetchApi.getProductsByStore(store_name, page);
      if (result) {
        setProducts(result.data);
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    if (currentScrollPos < prevScrollPos) {
      setVisible(false);
    } else {
      setVisible(true);
    }
    if (prevScrollPos < 40) {
      setVisible(true);
    }

    if (prevScrollPos < 160) {
      if (notificationClass) {
        notificationClass.classList.remove("fixed-notification");
        notificationClass.classList.remove("fixed-notification-scroll-up");
      }
    } else {
      if (currentScrollPos < prevScrollPos) {
        setVisibleNotification(true);
      } else {
        setVisibleNotification(false);
      }
    }

    setPrevScrollPos(currentScrollPos);
  };
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition < 40) {
        setScrollClass("additional-class");
      } else {
        setScrollClass("");
      }
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup listener when component unmounts
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const handleChange = (event, search) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const results = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [search]: {
        ...prevInputStates[search],
        hasValue: event.target.value !== "",
      },
    }));
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        handleCloseSearch();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const items = [
    { label: "Home", to: `/store/${store_name}/home`, key: "" },
    { label: "Catalog", to: `/store/${store_name}/collections`, key: "tmp-1" },
    { label: "Contact", to: `/store/${store_name}/contact`, key: "tmp-2" },
  ];
  const [current, setCurrent] = useState("tmp-0");
  useEffect(() => {
    if (locationPart === `/store/${store_name}/home`) {
      setCurrent("");
    }
    if (locationPart === `/store/${store_name}/collections`) {
      setCurrent("tmp-1");
    }
    if (locationPart === `/store/${store_name}/contact`) {
      setCurrent("tmp-2");
    }
    document.body.classList.remove("no-scroll");
  }, [location]);
  const onClick = (event) => {
    setCurrent(event.key);

    const key = event.key;
    const item = items.find((item) => item.key === key);

    if (item) {
      navigate(item.to);
    }
  };
  const handleCloseSearch = () => {
    setSearching(false);
    setSearchTerm("");
    document.body.classList.remove("no-scroll");
  };
  function handleOpenSearch() {
    setSearching(true);
    document.body.classList.add("no-scroll");
  }
  const handleToCart = () => {
    navigate(`/store/${store_name}/cart`);
  };
  const handleToCatalog = () => {
    navigate(`/store/${store_name}/collections`);
  };
  useEffect(() => {
    const parts = location.pathname.split("/");
    if (parts[1] === `store/${store_name}/collections` && parts[2]) {
      handleCloseSearch();
    }
  }, [location]);

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };
  const handleCloseNotification = () => {
    setNotificationOpen(false);
  };

  useEffect(() => {
    setShowNotification(false);
    dispatch(resetLastAddedItem());
  }, [location, dispatch]);
  useEffect(() => {
    setNotificationOpen(false);
    setShowNotification(true);
    setTimeout(() => setNotificationOpen(true), 200);
  }, [lastAddedItem]);

  const handleFocus = (search) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [search]: { ...prevInputStates[search], isFocused: true },
    }));
  };
  const handleBlur = (search) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [search]: { ...prevInputStates[search], isFocused: false },
    }));
  };

  return (
    <Header className='header'>
      {searching && <div className='overlay' />}
      <div className='sub-header'>Welcome to our store</div>
      <div className={`main-header ${visible ? "" : "fixed"}`} ref={headerRef}>
        {searchTerm && (
          <div className='search-results'>
            {searchTerm && <div className='title-search-results'>PRODUCTS</div>}
            {searchTerm && <div className='line-search-results'></div>}
            {searchResults.map((product) => (
              <div
                key={product.id}
                className='search-result'
                onClick={() =>
                  navigate(`/store/${store_name}/product/${product.name}`)
                }
              >
                <img
                  className='image-search'
                  src={product.image_product1}
                  alt={product.name}
                />
                <div className='name-search'>{product.name}</div>
              </div>
            ))}
          </div>
        )}
        {searching ? (
          <div className='wrapper-search'>
            <div className='search-input-container'>
              <input
                className='input-search'
                id='search-input'
                type='text'
                value={searchTerm}
                onFocus={() => handleFocus("search")}
                onBlur={() => handleBlur("search")}
                onChange={(event) => handleChange(event, "search")}
              />
              <label
                htmlFor='search-input'
                className={`${
                  inputStates.search.isFocused || inputStates.search.hasValue
                    ? "active"
                    : ""
                }`}
              >
                Search
              </label>
            </div>
            <div className='search-icon-result'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-search search-icon-input-results'
                viewBox='0 0 16 16'
              >
                <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z' />
              </svg>
            </div>
            <button
              type='button'
              className='close-btn-input-search'
              aria-label='Close'
              onClick={() => handleCloseSearch()}
            >
              <span className='close-btn-input-search-icon' aria-hidden='true'>
                &times;
              </span>
            </button>
          </div>
        ) : (
          <>
            <Button
              className='menu-button'
              onClick={handleMenuOpen}
              icon={<MenuOutlined />}
            />
            <Drawer
              title='Menu'
              placement='left'
              closable={false}
              onClose={handleMenuClose}
              visible={menuOpen}
            >
              <Menu mode='inline' onClick={handleMenuClose}>
                {items.map((item) => (
                  <Menu.Item key={item.key} onClick={onClick}>
                    {item.label}
                  </Menu.Item>
                ))}
              </Menu>
            </Drawer>
            <Menu
              onClick={onClick}
              mode='horizontal'
              selectedKeys={[current]}
              items={items}
              style={{ width: "100%", border: "none" }}
              className='nav'
            />

            <div className='icon-header'>
              <a href='/' className=''>
                <div className='logo-header'></div>
              </a>
            </div>
            <div className='search-cart'>
              <div className='search-icon'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width='18'
                  fill='currentColor'
                  height='18'
                  onClick={() => handleOpenSearch()}
                  className='bi bi-search'
                  style={{ color: "#5a4e9f" }}
                  viewBox='0 0 16 16'
                >
                  <path d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z' />
                </svg>
              </div>

              <div
                className='cart-icon'
                onClick={() => handleToCart()}
                style={{ marginTop: "-2px" }}
              >
                <Badge
                  count={itemCount > 0 ? itemCount : null}
                  size='small'
                  offset={[0, 15]}
                  style={{ backgroundColor: "#5a4e9f" }}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='18'
                    height='18'
                    fill='currentColor'
                    className='bi bi-bag-dash'
                    viewBox='0 0 16 16'
                  >
                    <path
                      fillRule='evenodd'
                      d='M5.5 10a.5.5 0 0 1 .5-.5h4a.5.5 0 0 1 0 1H6a.5.5 0 0 1-.5-.5z'
                    />
                    <path d='M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z' />
                  </svg>
                </Badge>
              </div>
            </div>
          </>
        )}
      </div>
      {lastAddedItem && showNotification && notificationOpen && (
        <div
          className={`notification ${scrollClass}  ${
            visibleNotification
              ? "fixed-notification-scroll-up"
              : "fixed-notification"
          }`}
        >
          <div className='heaeder-notification'>
            <div className='title-notification'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='16'
                height='16'
                fill='currentColor'
                className='bi bi-check2'
                viewBox='0 0 16 16'
              >
                <path d='M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z' />
              </svg>
              <span>Item added to your cart</span>
            </div>
            <button
              className='btn-close-notification'
              onClick={handleCloseNotification}
            >
              <span>&times;</span>
            </button>
          </div>

          <div className='content-notification'>
            <img
              src={lastAddedItem.image_product1}
              className='image-notification'
              alt=''
            />
            <p className='name-product-notification'>{lastAddedItem.name}</p>
          </div>
          <div className='footer-notification'>
            <button className='btn-view-to-cart' onClick={() => handleToCart()}>
              View my cart ({itemCount})
            </button>
            <div
              className='continue-shopping-notification'
              onClick={() => handleToCatalog()}
            >
              Continue shopping
            </div>
          </div>
        </div>
      )}
    </Header>
  );
}

export default Header;
