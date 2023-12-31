import { useEffect, useState } from "react";
import DefaultLayoutStore from "../DefaultLayoutStore";
import "./Catalog.scss";
import { FetchApi } from "../../../api/FetchAPI";
import ProductCards from "../../../components/ProductCards";
import { Pagination, Spin, notification } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

function Catalog() {
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("name-asc");
  const store_name = localStorage.getItem("store_name");
  const [totalPages, setTotalPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const [data, setData] = useState([]);
  const page = 1;

  useEffect(() => {
    if ((store_name, page)) {
      getProducts(store_name, page);
    }
  }, []);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [data]);

  const getProducts = async (store_name, page) => {
    setCurrent(page);
    if ((store_name, page)) {
      const result = await FetchApi.getProductsByStore(store_name, page);
      if (result) {
        setData(result.data);
        setTotalPages(result.totalPages * 10);
        setLoading(false);
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };

  let sortedProducts = [...data];
  switch (sortOption) {
    case "name-asc":
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "name-desc":
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
      break;
    case "price-asc":
      sortedProducts.sort(
        (a, b) => parseFloat(a.price_sale) - parseFloat(b.price_sale)
      );
      break;
    case "price-desc":
      sortedProducts.sort(
        (a, b) => parseFloat(b.price_sale) - parseFloat(a.price_sale)
      );
      break;
    default:
      break;
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
        <div className='wapper-catalog'>
          {loading ? (
            <Spin className='loading' indicator={antIcon} />
          ) : (
            <>
              <div className='wrapper-sort-catalog'>
                <div className='sort-catalog'>
                  <label className='lable-sort' htmlFor='sort-select'>
                    Sort by:
                  </label>
                  <select
                    className='select-sort-catalog'
                    id='sort-select'
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value)}
                  >
                    <option value='name-asc'>Alphabetically, A-Z</option>
                    <option value='name-desc'>Alphabetically, Z-A</option>
                    <option value='price-asc'>Price, low to high</option>
                    <option value='price-desc'>Price, high to low</option>
                  </select>
                </div>
                <div className='product-count'>{data.length} products</div>{" "}
              </div>
              <div className='product-card-catalog'>
                {sortedProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCards product={product} />
                  </div>
                ))}
              </div>
              <Pagination
                className='pagination-collection'
                total={totalPages}
                current={current}
                onChange={(page) => getProducts(store_name, page)}
              />
            </>
          )}
        </div>
      }
    />
  );
}

export default Catalog;
