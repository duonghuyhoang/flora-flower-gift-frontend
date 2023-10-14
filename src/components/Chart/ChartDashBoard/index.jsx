import { Line } from "@ant-design/plots";
import { useState, useEffect } from "react";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { FetchApi } from "../../../api/FetchAPI";

function ChartDashBoard(store_name) {
  const [data, setData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAnalysis(store_name);
  }, []);

  const getAnalysis = async (store_name) => {
    if (store_name) {
      const result = await FetchApi.getAnalysis(store_name);
      setData(result.data);
      if (result.statusCode === 401) {
        navigate("/auth/login");
      }
    } else {
      notification.error({
        message: "Error fetching analysis",
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
