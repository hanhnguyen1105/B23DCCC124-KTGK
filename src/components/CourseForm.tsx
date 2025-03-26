import React from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import { Course, CourseStatus } from '@/models/course';
import { courseService } from '@/services/courseService';

const { TextArea } = Input;
const { Option } = Select;

interface CourseFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Course, 'id' | 'studentCount'>) => void;
  initialValues?: Partial<Course>;
  form: any;
}

const CourseForm: React.FC<CourseFormProps> = ({
  visible,
  onCancel,
  onSubmit,
  initialValues,
  form,
}) => {
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      onSubmit(values);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  return (
    <Modal
      title={initialValues ? 'Chỉnh sửa khóa học' : 'Thêm khóa học mới'}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          Hủy
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          {initialValues ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
      >
        <Form.Item
          name="tenKhoaHoc"
          label="Tên khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập tên khóa học!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="giangVien"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng nhập tên giảng viên!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="linhVuc"
          label="Lĩnh vực"
          rules={[{ required: true, message: 'Vui lòng chọn lĩnh vực!' }]}
        >
          <Select>
            <Select.Option value="frontend">Frontend</Select.Option>
            <Select.Option value="backend">Backend</Select.Option>
            <Select.Option value="mobile">Mobile</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="soHocVien"
          label="Số học viên"
          rules={[{ required: true, message: 'Vui lòng nhập số học viên!' }]}
        >
          <Input type="number" min={0} />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select>
            <Select.Option value="active">Đang hoạt động</Select.Option>
            <Select.Option value="inactive">Tạm dừng</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm; 