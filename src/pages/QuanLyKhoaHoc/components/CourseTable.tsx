import { Table, Button, Modal, message, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Course } from '@/models/courses';
import { saveCourses } from '@/services/courseService';

type Props = {
  courses: Course[];
  setCourses: (courses: Course[]) => void;
  onEdit: (course: Course) => void;
};

const statusColors = {
  'Đang mở': 'green',
  'Đã kết thúc': 'red',
  'Tạm dừng': 'orange'
};

const CourseTable = ({ courses, setCourses, onEdit }: Props) => {
  const handleDelete = (id: string) => {
    const course = courses.find((c) => c.id === id);
    if (course?.students && course.students > 0) {
      message.error('Không thể xóa khóa học đã có học viên!');
      return;
    }

    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xóa?',
      onOk: () => {
        const updatedCourses = courses.filter((c) => c.id !== id);
        saveCourses(updatedCourses);
        setCourses(updatedCourses);
        message.success('Xóa khóa học thành công!');
      }
    });
  };

  return (
    <Table
      dataSource={courses}
      rowKey="id"
      columns={[
        { title: 'Tên Khóa Học', dataIndex: 'name', key: 'name' },
        { title: 'Giảng Viên', dataIndex: 'instructor', key: 'instructor' },
        { title: 'Học Viên', dataIndex: 'students', key: 'students', sorter: (a, b) => a.students - b.students },
        {
          title: 'Trạng Thái',
          dataIndex: 'status',
          key: 'status',
          render: (status) => <Tag color={statusColors[status]}>{status}</Tag>
        },
        {
          title: 'Hành Động',
          key: 'action',
          render: (_, record) => (
            <>
              <Button type="link" icon={<EditOutlined />} onClick={() => onEdit(record)}>Sửa</Button>
              <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record.id)}>Xóa</Button>
            </>
          )
        }
      ]}
    />
  );
};

export default CourseTable;
