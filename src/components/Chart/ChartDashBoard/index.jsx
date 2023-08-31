import { Line } from "@ant-design/plots";
import { useState, useEffect } from "react";
import axios from "axios";
import { notification } from "antd";
const URL_API = import.meta.env.VITE_API_URL;

function ChartDashBoard(store_name) {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData(store_name);
  }, []);

  const fetchData = async (store_name) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const response = await axios.post(`${URL_API}/analyze`, {
        store_name,
      });
      setData(response.data.data);
    } catch (error) {
      notification.error({
        message: error,
        placement: "topRight",
      });
    }
  };
  const config = {
    data,
    padding: "auto",
    xField: "date",
    yField: "product",
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
  };

  return (
    <>
      <div className='title-chart py-4 pl-5 text-left  text-xl  font-bold border-b-[1px] text-gray-600 border-[rgb(204,204,204)]'>
        Products
      </div>
      <div className=' pt-5 pr-4 pb-7 pl-4 '>
        {" "}
        <Line {...config} />
      </div>
    </>
  );
}

export default ChartDashBoard;
