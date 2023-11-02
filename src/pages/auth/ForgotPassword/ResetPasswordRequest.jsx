import { Button, Form, Input, message } from "antd";
import { FetchApi } from "../../../api/FetchAPI";
import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import logo from "../../../../public/logo.svg";

function ResetPasswordRequest() {
  const navigate = useNavigate();
  const [data, setData] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      resetPasswordRequest(data);
    }
  }, [data, isSubmitting]);

  const resetPasswordRequest = async (data) => {
    if (data) {
      const result = await FetchApi.resetPasswordRequest(data);
      if (result && result.statusCode !== 401) {
        setErrorMessage("");
        setIsSubmitting(false);
        setSubmitLoading(false);
        navigate("/auth/reset-password-confirm", { state: { data } });
      } else if (result.statusCode === 401) {
        setErrorMessage(result.message);
        setIsSubmitting(false);
        setSubmitLoading(false);
      }
    }
  };

  const onFinish = (values) => {
    setErrorMessage("");
    setData(values);
    setIsSubmitting(true);
    setSubmitLoading(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
    }
  }, [errorMessage]);

  return (
    <div className='container-form reset-password-request flex flex-col justify-center items-center '>
      <div className='absolute mt-[-180px]'>
        {" "}
        <img src={logo} alt='logo' className='  w-[100px] h-[100px]' />
      </div>
      <div className='title-form-reset-password-request text-[#5a4e9f] font-medium text-2xl text-center mt-[250px]'>
        Enter email to receive recovery code
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
            prefix={<MailOutlined />}
            autoComplete='email'
            className=' text-sm'
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
            Request Reset
          </Button>
        </Form.Item>
      </Form>
      <div className=' text-sm '>
        You remember your password?
        <Link className='text-[#48399f] hover:text-' to={"/auth/login"}>
          {" "}
          Sign in
        </Link>
      </div>
    </div>
  );
}

export default ResetPasswordRequest;
