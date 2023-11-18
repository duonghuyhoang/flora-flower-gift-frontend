import { Input, Select, Col, Row, Radio, Checkbox, Badge } from "antd";
import { useState } from "react";
import { useSelector } from "react-redux";
import "./CheckOut.scss";

function CheckOut() {
  const store_name = localStorage.getItem("store_name");
  let subtotal = 0;
  const [discountCode, setDiscountCode] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState("ship");
  const items = useSelector((state) => state.cart.items);

  items.forEach((item) => {
    const price = item.product.price_sale;
    const quantity = item.quantity;
    const productSubtotal = price * quantity;
    subtotal += productSubtotal;
  });

  const handleInputChange = (e) => {
    setDiscountCode(e.target.value);
    setIsButtonDisabled(e.target.value === "");
  };
  const formattedSubtotal = subtotal.toFixed(2);
  console.log(items[0]);
  console.log(formattedSubtotal);

  const handleSelection = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className='checkout'>
      <header className='checkout-wrapper-header'>
        <div className='checkout-header'>
          <div className='text-[24px] flex justify-between items-center text-left px-4 min-w-full'>
            {" "}
            {store_name}
            <span className='text-[#1773b0] cursor-pointer'>
              {" "}
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
            </span>
          </div>
        </div>
      </header>
      <main className='checkout-main'>
        <section className='checkout-enter-info-container'>
          <div className='checkout-enter-info'>
            <div className='pick-email'>
              <span className='text-[14px] text-[#707070] font-thin '>
                Email
              </span>
              <input
                type='email'
                className='text-[14px] text-[#1a1a1a] mt-4 '
                placeholder='Email'
              />
              <div className='line'></div>
              <div className='wrapper-checkbox'>
                <Checkbox>Email me with news and offers</Checkbox>
              </div>
            </div>
            <div className='wrapper-delivery'>
              <h2 className='text-[24px]'>Delivery</h2>
              <div className='pick-delivery'>
                <div
                  className={`ship ${
                    selectedOption === "ship" ? "selected" : ""
                  }`}
                  onClick={() => handleSelection("ship")}
                >
                  <span>
                    {" "}
                    <Radio checked={selectedOption === "ship"}>Ship</Radio>{" "}
                  </span>

                  <span>
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke={
                        selectedOption === "ship" ? "#1773b0" : "currentColor"
                      }
                      className='w-5 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12'
                      />
                    </svg>
                  </span>
                </div>
                <div
                  className={`pick-up ${
                    selectedOption === "pickup" ? "selected" : ""
                  }`}
                  onClick={() => handleSelection("pickup")}
                >
                  <span>
                    {" "}
                    <Radio checked={selectedOption === "pickup"}>
                      Pick up
                    </Radio>{" "}
                  </span>

                  <span>
                    {" "}
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      fill='none'
                      viewBox='0 0 24 24'
                      strokeWidth='1.5'
                      stroke={
                        selectedOption === "pickup" ? "#1773b0" : "currentColor"
                      }
                      className='w-5 h-6'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        d='M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z'
                      />
                    </svg>
                  </span>
                </div>
                <Row>
                  <Col span={24}>
                    <Select
                      style={{
                        width: "100%",
                        height: "50px",
                        marginBottom: "10px",
                      }}
                      defaultValue='lucy'
                      placeholder='Select'
                      options={[{ value: "lucy", label: "Lucy" }]}
                    />
                  </Col>
                </Row>
                <Row gutter={11}>
                  <Col span={12}>
                    <Input placeholder='First name (optional)' />
                  </Col>
                  <Col span={12}>
                    <Input placeholder='Last name' />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Input placeholder='Address' />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Input placeholder='Apartment, suite, etc. (optional)' />
                  </Col>
                </Row>
                <Row gutter={15}>
                  <Col span={8}>
                    <Input placeholder='City' />
                  </Col>
                  <Col span={8}>
                    <Select
                      style={{
                        width: "100%",
                        height: "50px",
                      }}
                      placeholder='State'
                      options={[{ value: "vn", label: "Viet Nam" }]}
                    />
                  </Col>
                  <Col span={8}>
                    <Input placeholder='ZIP code' />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Input placeholder='Phone (optional)' />
                  </Col>
                </Row>
                <h3 className='text-[17px] mt-5 mb-3'>Shipping method</h3>
                <div className='p-[17px] bg-[#f5f5f5]'>
                  {" "}
                  <p className='text-[14px] text-[#707070] font-thin'>
                    Enter your shipping address to view available shipping
                    methods.
                  </p>{" "}
                </div>
              </div>
            </div>
            <div className='payment'>
              <h2 className='text-[24px] '>Payment</h2>
              <p className='text-[14px] text-[#707070] font-thin'>
                All transactions are secure and encrypted.
              </p>
              <div className='wrapper-input-card'>
                <div className='lable-credit-card text-[14px] font-thin'>
                  Credit card{" "}
                  <span className='px-[14px] rounded-sm bg-[#eda126] text-white'>
                    B
                  </span>
                </div>
                <div className='inputs-card'>
                  <Row>
                    <Col span={24}>
                      <Input placeholder='Card number' />
                    </Col>
                  </Row>
                  <Row gutter={11}>
                    <Col span={12}>
                      <Input placeholder='Expiration date (MM / YY)' />
                    </Col>
                    <Col span={12}>
                      <Input placeholder='Security code' />
                    </Col>
                  </Row>
                  <Row>
                    <Col span={24}>
                      <Input placeholder='Name on card' />
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
            <div className='p-[21px]'>
              {" "}
              <button type='submit' className='btn-paynow'>
                Pay now
              </button>
            </div>
          </div>
        </section>
        <section className='checkout-discount'>
          <div className='wrapper-discount'>
            {items.map((item) => (
              <div key={item.product.id} className='product-discount'>
                <Badge count={item.quantity} color='#666'>
                  <img
                    src={item.product.image_product1}
                    width={64}
                    height={64}
                    alt='product-img'
                    className='rounded-lg'
                  />
                </Badge>

                <p className='text-[14px] text-[#575757]'>
                  {item.product.name}
                </p>
                <span className='ml-5 text-[14px] text-[#565656]'>
                  $ {item.product.price_sale}
                </span>
              </div>
            ))}

            <div className='wrapper-enter-discount'>
              <Row gutter={11}>
                <Col span={20}>
                  <Input
                    placeholder='Discount code'
                    value={discountCode}
                    onChange={handleInputChange}
                  />
                </Col>
                <Col span={4}>
                  <button
                    disabled={isButtonDisabled}
                    className={`btn-apply-discount ${
                      isButtonDisabled === true ? "enable" : ""
                    }`}
                  >
                    Apply
                  </button>
                </Col>
              </Row>
              <div className='subtotal flex justify-between mt-5'>
                <span className='text-[14px] text-[#6f6f6f]'>Subtotal</span>{" "}
                <span className='text-[14px] text-[#6f6f6f]'>
                  $ {formattedSubtotal}
                </span>{" "}
              </div>
              <div className='shipping flex justify-between  mt-2'>
                <span className='text-[14px] text-[#6f6f6f]'>Shipping</span>{" "}
                <span className='text-[12px] text-[#6f6f6f]'>
                  Enter shipping address
                </span>{" "}
              </div>
              <div className='total flex justify-between  mt-2'>
                <span className='text-[17px] text-[#6f6f6f]'>Total</span>{" "}
                <span className='text-[17px] text-[#6f6f6f]'>
                  USD ${formattedSubtotal}
                </span>{" "}
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className='checkout-footer'>
        <p className='text-[14px] text-[#707070] font-thin'>
          All rights reserved floraflowergift
        </p>
      </footer>
    </div>
  );
}

export default CheckOut;
