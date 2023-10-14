/* eslint-disable react/no-unescaped-entities */
import { Button, Col, Form, Input, Row, message } from "antd";
import { FetchApi } from "../../../api/FetchAPI";
import { LockOutlined, UserOutlined, ShopOutlined } from "@ant-design/icons";
import { Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../../public/logo.svg";

function Register() {
  const [data, setData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    Register(data);
  }, [data, isSubmitting]);

  const Register = async (data) => {
    if (data) {
      const result = await FetchApi.register(data);

      if (result && result.statusCode !== 401) {
        setErrorMessage("");
        setSuccessMessage(result.message);
        setIsSubmitting(false);
        setShouldRedirect(true);
        setSubmitLoading(false);
      } else if (result.statusCode === 401) {
        setSuccessMessage("");
        setErrorMessage(result.message);
        setIsSubmitting(false);
        setSubmitLoading(false);
      }
    }
  };

  const onFinish = (values) => {
    setSuccessMessage("");
    setErrorMessage("");
    setData(values);
    setIsSubmitting(true);
    setSubmitLoading(true);
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

  if (shouldRedirect) {
    return <Navigate to='/auth/login' />;
  }

  return (
    <div className='container-form-login flex flex-col justify-center items-center '>
      <div className='absolute mt-[-380px]'>
        {" "}
        <img src={logo} alt='logo' className='  w-[100px] h-[100px]' />
      </div>
      <div className='title-form-login font-medium text-2xl text-center mt-[250px]'>
        Register a new account
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
        <Form.Item>
          <Row className='flex  justify-between items-center'>
            <Col span={11}>
              <Form.Item
                name='firstname'
                rules={[
                  {
                    required: true,
                    message: "Please input your  first name!",
                  },
                ]}
              >
                <Input
                  size='large'
                  className='text-sm'
                  placeholder='First name'
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              {" "}
              <Form.Item
                name='lastname'
                rules={[
                  {
                    required: true,
                    message: "Please input your last name!",
                  },
                ]}
              >
                <Input
                  size='large'
                  className='text-sm'
                  placeholder='Last name'
                  prefix={<UserOutlined />}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item
          className='mt-[-20px]'
          name='username'
          rules={[
            {
              required: true,
              message: "Please input your username!",
            },
          ]}
        >
          <Input
            size='large'
            placeholder='Username'
            prefix={<UserOutlined />}
            className='text-sm'
          />
        </Form.Item>
        <Form.Item
          name='storename'
          rules={[
            {
              required: true,
              message: "Please input your store name!",
            },
          ]}
        >
          <Input
            size='large'
            placeholder='Store name'
            prefix={<ShopOutlined />}
            className='text-sm'
          />
        </Form.Item>

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
            className='text-sm'
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
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message:
                "Password must contain at least one uppercase letter, one lowercase letter, and one number",
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

        <Form.Item
          className='mt-[70px]'
          wrapperCol={{
            span: 24,
          }}
        >
          <Button
            loading={submitLoading}
            size='large'
            type='primary'
            htmlType='submit'
            block
          >
            Sign up
          </Button>
        </Form.Item>
      </Form>
      <div className=' text-sm'>
        Already have an account{" "}
        <Link className='text-[#4096ff] ' to={"/auth/login"}>
          Login now
        </Link>
      </div>
    </div>
  );
}

export default Register;
