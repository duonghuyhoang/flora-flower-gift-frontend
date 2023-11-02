import { Button, Form, Input, message } from "antd";
import { FetchApi } from "../../../api/FetchAPI";
import { LockOutlined } from "@ant-design/icons";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../../../public/logo.svg";

function ResetPasswordConfirm() {
  const location = useLocation();
  const data = location.state && location.state.data;
  const [recoveryCode, setRecoveryCode] = useState("");
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmittingSendCode, setIsSubmittingSendCode] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      resetPasswordConfirm(recoveryCode);
    }
  }, [recoveryCode, isSubmitting]);

  useEffect(() => {
    if (isSubmittingSendCode) {
      resetPasswordRequest(data);
    }
  }, [data, isSubmittingSendCode]);

  const resetPasswordRequest = async (data) => {
    if (data) {
      const result = await FetchApi.resetPasswordRequest(data);
      if (result && result.statusCode !== 401) {
        setSuccessMessage("Recovery code sent back");
        setIsSubmittingSendCode(false);
        setErrorMessage("");
      } else if (result.statusCode === 401) {
        setErrorMessage(result.message);
        setSuccessMessage(result.message);
        setIsSubmittingSendCode(false);
      }
    }
  };

  const resetPasswordConfirm = async (recoveryCode) => {
    if (recoveryCode) {
      const value = {
        email: data.email,
        token: recoveryCode.recoveryCode,
      };
      const result = await FetchApi.resetPasswordConfirm(value);
      if (result && result.statusCode !== 401) {
        setErrorMessage("");
        setIsSubmitting(false);
        setSubmitLoading(false);
        navigate("/auth/reset-password", { state: { data, recoveryCode } });
      } else if (result.statusCode === 401) {
        setErrorMessage(result.message);
        setIsSubmitting(false);
        setSubmitLoading(false);
      }
    }
  };

  const onFinish = (values) => {
    setSuccessMessage("");
    setErrorMessage("");
    setRecoveryCode(values);
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
    <div className='container-form reset-password-confirm flex flex-col justify-center items-center '>
      <div className='absolute mt-[-220px]'>
        {" "}
        <img src={logo} alt='logo' className='  w-[100px] h-[100px]' />
      </div>
      <div className='title-form-reset-password-request text-[#5a4e9f] font-medium text-2xl text-center mt-[250px]'>
        Enter the recovery code
      </div>
      <p className=' text-[#5a4e9f] font-normal text-sm mt-10'>
        Please check the code in your email. This code includes 6 numbers.
      </p>
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
          name='recoveryCode'
          rules={[
            {
              required: true,
              message: "Please enter the recovery code",
            },
            {
              pattern: /^\d{6,6}$/,
              message:
                "Recovery codes must contain only numbers and be 6 digits long",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            placeholder='Recovery Code'
            size='large'
            onChange={(e) => setRecoveryCode(e.target.value)}
          />
        </Form.Item>
        <Form.Item className='mt-1 text-left'>
          <span
            className='text-[#48399f] hover:text-[#48399f] hover:underline cursor-pointer'
            onClick={() => setIsSubmittingSendCode(true)}
          >
            Don't have a recovery code yet? Resend code.
          </span>
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

export default ResetPasswordConfirm;
