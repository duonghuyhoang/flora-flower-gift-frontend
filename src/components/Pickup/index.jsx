import "./Pickup.scss";
import { useState } from "react";
import { DatePicker, Select } from "antd";
import moment from "moment";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

function Pickup() {
  const { Option } = Select;
  const [content, setContent] = useState(1);
  const [contentMap, setContentMap] = useState(1);
  const [inputValue, setInputValue] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  function handleButtonClick(value) {
    setContentMap(value);
  }

  function disabledDate(current) {
    return (
      current &&
      (current < moment().startOf("day") || current > moment().add(30, "days"))
    );
  }
  function handleDateChange(date) {
    setSelectedDate(date);
  }

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  function handleCheck() {
    if (inputValue === "10000") {
      setValidationMessage(
        <>
          <CheckOutlined /> Local delivery available
        </>
      );
      setIsValid(true);
    } else {
      setValidationMessage(
        <>
          <CloseOutlined /> Sorry, your area is not supported for delivery
        </>
      );
      setIsValid(false);
    }
  }
  return (
    <div className='delivery-date'>
      <div className='title-select'>Select a delivery date</div>
      <div className='wrapper-select-option'>
        <div className='radio-item'>
          <input
            type='radio'
            name='content'
            id='content1'
            className='input-select-1'
            checked={content === 1}
            onChange={() => setContent(1)}
          />
          <label className='custom-radio option-1' htmlFor='content1'>
            Delivery Date
          </label>
        </div>
        <div className='radio-item'>
          <input
            type='radio'
            name='content'
            id='content2'
            className='input-select-2'
            checked={content === 2}
            onChange={() => setContent(2)}
          />
          <label className='custom-radio option-2' htmlFor='content2'>
            Store Pickup
          </label>
        </div>
      </div>

      {content === 1 && (
        <div className='content-option-1'>
          <div className='title-content-option-1'>
            Enter your zip code (Try 10000)
          </div>
          <div className='detail-content-option-1'>
            <div className='detail-input-content-option-1'>
              <input
                className='input-enter-zipcode'
                type='text'
                placeholder='Enter your zip code (Try 10000)'
                value={inputValue}
                onChange={handleInputChange}
              />
              <select className='select-zicode' id='sort-select'>
                <option>Zipcode</option>
              </select>
              <button className='btn-check-zipcode' onClick={handleCheck}>
                Check
              </button>
            </div>

            <div
              className='validation-zipcode'
              style={{ color: isValid ? "#008c30" : "#e30000" }}
            >
              {validationMessage}
            </div>
            {isValid && (
              <div className='wrapprer-pickup'>
                <DatePicker
                  placeholder='Delivery Date'
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  className='delivery-date-input'
                />

                <Select
                  placeholder='Delivery Time'
                  disabled={!selectedDate}
                  className='delivery-time-input'
                >
                  <Option value='14:30-15:00'>14:30-15:00</Option>
                  <Option value='13:45-14:15'>13:45-14:15</Option>
                </Select>
              </div>
            )}
          </div>
        </div>
      )}
      {content === 2 && (
        <div className='content-option-2'>
          {contentMap === 1 && (
            <iframe
              src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.5546527376637!2d105.81956377498031!3d21.010481780634358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab7df6b6f0a1%3A0xa56a33e7527215dd!2zOCBOZy4gMTEgUC4gVGjDoWkgSMOgLCBUcnVuZyBMaeG7h3QsIMSQ4buRbmcgxJBhLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1686631324771!5m2!1svi!2s'
              width='367'
              height='240'
              allowfullscreen=''
              loading='lazy'
              referrerpolicy='no-referrer-when-downgrade'
            ></iframe>
          )}
          {contentMap === 2 && (
            <div>
              <iframe
                src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.2230391712565!2d105.7680370788893!3d21.063752230558052!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31345528540371d9%3A0xd198a203aa1724d7!2zMjEgUC4gVmnDqm4sIEPhu5UgTmh14bq_LCBU4burIExpw6ptLCBIw6AgTuG7mWksIFZp4buHdCBOYW0!5e0!3m2!1svi!2s!4v1686631227197!5m2!1svi!2s'
                width='367'
                height='240'
                allowfullscreen=''
                loading='lazy'
                referrerpolicy='no-referrer-when-downgrade'
              ></iframe>
            </div>
          )}
          <div className='wrapper-pick-map'>
            <div className='title-wrapper-pick-map'>
              Choose the storage to pickup your products(s)
            </div>
            <div className='wrapper-radio-item'>
              <div className='radio-item-map-1'>
                <input
                  type='radio'
                  id='content-map-1'
                  className='input-select-map-1'
                  checked={contentMap === 1}
                  onChange={() => handleButtonClick(1)}
                />
                <label
                  className='custom-radio option-1'
                  htmlFor='content-map-1'
                >
                  <div className='title-pick-up'>Store 1</div>
                  <div className='detail-pick-up'>
                    8 Ng. 11 P. Thái Hà, Trung Liệt, Đống Đa, Hà Nội, Việt Nam
                  </div>
                </label>
              </div>
              <div className='radio-item-map-2'>
                <input
                  type='radio'
                  id='content-map-2'
                  className='input-select-map-2'
                  checked={contentMap === 2}
                  onChange={() => handleButtonClick(2)}
                />
                <label
                  className='custom-radio option-2'
                  htmlFor='content-map-2'
                >
                  <div className='title-pick-up'>Store 2</div>
                  <div className='detail-pick-up'>
                    21 Phố Viên, Cổ Nhuế 2, Từ Liêm, Hà Nội, Việt Nam
                  </div>
                </label>
              </div>
            </div>
          </div>
          <div className='wrapprer-pickup'>
            <DatePicker
              placeholder='Delivery Date'
              disabledDate={disabledDate}
              onChange={handleDateChange}
              className='delivery-date-input'
            />

            <Select
              placeholder='Delivery Time'
              disabled={!selectedDate}
              className='delivery-time-input'
            >
              <Option value='14:30-15:00'>14:30-15:00</Option>
              <Option value='13:45-14:15'>13:45-14:15</Option>
            </Select>
          </div>
        </div>
      )}
      <div className='content-select'></div>
    </div>
  );
}

export default Pickup;
