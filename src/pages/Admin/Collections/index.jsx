import { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Input,
  Button,
  Form,
  Upload,
  message,
  Image,
  notification,
  Spin,
  Pagination,
} from "antd";

import {
  EditOutlined,
  SearchOutlined,
  PlusOutlined,
  LoadingOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import "./Collections.scss";
import { useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import { FetchApi } from "../../../api/FetchAPI";

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

const Collections = () => {
  const [loading, setLoading] = useState(true);
  const [loadingImage1, setLoadingImage1] = useState(false);
  const [loadingImage2, setLoadingImage2] = useState(false);
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [imageUrl1, setImageUrl1] = useState();
  const [imageUrl2, setImageUrl2] = useState();
  const [imageUrl3, setImageUrl3] = useState();
  const [imageUrl4, setImageUrl4] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const store_name = localStorage.getItem("store_name");
  const [isDeleteButtonEnabled, setIsDeleteButtonEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [data, setData] = useState([]);
  const [dataProduct, setDataProduct] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [current, setCurrent] = useState(1);
  const page = 1;
  const navigate = useNavigate();
  const [dataCreate, setDataCreate] = useState("");
  const [dataEdit, setDataEdit] = useState("");
  const [isModalCreateOpen, setIsModalCreateOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [productId, setProductId] = useState();
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  useEffect(() => {
    setFilteredPosts(data.data);
  }, [data]);

  useEffect(() => {
    if ((store_name, page)) {
      getProducts(store_name, page);
    }
  }, []);

  const getProducts = async (store_name, page) => {
    setCurrent(page);
    if ((store_name, page)) {
      const result = await FetchApi.getProducts(store_name, page);
      if (result) {
        setData(result);
        setTotalPages(result?.totalPages * 10);
        setLoading(false);
        if (result.statusCode === 401) {
          navigate("/auth/login");
        }
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };
  const deleteProducts = async (product_ids) => {
    if (product_ids) {
      const result = await FetchApi.deleteProducts(product_ids);
      if (result) {
        notification.success({
          message: "Deleted successfully!!!",
          placement: "topRight",
        });
        setSelectedRowKeys([]);
        getProducts(store_name, page);
        if (result.statusCode === 401) {
          navigate("/auth/login");
        }
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };
  const getProduct = async (product_id) => {
    form2.resetFields();
    if (product_id) {
      const result = await FetchApi.getProduct(product_id);
      setDataProduct(result);
      form2.setFieldsValue({
        name: result.name,
        description: result.description,
        image_product1: result.image_product1,
        image_product2: result.image_product2,
        priceMain: result.price_main,
        priceSale: result.price_sale,
      });
      setImageUrl3(result.image_product1);
      setImageUrl4(result.image_product2);

      setIsModalEditOpen(true);
      if (result.statusCode === 401) {
        navigate("/auth/login");
      }
    } else {
      notification.error({
        message: "Error fetching data",
        placement: "topRight",
      });
    }
  };

  const resetForm = () => {
    setImageUrl1("");
    setImageUrl2("");
    form1.resetFields();
    getProducts(store_name, page);
  };
  const resetForm2 = () => {
    setImageUrl3("");
    setImageUrl4("");
    form2.resetFields();
    getProducts(store_name, page);
  };

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

  useEffect(() => {
    const createProduct = async (dataCreate) => {
      if (dataCreate) {
        setLoadingBtn(true);
        const result = await FetchApi.createProduct(dataCreate);
        if (result) {
          notification.success({
            message: "Created successfully!!!",
            placement: "topRight",
          });
        }
        setLoadingBtn(false);
        setIsModalCreateOpen(false);
        resetForm();
        if (result.statusCode === 401) {
          navigate("/auth/login");
        }
      } else {
        setLoadingBtn(false);
        notification.error({
          message: "Created failure!!!",
          placement: "topRight",
        });
      }
    };

    if (dataCreate) {
      createProduct(dataCreate);
    }
  }, [dataCreate, isSubmitting]);

  useEffect(() => {
    const editProduct = async (dataEdit, productId) => {
      if ((dataEdit, productId)) {
        setLoadingBtn(true);
        const result = await FetchApi.editProduct(dataEdit, productId);
        if (result) {
          notification.success({
            message: "Edited successfully!!!",
            placement: "topRight",
          });
          setLoadingBtn(false);
          setIsModalEditOpen(false);
          resetForm2();
          getProducts(store_name, page);
          if (result.statusCode === 401) {
            navigate("/auth/login");
          }
        } else {
          setLoadingBtn(false);
          notification.error({
            message: "Edited failure!!!",
            placement: "topRight",
          });
        }
      }
    };

    if ((dataEdit, productId)) {
      editProduct(dataEdit, productId);
    }
  }, [dataEdit, isSubmitting]);

  const onFinishCreate = (values) => {
    const createValues = {
      ...values,
      store_name: store_name,
      imageUrl1: imageUrl1,
      imageUrl2: imageUrl2,
    };
    setIsSubmitting(true);
    setDataCreate(createValues);
  };
  const onFinishEdit = (values) => {
    const editValues = {
      ...values,
      store_name: store_name,
      imageUrl1: imageUrl3,
      imageUrl2: imageUrl4,
    };
    setIsSubmitting(true);
    setDataEdit(editValues);
  };

  const handleFilterChange = (event) => {
    const value = event.target.value.toLowerCase();
    setFilterText(value);
    if (value === "") {
      setFilteredPosts(data.data);
    } else {
      setFilteredPosts(
        data.data.filter((item) =>
          item.product.name.toLowerCase().includes(value)
        )
      );
    }
  };

  const showModalEdit = (product_id) => {
    form2.setFieldsValue({
      name: undefined,
      description: undefined,
      image_product1: undefined,
      image_product2: undefined,
      price_main: undefined,
      price_sale: undefined,
    });
    setProductId(product_id);
    getProduct(product_id);
  };

  const handleChangeimage1 = (info) => {
    if (info.file.status === "uploading") {
      setLoadingImage1(true);
      return;
    }
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl = reader.result;
        setImageUrl1(imageUrl);
        setLoadingImage1(false);

        reader.readAsDataURL(info.file.originFileObj);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error("File upload failed.");
    }
  };
  const handleChangeimage2 = (info) => {
    if (info.file.status === "uploading") {
      setLoadingImage2(true);
      return;
    }
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl2 = reader.result;
        setImageUrl2(imageUrl2);
        setLoadingImage2(false);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error("File upload failed.");
    }
  };
  const handleChangeimage3 = (info) => {
    if (info.file.status === "uploading") {
      setLoadingImage2(true);
      return;
    }
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl3 = reader.result;
        setImageUrl3(imageUrl3);
        setLoadingImage2(false);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error("File upload failed.");
    }
  };
  const handleChangeimage4 = (info) => {
    if (info.file.status === "uploading") {
      setLoadingImage2(true);
      return;
    }
    if (info.file.status === "done") {
      const reader = new FileReader();
      reader.onload = () => {
        const imageUrl4 = reader.result;
        setImageUrl4(imageUrl4);
        setLoadingImage2(false);
      };
      reader.readAsDataURL(info.file.originFileObj);
    } else if (info.file.status === "error") {
      message.error("File upload failed.");
    }
  };
  const uploadButton1 = (
    <div>
      <div className='ml-4'>
        {" "}
        {loadingImage1 ? <LoadingOutlined /> : <PlusOutlined />}
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
  const uploadButton2 = (
    <div>
      <div className='ml-4'>
        {" "}
        {loadingImage2 ? <LoadingOutlined /> : <PlusOutlined />}
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

  const columns = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "4%",

      className: "column-id",
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Name",
      dataIndex: ["product", "name"],
      key: "name",
      width: "15%",
      className: "column-name",
      sorter: (a, b) => a.name.localeCompare(b.name),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Image 1",
      dataIndex: ["product", "image_product1"],
      key: "imageUrl1",
      width: "8%",
      className: "column-imageUrl1",
      render: (imageUrl) => (
        <Image
          maxwidth={100}
          maxheight={100}
          src={imageUrl}
          alt='product image 1'
        />
      ),
    },
    {
      title: "Image 2",
      dataIndex: ["product", "image_product2"],
      key: "imageUrl2",
      width: "8%",
      className: "column-imageUrl2",
      render: (imageUrl) => (
        <Image
          maxwidth={100}
          maxheight={100}
          src={imageUrl}
          alt='product image 2'
        />
      ),
    },
    {
      title: "Description",
      dataIndex: ["product", "description"],
      key: "description",
      className: "column-description",
      sorter: (a, b) => a.description.length - b.description.length,
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Price Main ",
      dataIndex: ["product", "price_main"],
      key: "priceMain",
      width: "8%",
      className: "column-priceMain",
      render: (text) => `$${text}`,
      sorter: (a, b) =>
        parseFloat(a.priceMain.slice(1)) - parseFloat(b.priceMain.slice(1)),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Price Sale",
      dataIndex: ["product", "price_sale"],
      key: "priceSale",
      width: "7%",
      className: "column-priceSale",
      render: (text) => `$${text}`,
      sorter: (a, b) =>
        parseFloat(a.priceSale.slice(1)) - parseFloat(b.priceSale.slice(1)),
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Created Date",
      dataIndex: ["product", "created_at"],
      key: "createdDate",
      width: "8%",
      className: "column-createdDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => {
        const dateA = new Date(a.created_at).toLocaleDateString();
        const dateB = new Date(b.created_at).toLocaleDateString();

        if (dateA < dateB) {
          return -1;
        }
        if (dateA > dateB) {
          return 1;
        }
        return 0;
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Action",
      key: "action",
      width: "5%",
      className: "column-action",
      render: (text, record) => (
        <EditOutlined
          onClick={() => showModalEdit(record.product.product_id)}
        />
      ),
    },
  ];
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);

    const selectedProductIds = newSelectedRowKeys.map((selectedRowKey) => {
      const selectedProduct = filteredPosts.find(
        (product) => product.id === selectedRowKey
      );
      return selectedProduct ? selectedProduct.product.product_id : null;
    });

    setSelectedProductIds(selectedProductIds);

    if (newSelectedRowKeys.length === 0) {
      setIsDeleteButtonEnabled(false);
    } else {
      setIsDeleteButtonEnabled(true);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changeableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changeableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };
  const handleNewProduct = () => {
    setIsModalCreateOpen(true);
  };
  const handleClosemodalEdit = () => {
    setIsModalEditOpen(false);
  };
  const handleDeleteProduct = () => {
    const payload = { product_ids: selectedProductIds };
    deleteProducts(payload);
  };
  const antIcon = (
    <LoadingOutlined
      style={{
        fontSize: 24,
      }}
      spin
    />
  );

  return loading ? (
    <Spin className='loading' indicator={antIcon} />
  ) : (
    <div>
      <div className='mt-20 flex gap-10 flex-wrap justify-between'>
        {" "}
        <Input
          className='max-w-[200px] h-[40px] text-base'
          placeholder='Filter by name'
          value={filterText}
          onChange={handleFilterChange}
          prefix={<SearchOutlined className='icon-search' />}
        />
        <div className='flex justify-center items-center gap-20 flex-wrap'>
          <Button
            className={`btn-delete ${isDeleteButtonEnabled ? "" : "disabled"}`}
            onClick={handleDeleteProduct}
            disabled={!isDeleteButtonEnabled}
            icon={<DeleteOutlined className='icon-delete' />}
          ></Button>

          <Button
            type='primary'
            className=' btn-create-product h-[40px] text-base'
            icon={<PlusOutlined className='mt-[-10px]' />}
            onClick={handleNewProduct}
          >
            <span className='mt-[0px]'> Create new product</span>
          </Button>
        </div>
      </div>
      <div className='mt-10'>
        <Table
          className='table-collection'
          rowSelection={{
            ...rowSelection,
          }}
          columns={columns}
          dataSource={filteredPosts}
          pagination={false}
          scroll={{ y: 650 }}
          rowKey='id'
        />

        <Pagination
          style={{ textAlign: "center", marginTop: "16px" }}
          total={totalPages}
          current={current}
          onChange={(page) => getProducts(store_name, page)}
        />
      </div>
      <div>
        <Modal
          title='Create Product'
          visible={isModalCreateOpen}
          onCancel={() => setIsModalCreateOpen(false)}
          footer={null}
          centered={true}
          maskClosable={false}
        >
          <Form form={form1} name='createProductForm' onFinish={onFinishCreate}>
            <Form.Item
              label='Name product'
              name='name'
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
              className='form-item'
            >
              <Input placeholder={isSmallScreen ? "Name product" : ""} />
            </Form.Item>
            <div className='flex gap-10 flex-wrap'>
              <Form.Item
                label='Image product'
                name='image'
                rules={[
                  {
                    required: true,
                    message: "Please upload product photos!",
                  },
                ]}
                className='form-item'
              >
                <div className='flex gap-10 flex-wrap'>
                  <Upload
                    name='image_product1'
                    listType='picture'
                    className='imageproduct-uploader'
                    showUploadList={false}
                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                    beforeUpload={beforeUpload}
                    onChange={handleChangeimage1}
                  >
                    {imageUrl1 ? (
                      <img src={imageUrl1} alt='image product' />
                    ) : (
                      uploadButton1
                    )}
                  </Upload>
                </div>
              </Form.Item>
              <Form.Item
                label=''
                name='image'
                rules={[
                  {
                    required: true,
                    message: "Please upload product photos!",
                  },
                ]}
                className='form-item'
              >
                <div className='flex gap-10 flex-wrap'>
                  <Upload
                    name='image_product2'
                    listType='picture'
                    className='imageproduct-uploader'
                    showUploadList={false}
                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                    beforeUpload={beforeUpload}
                    onChange={handleChangeimage2}
                  >
                    {imageUrl2 ? (
                      <img src={imageUrl2} alt='image product' />
                    ) : (
                      uploadButton2
                    )}
                  </Upload>
                </div>
              </Form.Item>
            </div>
            <Form.Item
              label='Description'
              name='description'
              className='form-item'
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder={isSmallScreen ? "Password" : ""}
              />
            </Form.Item>
            <div className='flex flex-wrap gap-12'>
              <Form.Item
                label='Price main ($)'
                name='priceMain'
                className='form-item'
                rules={[
                  {
                    required: true,
                    message: "Please input your price main!",
                  },
                ]}
              >
                <Input
                  placeholder={isSmallScreen ? "Password" : ""}
                  style={{ width: "120px" }}
                  type='number'
                />
              </Form.Item>
              <Form.Item
                label='Price sale  ($)'
                name='priceSale'
                className='form-item'
                rules={[
                  {
                    required: true,
                    message: "Please input your price sale!",
                  },
                ]}
              >
                <Input
                  placeholder={isSmallScreen ? "Password" : ""}
                  style={{ width: "120px" }}
                  type='number'
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                loading={loadingBtn}
                className='float-right'
                type='primary'
                htmlType='submit'
              >
                Save create
              </Button>
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title='Edit Product'
          visible={isModalEditOpen}
          onCancel={handleClosemodalEdit}
          footer={null}
          centered={true}
          maskClosable={false}
        >
          <Form
            form={form2}
            name='editProductForm'
            initialValues={dataProduct}
            onFinish={onFinishEdit}
          >
            <Form.Item
              label='Name product'
              name='name'
              rules={[
                {
                  required: true,
                  message: "Please input your name!",
                },
              ]}
              className='form-item'
            >
              <Input placeholder={isSmallScreen ? "Name product" : ""} />
            </Form.Item>
            <div className='flex gap-10 flex-wrap'>
              <Form.Item
                label='Image product'
                name='image_product1'
                rules={[
                  {
                    required: true,
                    message: "Please upload product photos!",
                  },
                ]}
                className='form-item'
              >
                <div className='flex gap-10 flex-wrap'>
                  <Upload
                    name='image_product1'
                    listType='picture'
                    className='imageproduct-uploader'
                    showUploadList={false}
                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                    beforeUpload={beforeUpload}
                    onChange={handleChangeimage3}
                  >
                    {imageUrl3 ? (
                      <img src={imageUrl3} alt='image product' />
                    ) : (
                      uploadButton1
                    )}
                  </Upload>
                </div>
              </Form.Item>
              <Form.Item
                label=''
                name='image_product2'
                rules={[
                  {
                    required: true,
                    message: "Please upload product photos!",
                  },
                ]}
                className='form-item'
              >
                <div className='flex gap-10 flex-wrap'>
                  <Upload
                    name='image_product2'
                    listType='picture'
                    className='imageproduct-uploader'
                    showUploadList={false}
                    action='https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188'
                    beforeUpload={beforeUpload}
                    onChange={handleChangeimage4}
                  >
                    {imageUrl4 ? (
                      <img src={imageUrl4} alt='image product' />
                    ) : (
                      uploadButton2
                    )}
                  </Upload>
                </div>
              </Form.Item>
            </div>
            <Form.Item
              label='Description'
              name='description'
              className='form-item'
              rules={[
                {
                  required: true,
                  message: "Please input your description!",
                },
              ]}
            >
              <TextArea
                rows={4}
                placeholder={isSmallScreen ? "Password" : ""}
              />
            </Form.Item>
            <div className='flex flex-wrap gap-12'>
              <Form.Item
                label='Price main  ($)'
                name='priceMain'
                className='form-item'
                rules={[
                  {
                    required: true,
                    message: "Please input your price main!",
                  },
                ]}
              >
                <Input
                  placeholder={isSmallScreen ? "Password" : ""}
                  style={{ width: "120px" }}
                  type='number'
                />
              </Form.Item>
              <Form.Item
                label='Price sale  ($)'
                name='priceSale'
                className='form-item'
                rules={[
                  {
                    required: true,
                    message: "Please input your price sale!",
                  },
                ]}
              >
                <Input
                  placeholder={isSmallScreen ? "Password" : ""}
                  style={{ width: "120px" }}
                  type='number'
                />
              </Form.Item>
            </div>
            <Form.Item>
              <Button
                loading={loadingBtn}
                className='float-right'
                type='primary'
                htmlType='submit'
              >
                Save changes
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
  );
};
export default Collections;
