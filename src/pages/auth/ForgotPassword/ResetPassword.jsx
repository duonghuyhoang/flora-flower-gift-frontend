import { Button, Form, Input, message } from "antd";
import { FetchApi } from "../../../api/FetchAPI";
import { LockOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../../public/logo.svg";
import "./ForgotPassword.scss";

function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state && location.state.data;
  const recoveryCode = location.state && location.state.recoveryCode;
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      resetPassword(password);
    }
  }, [password, isSubmitting]);

  const resetPassword = async (password) => {
    if (password) {
      const value = {
        email: email.email,
        token: recoveryCode.recoveryCode,
        password: password.password,
      };
      const result = await FetchApi.resetPassword(value);
      if (result && result.statusCode !== 401) {
        setErrorMessage("");
        setIsSubmitting(false);
        setSubmitLoading(false);
        setSuccessMessage(result.message);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
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
    setPassword(values);
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

  return (
    <div className='container-form forgot-password flex flex-col justify-center items-center '>
      <div className='absolute mt-[-150px]'>
        {" "}
        <img src={logo} alt='logo' className='  w-[100px] h-[100px]' />
      </div>
      <div className='title-form-reset-password-request text-[#5a4e9f] font-medium text-2xl text-center mt-[250px]'>
        Change new password
      </div>
      <Form
        className='text-center  mt-5'
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete='off'
      >
        <Form.Item
          className='mt-[40px]'
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
            placeholder='New password'
            prefix={<LockOutlined />}
            className='text-sm'
          />
        </Form.Item>

        <Form.Item
          className='mt-[40px]'
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
            Confirm
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ResetPassword;
