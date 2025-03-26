import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { Course, CourseStatus } from '@/models/course';
import { courseService } from '@/services/courseService';
import CourseForm from '@/components/CourseForm';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Option } = Select;

const CourseList: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [searchForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [selectedGiangVien, setSelectedGiangVien] = useState<string>('');
  const [selectedTrangThai, setSelectedTrangThai] = useState<CourseStatus | null>(null);
  const [sortBySoHocVien, setSortBySoHocVien] = useState(false);
  const [giangVienList, setGiangVienList] = useState<string[]>([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    try {
      const data = courseService.getAllCourses();
      setCourses(data);
      setGiangVienList(courseService.getGiangVienList());
    } catch (error) {
      message.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCourse(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: Course) => {
    setEditingCourse(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const course = courses.find(c => c.id === id);
      if (course && course.soHocVien > 0) {
        message.error('Không thể xóa khóa học đã có học viên');
        return;
      }

      Modal.confirm({
        title: 'Xác nhận xóa',
        content: 'Bạn có chắc chắn muốn xóa khóa học này?',
        okText: 'Xóa',
        cancelText: 'Hủy',
        onOk: async () => {
          await courseService.deleteCourse(id);
          message.success('Xóa khóa học thành công');
          loadCourses();
        },
      });
    } catch (error) {
      message.error('Không thể xóa khóa học');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCourse) {
        await courseService.updateCourse(editingCourse.id, values);
        message.success('Cập nhật khóa học thành công');
      } else {
        await courseService.createCourse(values);
        message.success('Thêm khóa học thành công');
      }
      setIsModalVisible(false);
      loadCourses();
    } catch (error) {
      message.error('Không thể lưu khóa học');
    }
  };

  const handleSearch = (values: any) => {
    setSearchText(values.searchText || '');
    setSelectedGiangVien(values.giangVien || '');
    setSelectedTrangThai(values.trangThai || null);
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    if (sorter.field === 'soHocVien') {
      setSortBySoHocVien(sorter.order === 'ascend');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
    },
    {
      title: 'Số học viên',
      dataIndex: 'soHocVien',
      key: 'soHocVien',
      sorter: true,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'trangThai',
      key: 'trangThai',
      render: (trangThai: CourseStatus) => {
        const statusMap = {
          [CourseStatus.OPEN]: { color: 'green', text: 'Đang mở' },
          [CourseStatus.CLOSED]: { color: 'red', text: 'Đã kết thúc' },
          [CourseStatus.PAUSED]: { color: 'orange', text: 'Tạm dừng' },
        };
        const status = statusMap[trangThai];
        return <Tag color={status.color}>{status.text}</Tag>;
      },
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Course) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)}>
            Sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  const filteredCourses = courses
    .filter(course => {
      if (!searchText && !selectedGiangVien && !selectedTrangThai) return true;
      
      const matchSearch = !searchText || 
        course.tenKhoaHoc.toLowerCase().includes(searchText.toLowerCase());
      const matchGiangVien = !selectedGiangVien || 
        course.giangVien === selectedGiangVien;
      const matchTrangThai = !selectedTrangThai || 
        course.trangThai === selectedTrangThai;

      return matchSearch && matchGiangVien && matchTrangThai;
    })
    .sort((a, b) => {
      if (!sortBySoHocVien) return 0;
      return a.soHocVien - b.soHocVien;
    });

  return (
    <div className="p-6">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <Title level={2}>Quản lý khóa học</Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm khóa học
          </Button>
        </Col>
      </Row>

      <Card className="mb-6">
        <Form form={searchForm} onFinish={handleSearch} layout="inline">
          <Form.Item name="searchText">
            <Input placeholder="Tìm kiếm theo tên khóa học..." style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="giangVien">
            <Select placeholder="Chọn giảng viên" style={{ width: 200 }} allowClear>
              {giangVienList.map(giangVien => (
                <Option key={giangVien} value={giangVien}>
                  {giangVien}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="trangThai">
            <Select placeholder="Chọn trạng thái" style={{ width: 150 }} allowClear>
              <Option value={CourseStatus.OPEN}>Đang mở</Option>
              <Option value={CourseStatus.CLOSED}>Đã kết thúc</Option>
              <Option value={CourseStatus.PAUSED}>Tạm dừng</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Table
        columns={columns}
        dataSource={filteredCourses}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
      />

      <CourseForm
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onSubmit={handleModalOk}
        initialValues={editingCourse || undefined}
        form={form}
      />
    </div>
  );
};

export default CourseList; 