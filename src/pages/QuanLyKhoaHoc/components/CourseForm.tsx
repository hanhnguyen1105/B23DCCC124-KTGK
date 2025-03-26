import { Modal, Form, Input, Select } from 'antd';
import { Course } from '@/models/courses';
import { useEffect } from 'react';

const { Option } = Select;

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: Omit<Course, 'id' | 'students'>) => void;
  course?: Course | null;
};

const CourseForm = ({ visible, onCancel, onSave, course }: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (course) {
      form.setFieldsValue(course);
    } else {
      form.resetFields();
    }
  }, [course, visible]);

  return (
    <Modal
      title={course ? 'Chỉnh Sửa Khóa Học' : 'Thêm Khóa Học'}
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      okText={course ? 'Cập Nhật' : 'Thêm'}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical" onFinish={onSave}>
        <Form.Item name="name" label="Tên Khóa Học" rules={[{ required: true, message: 'Vui lòng nhập tên khóa học' }]}>
          <Input maxLength={100} />
        </Form.Item>
        <Form.Item name="instructor" label="Giảng Viên" rules={[{ required: true, message: 'Vui lòng chọn giảng viên' }]}>
          <Select>
            <Option value="GV1">Giảng viên 1</Option>
            <Option value="GV2">Giảng viên 2</Option>
          </Select>
        </Form.Item>
        <Form.Item name="status" label="Trạng Thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}>
          <Select>
            <Option value="Đang mở">Đang mở</Option>
            <Option value="Đã kết thúc">Đã kết thúc</Option>
            <Option value="Tạm dừng">Tạm dừng</Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;
