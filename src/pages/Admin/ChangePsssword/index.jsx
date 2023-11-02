import { useEffect, useState } from "react";
import { Button, Form, Input, notification } from "antd";
import { FetchApi } from "../../../api/FetchAPI";
import { LockOutlined } from "@ant-design/icons";
import "./ChangePassword.scss";
import { Link } from "react-router-dom";

function ChangePassword() {
  const [data, setData] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const userId = localStorage.getItem("user_id");
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isSubmitting) {
      changePassword(data);
    }
  }, [data, isSubmitting]);

  const changePassword = async (data) => {
    if (data) {
      const result = await FetchApi.changePassword(data);
      if (result && result.statusCode !== 401) {
        setIsSubmitting(false);
        setSubmitLoading(false);
        notification.success({
          message: result.message,
          placement: "topRight",
        });
        form.resetFields();
      } else if (result.statusCode === 401) {
        setIsSubmitting(false);
        setSubmitLoading(false);
        notification.error({
          message: result.message,
          placement: "topRight",
        });
      }
    }
  };

  const onFinish = (values) => {
    const updatedValues = { ...values, user_id: userId };
    setData(updatedValues);
    setIsSubmitting(true);
    setSubmitLoading(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className='wrapper-change-password ml-10'>
      <div className='tracking-wide mt-7 text-[#3d5170] text-[1.625rem] font-medium leading-3 '>
        Change Password
      </div>
      <div className=' mt-5 text-[#737278] text-[14px]   '>
        {" "}
        Change your password or recover your current one.
      </div>
      <Form
        className='text-center  mt-14 '
        name='basic'
        form={form}
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
          className='mt-[40px]'
          name='password'
          rules={[
            {
              required: true,
              message: "Please input your current password",
            },
            {
              min: 8,
              message: "Current password must be at least 8 characters",
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message:
                "Current password must contain at least one uppercase letter, one lowercase letter, and one number",
            },
          ]}
        >
          <Input.Password
            size='large'
            placeholder='Current password'
            prefix={<LockOutlined />}
            className='text-sm'
          />
        </Form.Item>
        <Form.Item
          className='mt-[40px]'
          name='new_password'
          rules={[
            {
              required: true,
              message: "Please input your new password!",
            },
            {
              min: 8,
              message: "New password must be at least 8 characters",
            },
            {
              pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
              message:
                "New password must contain at least one uppercase letter, one lowercase letter, and one number",
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
          name='confirm_password'
          dependencies={["new_password"]}
          rules={[
            {
              required: true,
              message: "Please input your confirm password!",
            },
            ({ getFieldValue }) => ({
              validator: (_, value) => {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Confirm password does not match!");
              },
            }),
          ]}
        >
          <Input.Password
            size='large'
            placeholder='Confirm password'
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
            Change Password
          </Button>
        </Form.Item>
        <Link
          className='hover:underline text-base hover:text-[#48399f] text-[#48399f]'
          to={"/auth/reset-password-request"}
        >
          I forgot my password
        </Link>
      </Form>
    </div>
  );
}

export default ChangePassword;
