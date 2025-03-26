import React from 'react';
import { Form, Input, Select, Button, Modal } from 'antd';
import { Course, CourseStatus } from '@/models/course';
import { courseService } from '@/services/courseService';

const { TextArea } = Input;
const { Option } = Select;

interface CourseFormProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: Omit<Course, 'id' | 'soHocVien'>) => void;
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
          rules={[
            { required: true, message: 'Vui lòng nhập tên khóa học!' },
            { max: 100, message: 'Tên khóa học không được vượt quá 100 ký tự' },
            {
              validator: async (_, value) => {
                if (value && courseService.isDuplicateTenKhoaHoc(value, initialValues?.id)) {
                  throw new Error('Tên khóa học đã tồn tại');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="giangVien"
          label="Giảng viên"
          rules={[{ required: true, message: 'Vui lòng chọn giảng viên!' }]}
        >
          <Select placeholder="Chọn giảng viên">
            {courseService.getGiangVienList().map(giangVien => (
              <Option key={giangVien} value={giangVien}>
                {giangVien}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="moTa"
          label="Mô tả khóa học"
          rules={[{ required: true, message: 'Vui lòng nhập mô tả khóa học!' }]}
        >
          <TextArea rows={4} placeholder="Nhập mô tả khóa học" />
        </Form.Item>

        <Form.Item
          name="trangThai"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái!' }]}
        >
          <Select placeholder="Chọn trạng thái">
            <Option value={CourseStatus.OPEN}>Đang mở</Option>
            <Option value={CourseStatus.CLOSED}>Đã kết thúc</Option>
            <Option value={CourseStatus.PAUSED}>Tạm dừng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm; 