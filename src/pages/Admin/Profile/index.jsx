import {
  Button,
  Form,
  Input,
  Progress,
  Spin,
  Upload,
  message,
  notification,
} from "antd";
import "./Profile.scss";
import { FetchApi } from "../../../api/FetchAPI";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

function Profile() {
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [data, setData] = useState("");
  const userId = localStorage.getItem("user_id");
  const [userData, setUserData] = useState();
  const [userProfileData, setUserProfileData] = useState();
  const [completion, setCompletion] = useState(0);
  const [completedInputs, setCompletedInputs] = useState({});

  useEffect(() => {
    if (userId) {
      getUserProfileData(userId);
    }
  }, []);
  useEffect(() => {
    if (data) {
      updateUserProfile(data);
    }
  }, [data, isSubmitting]);

  const getUserProfileData = async (userId) => {
    if (userId) {
      const result = await FetchApi.getUser(userId);
      const profileResult = await FetchApi.getUserProfile(userId);

      if (result && profileResult) {
        setUserData(result);
        setUserProfileData(profileResult);
        setLoadingData(false);

        if (profileResult.statusCode === 401 || result.statusCode === 401) {
          navigate("/auth/login");
        }
      } else {
        notification.error({
          message: "Error fetching user data",
          placement: "topRight",
        });
      }
    }
  };
  const updateUserProfile = async (data) => {
    if (data) {
      const result = await FetchApi.updateUserProfile(data);

      if (result) {
        notification.success({
          message: "Update successfully!!!",
          placement: "topRight",
        });
        setTimeout(() => {
          window.location.reload();
        }, 200);
      } else {
        notification.error({
          message: result.message,
          placement: "topRight",
        });
      }
    }
  };

  const handleChange = (info) => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setImageUrl(imageUrl);
        setLoading(false);
        if (imageUrl) {
          setCompletedInputs((prevCompletedInputs) => ({
            ...prevCompletedInputs,
            imageUrl: true,
          }));
        }
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error("File upload failed.");
    }
  };
  const uploadButton = (
    <div>
      <div className='ml-4'>
        {" "}
        {loading ? <LoadingOutlined /> : <PlusOutlined />}
      </div>
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 575px)");
    setIsSmallScreen(mediaQuery.matches);

    const handleMediaQueryChange = (event) => {
      setIsSmallScreen(event.matches);
    };

    mediaQuery.addListener(handleMediaQueryChange);

    return () => {
      mediaQuery.removeListener(handleMediaQueryChange);
    };
  }, []);

  const onFinish = (values) => {
    const updatedValues = { ...values, imageUrl: imageUrl, user_id: userId };
    setIsSubmitting(true);
    setData(updatedValues);
  };

  useEffect(() => {
    onInputChange();
  }, [completedInputs]);

  const handleInputChange = (event, inputName) => {
    const { value } = event.target;
    const inputHasValue = value.trim() !== "";

    setCompletedInputs((prevCompletedInputs) => {
      const updatedInputs = { ...prevCompletedInputs };

      if (inputHasValue) {
        updatedInputs[inputName] = true;
      } else {
        delete updatedInputs[inputName];
      }

      return updatedInputs;
    });
  };

  const countKeysWithValue = (data) => {
    if (!data) {
      return 0;
    }

    const keysWithValue = Object.keys(data).filter((key) => {
      const value = data[key];
      return value !== null && value !== undefined;
    });

    return keysWithValue.length;
  };

  const totalCount =
    countKeysWithValue(userData) + countKeysWithValue(userProfileData);

  useEffect(() => {
    onInputChange();
  }, [totalCount]);

  const onInputChange = () => {
    const totalInputs = 12;
    let inputCompletion;
    if (totalCount !== 0) {
      inputCompletion = Math.round(
        ((totalCount +
          (completedInputs ? Object.keys(completedInputs).length : 0) -
          2) /
          totalInputs) *
          100
      );
    } else {
      inputCompletion = Math.round(
        (Object.keys(completedInputs).length / totalInputs) * 100
      );
    }

    setCompletion(inputCompletion);
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 6 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 24 },
    },
  };
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  const initialValues = {
    ...userData,
    ...userProfileData,
  };

  return loadingData ? (
    <Spin className='loading' indicator={antIcon} />
  ) : (
    <div className='wrapper-profile'>
      <div className='mt-4'>
        <div className='tracking-wide text-[#818ea3] text-[.625rem]'>
          OVERVIEW
        </div>
        <div className='tracking-wide mt-2 text-[#3d5170] text-[1.625rem] font-medium leading-3 '>
          User Profile
        </div>
      </div>
      <div className='flex lg:flex-row flex-col gap-10 '>
        {" "}
        <div className='card-profile min-h-[500px] h-full max-w-[100%] lg:max-w-[490px] form-user rounded-lg mt-10 '>
          <div className='flex justify-center items-center pt-10'>
            <Upload
              name='avatar'
              listType='picture'
              className='avatar-uploader'
              showUploadList={false}
              action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt='avatar' />
              ) : userProfileData.imageUrl !== null ? (
                <img src={userProfileData.imageUrl} alt='avatar' />
              ) : (
                uploadButton
              )}
            </Upload>
          </div>
          <div className='flex justify-center px-5 items-center pt-5 font-medium text-3xl tracking-wide sm:whitespace-nowrap'>
            {userData ? userData.username : ""}
          </div>
          <div className='flex justify-center items-center pt-1 font-medium text-base tracking-wide text-[#868e96] '>
            {userProfileData ? userProfileData.nickname : ""}
          </div>
          <div className=' px-5 text-left pt-2 font-semibold tracking-wide text-[#868e96]  pb-3  mt-6 w-[100%] border-t-[1px] border-b-[1px]'>
            Workload{" "}
            <div className='mt-1'>
              <Progress
                percent={completion}
                status={completion == 100 ? "success" : "active"}
              />
            </div>
          </div>
          <div className='title-description  px-5 py-3'>
            <div className=' font-semibold tracking-wide text-[#868e96] '>
              Discription
            </div>
            <div className='description-detail text-sm tracking-wide mt-2 font-light whitespace-normal'>
              {userProfileData ? userProfileData.description : ""}
            </div>
          </div>
        </div>{" "}
        <div className='card-edit  max-h-850px]   sm:max-w-[2500px] w-[100%] form-user rounded-lg mt-10 '>
          <div className='p-4 border-b-[1px] border-[#e1e5eb] font-medium text-base text-[#3d5170]'>
            Account Details
          </div>
          <div className='p-4'>
            <Form
              {...formItemLayout}
              onFinish={onFinish}
              initialValues={initialValues}
            >
              <div className='flex gap-4 lg:flex-row flex-col  '>
                <div className='w-[100%] lg:ml-[19px] '>
                  <Form.Item
                    label='First name'
                    name='firstname'
                    rules={[
                      {
                        required: true,
                        message: "Please input your first name!",
                      },
                    ]}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) =>
                        handleInputChange(event, "firstname")
                      }
                      placeholder={isSmallScreen ? "First name" : ""}
                    />
                  </Form.Item>
                </div>
                <div className='w-[100%] '>
                  <Form.Item
                    label='Last name'
                    name='lastname'
                    rules={[
                      {
                        required: true,
                        message: "Please input your last name!",
                      },
                    ]}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) => handleInputChange(event, "lastname")}
                      placeholder={isSmallScreen ? "Last name" : ""}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className='flex gap-4 mt-5  lg:flex-row flex-col '>
                <div className='w-[100%]'>
                  <Form.Item
                    label='Email contact'
                    name='emailcontact'
                    rules={[
                      {
                        required: true,
                        message: "Please input your email contact!",
                      },
                    ]}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) =>
                        handleInputChange(event, "emailcontact")
                      }
                      placeholder={isSmallScreen ? "Email contact" : ""}
                    />
                  </Form.Item>
                </div>
                <div className='w-[100%] lg:pl-6'>
                  <Form.Item
                    label='Phone Number'
                    name='phoneNumber'
                    rules={[
                      {
                        required: true,
                        message: "Please enter your phone number",
                      },
                      {
                        pattern: /^[0-9]{10,12}$/,
                        message:
                          "Phone number must be a valid 10-12 digit number",
                      },
                    ]}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) =>
                        handleInputChange(event, "phoneNumber")
                      }
                      placeholder={isSmallScreen ? "Phone Number" : ""}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='flex gap-4  mt-5 lg:flex-row flex-col '>
                <div className='w-[100%] lg:ml-[13px]'>
                  <Form.Item
                    label='Store name'
                    name='storename'
                    rules={[
                      {
                        required: true,
                        message: "Please input your store name!",
                      },
                    ]}
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) =>
                        handleInputChange(event, "storename")
                      }
                      placeholder={isSmallScreen ? "Store name" : ""}
                    />
                  </Form.Item>
                </div>
                <div className='w-[100%]'>
                  <Form.Item
                    label='Nick name'
                    name='nickname'
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) => handleInputChange(event, "nickname")}
                      placeholder={isSmallScreen ? "Nick name" : ""}
                    />
                  </Form.Item>
                </div>
              </div>

              <div className='w-[100%] mt-5 lg:ml-[43px]'>
                <Form.Item
                  label='Address'
                  name='address'
                  labelCol={{ span: 0 }}
                  wrapperCol={{
                    xs: { span: 24 },
                    sm: { span: 24 },
                    md: { span: 24 },
                    lg: { span: 18 },
                    xl: { span: 18 },
                    xxl: { span: 18 },
                  }}
                  className='form-item'
                >
                  <Input
                    onChange={(event) => handleInputChange(event, "address")}
                    placeholder={isSmallScreen ? "Address" : ""}
                  />
                </Form.Item>
              </div>
              <div className='flex lg:flex-row flex-col gap-4 mt-5'>
                <div className='lg:w-[50%]  lg:ml-[69px]'>
                  <Form.Item
                    label='City'
                    name='city'
                    labelCol={{ span: 0 }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 24 },
                      md: { span: 24 },
                      lg: { span: 24 },
                      xl: { span: 20 },
                      xxl: { span: 20 },
                    }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) => handleInputChange(event, "city")}
                      placeholder={isSmallScreen ? "City" : ""}
                    />
                  </Form.Item>
                </div>
                <div className='lg:w-[30%]'>
                  <Form.Item
                    label='State'
                    name='state'
                    labelCol={{ span: 0 }}
                    wrapperCol={{ span: 24 }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) => handleInputChange(event, "state")}
                      placeholder={isSmallScreen ? "State" : ""}
                    />
                  </Form.Item>
                </div>
                <div className='lg:w-[18%] '>
                  <Form.Item
                    label='Zipcode'
                    name='zipcode'
                    labelCol={{ span: 0 }}
                    wrapperCol={{
                      xs: { span: 24 },
                      sm: { span: 24 },
                      md: { span: 24 },
                      lg: { span: 24 },
                      xl: { span: 12 },
                      xxl: { span: 12 },
                    }}
                    className='form-item'
                  >
                    <Input
                      onChange={(event) => handleInputChange(event, "zipcode")}
                      placeholder={isSmallScreen ? "Zipcode" : ""}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className='w-[100%] mt-5 lg:ml-[23px]'>
                <Form.Item
                  label='Description'
                  name='description'
                  labelCol={{ span: 0 }}
                  className='form-item'
                  wrapperCol={{
                    xs: { span: 22 },
                    sm: { span: 22 },
                    md: { span: 22 },
                    lg: { span: 19 },
                    xl: { span: 18 },
                    xxl: { span: 18 },
                  }}
                >
                  <TextArea
                    onChange={(event) =>
                      handleInputChange(event, "description")
                    }
                    rows={5}
                    placeholder={isSmallScreen ? "Description" : ""}
                  />
                </Form.Item>
              </div>
              <div className='pt-2'>
                <Form.Item wrapperCol={{ offset: 3, span: 16 }}>
                  <Button
                    type='primary'
                    htmlType='submit'
                    className='btn-submit-update'
                  >
                    Update
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
