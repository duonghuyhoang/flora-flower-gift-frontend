/* eslint-disable react/no-unescaped-entities */
import { Button, Checkbox, Col, Form, Input, Row, message } from "antd";
import axios from "axios";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { memo, useEffect, useState } from "react";
import logo from "../../../../public/logo.svg";
import "./Login.scss";
const URL_API = import.meta.env.VITE_API_URL;

// eslint-disable-next-line react/prop-types
function Login({ onLoginSuccess }) {
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [data, setData] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  // const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    const postData = async () => {
      setSubmitLoading(true);
      try {
        const response = await axios.post(`${URL_API}/login`, {
          email: data?.email,
          password: data?.password,
        });

        // handle successful response

        localStorage.setItem("accessToken", response.data.access_token);
        localStorage.setItem("current_user", response.data.current_user);
        onLoginSuccess(response.data.access_token);
        setErrorMessage("");
        setSuccessMessage("Successfully");
        setIsSubmitting(false);
        if (localStorage.getItem("accessToken")) {
          setShouldRedirect(true);
        }
        setSubmitLoading(false);
      } catch (error) {
        // handle error response
        setSubmitLoading(false);
        setSuccessMessage("");

        setErrorMessage(error.response.data.message);

        setIsSubmitting(false);
      }
    };

    if (isSubmitting) {
      postData();
    }
  }, [data, isSubmitting, onLoginSuccess]);

  const onFinish = (values) => {
    setSuccessMessage("");
    setErrorMessage("");
    setData(values);
    setIsSubmitting(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
    }

    if (errorMessage) {
      message.error(errorMessage);
    }
  }, [successMessage, errorMessage]);
  useEffect(() => {
    const navigateToDashboard = async () => {
      if (shouldRedirect) {
        await new Promise((resolve) => {
          setTimeout(() => {
            window.history.pushState({}, null, "/admin/dashboard");
            window.location.reload();
            resolve();
          }, 1000);
        });
      }
    };
    navigateToDashboard();
  }, [shouldRedirect]);
  return (
    <div className='container-form-login flex flex-col justify-center items-center '>
      <div className='absolute mt-[-300px]'>
        {" "}
        <img src={logo} alt='logo' className=' w-[100px] h-[100px]' />
      </div>
      <div className='title-form-login font-medium text-2xl text-center mt-[250px]'>
        Sign in to your account
      </div>

      <Form
        className='text-center  mt-14'
        name='basic'
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 24,
        }}
        style={{
          maxWidth: 400,
          width: "100%",
        }}
        initialValues={{
          remember: false,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='on'
      >
        <Form.Item
          name='email'
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
            {
              type: "email",
              message: "The input is not a valid email!",
            },
          ]}
        >
          <Input
            size='large'
            placeholder='Email'
            prefix={<UserOutlined />}
            autoComplete='email'
            className=' text-sm'
          />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
            {
              min: 8,
              message: "Password must be at least 8 characters",
            },
          ]}
        >
          <Input.Password
            size='large'
            placeholder='Password'
            prefix={<LockOutlined />}
            className='text-sm'
          />
        </Form.Item>

        <Form.Item className='mt-10'>
          <Row>
            <Col
              span={12}
              style={{
                textAlign: "left",
              }}
            >
              <Form.Item name='remember' valuePropName='checked'>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>
            </Col>
            <Col
              span={12}
              style={{
                textAlign: "right",
                color: "#5648a5",
                marginTop: "5px",
              }}
            >
              <a className='link-forgot-password' href='#'>
                Forgot your password?
              </a>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          className='mt-[-10px]'
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            size='large'
            type='primary'
            htmlType='submit'
            block
            loading={submitLoading}
            className='btn-submit-login'
          >
            Sign in
          </Button>
        </Form.Item>
      </Form>
      <div className=' text-sm'>
        Don't have an account yet?{" "}
        <Link className='text-[#48399f]' to={"/auth/register"}>
          Register now
        </Link>
      </div>
    </div>
  );
}

export default memo(Login);
