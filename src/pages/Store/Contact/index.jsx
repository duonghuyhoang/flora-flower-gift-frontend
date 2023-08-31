import "./Contact.scss";

import DefaultLayoutStore from "../DefaultLayoutStore";
import { useState } from "react";

function Contact() {
  const [inputStates, setInputStates] = useState({
    name: { isFocused: false, hasValue: false },
    email: { isFocused: false, hasValue: false },
    phone: { isFocused: false, hasValue: false },
    comment: { isFocused: false, hasValue: false },
  });

  const handleFocus = (name) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [name]: { ...prevInputStates[name], isFocused: true },
    }));
  };

  const handleBlur = (name) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [name]: { ...prevInputStates[name], isFocused: false },
    }));
  };

  const handleChange = (event, name) => {
    setInputStates((prevInputStates) => ({
      ...prevInputStates,
      [name]: { ...prevInputStates[name], hasValue: event.target.value !== "" },
    }));
  };
  return (
    <DefaultLayoutStore
      content={
        <div className='wrapper-contact'>
          <div className='form-contact'>
            <div className='titlle-contact'>Contact</div>
            <div className='wrapper-input'>
              <div className='wrapper-input-name-email'>
                <div className='name-input-container'>
                  <input
                    className='name-input'
                    id='name-input'
                    type='text'
                    onFocus={() => handleFocus("name")}
                    onBlur={() => handleBlur("name")}
                    onChange={(event) => handleChange(event, "name")}
                  />
                  <label
                    htmlFor='name-input'
                    className={`${
                      inputStates.name.isFocused || inputStates.name.hasValue
                        ? "active"
                        : ""
                    }`}
                  >
                    Name
                  </label>
                </div>
                <div className='email-input-container'>
                  <input
                    className='email-input'
                    id='email-input'
                    type='email'
                    onFocus={() => handleFocus("email")}
                    onBlur={() => handleBlur("email")}
                    onChange={(event) => handleChange(event, "email")}
                  />
                  <label
                    htmlFor='email-input'
                    className={`${
                      inputStates.email.isFocused || inputStates.email.hasValue
                        ? "active"
                        : ""
                    }`}
                  >
                    Email *
                  </label>
                </div>
              </div>

              <div className='phone-input-container'>
                <input
                  className='phone-input'
                  id='phone-input'
                  type='text'
                  onFocus={() => handleFocus("phone")}
                  onBlur={() => handleBlur("phone")}
                  onChange={(event) => handleChange(event, "phone")}
                />
                <label
                  htmlFor='phone-input'
                  className={`${
                    inputStates.phone.isFocused || inputStates.phone.hasValue
                      ? "active"
                      : ""
                  }`}
                >
                  Phone number
                </label>
              </div>
              <div className='comment-input-container'>
                <input
                  className='comment-input'
                  id='comment-input'
                  type='text'
                  onFocus={() => handleFocus("comment")}
                  onBlur={() => handleBlur("comment")}
                  onChange={(event) => handleChange(event, "comment")}
                />
                <label
                  htmlFor='comment-input'
                  className={`${
                    inputStates.comment.isFocused ||
                    inputStates.comment.hasValue
                      ? "active"
                      : ""
                  }`}
                >
                  Comment
                </label>
              </div>
            </div>
            <button className='btn-send'>Send</button>
          </div>
        </div>
      }
    />
  );
}

export default Contact;
