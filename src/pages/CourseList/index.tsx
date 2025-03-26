import { Button, Card, Col, Form, Input, Modal, Row, Select, Space, Table, Tag, Typography, message } from 'antd';
import { useEffect, useState } from 'react';
import { Course, CourseFormData } from '@/models/course';
import { courseService } from '@/services/courseService';
import CourseForm from '@/components/CourseForm';

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
  const [selectedField, setSelectedField] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Course>('tenKhoaHoc');
  const [sortOrder, setSortOrder] = useState<'ascend' | 'descend'>('ascend');

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    setLoading(true);
    try {
      const data = courseService.getAllCourses();
      setCourses(data);
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
      await courseService.deleteCourse(id);
      message.success('Xóa khóa học thành công');
      loadCourses();
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
    setSelectedField(values.field || '');
  };

  const handleTableChange = (pagination: any, filters: any, sorter: any) => {
    setSortField(sorter.field as keyof Course);
    setSortOrder(sorter.order as 'ascend' | 'descend');
  };

  const columns = [
    {
      title: 'Tên khóa học',
      dataIndex: 'tenKhoaHoc',
      key: 'tenKhoaHoc',
      sorter: true,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'giangVien',
      key: 'giangVien',
    },
    {
      title: 'Lĩnh vực',
      dataIndex: 'linhVuc',
      key: 'linhVuc',
      render: (linhVuc: string) => (
        <Tag color={linhVuc === 'frontend' ? 'blue' : linhVuc === 'backend' ? 'green' : 'purple'}>
          {linhVuc === 'frontend' ? 'Frontend' : linhVuc === 'backend' ? 'Backend' : 'Mobile'}
        </Tag>
      ),
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
      render: (trangThai: string) => (
        <Tag color={trangThai === 'active' ? 'green' : 'red'}>
          {trangThai === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
        </Tag>
      ),
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
      if (!searchText) return true;
      if (selectedField && course.linhVuc !== selectedField) return false;
      return course.tenKhoaHoc.toLowerCase().includes(searchText.toLowerCase()) ||
             course.giangVien.toLowerCase().includes(searchText.toLowerCase());
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (sortOrder === 'ascend') {
        return aValue > bValue ? 1 : -1;
      }
      return aValue < bValue ? 1 : -1;
    });

  return (
    <div className="p-6">
      <Row justify="space-between" align="middle" className="mb-6">
        <Col>
          <Title level={2}>Quản lý khóa học</Title>
        </Col>
        <Col>
          <Button type="primary" onClick={handleAdd}>
            Thêm khóa học
          </Button>
        </Col>
      </Row>

      <Card className="mb-6">
        <Form form={searchForm} onFinish={handleSearch} layout="inline">
          <Form.Item name="searchText">
            <Input placeholder="Tìm kiếm khóa học..." style={{ width: 200 }} />
          </Form.Item>
          <Form.Item name="field">
            <Select placeholder="Chọn lĩnh vực" style={{ width: 150 }} allowClear>
              <Option value="frontend">Frontend</Option>
              <Option value="backend">Backend</Option>
              <Option value="mobile">Mobile</Option>
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

      <Modal
        title={editingCourse ? 'Sửa khóa học' : 'Thêm khóa học'}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <CourseForm form={form} />
      </Modal>
    </div>
  );
};

export default CourseList; 