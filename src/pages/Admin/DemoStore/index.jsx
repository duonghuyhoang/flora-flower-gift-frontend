import { Carousel } from "antd";
import demoStore1 from "../../../assets/demo-store-1.png";
import demoStore2 from "../../../assets/demo-store-2.png";
import demoStore3 from "../../../assets/demo-store-3.png";
import demoStore4 from "../../../assets/demo-store-4.png";
import demoStore5 from "../../../assets/demo-store-5.png";

const contentStyle = {
  width: "100%",
  height: "75vh",
  marginTop: "60px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  objectFit: "contain",
};

function DemoStore() {
  return (
    <div>
      <Carousel autoplay>
        <div>
          <img style={contentStyle} src={demoStore1} alt='demo store' />
        </div>
        <div>
          <img style={contentStyle} src={demoStore2} alt='demo store' />
        </div>
        <div>
          <img style={contentStyle} src={demoStore3} alt='demo store' />
        </div>
        <div>
          <img style={contentStyle} src={demoStore4} alt='demo store' />
        </div>
        <div>
          <img style={contentStyle} src={demoStore5} alt='demo store' />
        </div>
      </Carousel>
    </div>
  );
}

export default DemoStore;
