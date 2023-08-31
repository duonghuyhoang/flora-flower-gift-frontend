import ChartDashBoard from "../../../components/Chart/ChartDashBoard";
import "./Dashboard.scss";
import {
  CalendarOutlined,
  DollarCircleOutlined,
  FileDoneOutlined,
} from "@ant-design/icons";
import { Statistic, Card } from "antd";

function Dashboard() {
  const store_name = localStorage.getItem("store_name");

  return (
    <div>
      <div className=' text-2xl text-gray-700 ml-6 font-semibold'>
        {" "}
        Dasboard
      </div>
      <div className='demo-card mt-5'>
        <Card className='card-body1'>
          <Statistic
            className='card-body-title1'
            title='EARNINGS (MONTHLY)'
            value={40000}
            prefix={<CalendarOutlined />}
          />
        </Card>
        <Card className='card-body2'>
          <Statistic
            className='card-body-title2'
            title='EARNINGS (ANNUAL)'
            value={215000}
            prefix={<DollarCircleOutlined />}
          />
        </Card>
        <Card className='card-body3'>
          <Statistic
            className='card-body-title3'
            title='TASKS'
            value={50}
            suffix='%'
          />
        </Card>
        <Card className='card-body4'>
          <Statistic
            className='card-body-title4'
            title='PENDING REQUESTS'
            value={18}
            prefix={<FileDoneOutlined />}
          />
        </Card>
      </div>
      <div className='chart-dash-board'>
        <ChartDashBoard store_name={store_name} />
      </div>
    </div>
  );
}

export default Dashboard;
