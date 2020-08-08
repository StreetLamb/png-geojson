import { Upload, message, Form, Input, Button, Space, InputNumber } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import styles from "../styles/Form.module.css";
import { useState } from "react";

const { Dragger } = Upload;

export default function UploadForm({ onSubmitForm, loading }) {
  const [uploadList, setUploadList] = useState([]);

  //   const props = {
  //     accept: ".png",
  //     name: "upload",
  //     multiple: false,
  //     action: "http://localhost:3001/api/uploadfile", //uploading url
  //     onChange(info) {
  //       let fileList = [...info.fileList];
  //       fileList = fileList.slice(-1);
  //       fileList = fileList.map((file) => {
  //         if (file.response) {
  //           // Component will show file.url as link
  //           file.url = file.response.url;
  //         }
  //         return file;
  //       });
  //       setUploadList(fileList);
  //       console.log(info);
  //       const { status } = info.file;

  //       if (status === "done") {
  //         // console.log(info.file, info.fileList);
  //         message.success(`${info.file.name} file uploaded successfully.`);
  //       } else if (status === "error") {
  //         message.error(`${info.file.name} file upload failed.`);
  //       }
  //     },
  //   };

  const props = {
    accept: ".png",
    name: "upload",
    multiple: false,
    onRemove: (file) => {
      setUploadList([]);
    },
    beforeUpload: (file) => {
      let fileList = [];
      fileList.push(file);
      setUploadList(fileList);
      return false;
    },
  };

  const handleSubmit = (v) => {
    const formData = new FormData();
    uploadList.forEach((file) => {
      formData.append("upload", file);
    });
    onSubmitForm({ ...v, formData });
  };

  return (
    <div className={styles.container}>
      <Form
        className={styles.form}
        onFinish={
          (v) => handleSubmit(v)
          //   onSubmitForm({
          //     ...v,
          //     name: uploadList[0].response.filename,
          //   })
        }
      >
        <Form.Item name="upload" rules={[{ required: true }]}>
          <Dragger
            className={styles.dragger}
            {...props}
            fileList={uploadList}
            layout="vertical"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">
              Click or drag heatmap image to this area to upload
            </p>
            <p className="ant-upload-hint">
              Image must be: <br />
              &lt; 2mb <br />
              &lt; 0.36MP
            </p>
          </Dragger>
        </Form.Item>
        <h2>Bottom left:</h2>
        <Space className={styles.inputContainer} size={"large"}>
          <Form.Item name="lLat" label="Latitiude" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="lLong"
            label="Longitude"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Space>
        <h2>Top right:</h2>
        <Space className={styles.inputContainer} size={"large"}>
          <Form.Item name="uLat" label="Latitiude" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="uLong"
            label="Longitude"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Space>
        <Form.Item className={styles.button}>
          <Button
            type="primary"
            htmlType="submit"
            size={"large"}
            loading={loading}
            disabled={uploadList.length === 0}
          >
            {loading ? "Processing..." : "Submit"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
