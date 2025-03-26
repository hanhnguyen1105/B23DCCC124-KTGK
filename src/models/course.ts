import { useState, useCallback } from 'react';
import { message } from 'antd';

export enum CourseStatus {
  OPEN = 'OPEN',
  CLOSED = 'CLOSED',
  PAUSED = 'PAUSED',
}

export interface Course {
  id: string;
  tenKhoaHoc: string;
  giangVien: string;
  moTa: string;
  soHocVien: number;
  trangThai: CourseStatus;
}

export type CourseFormData = Omit<Course, 'id' | 'soHocVien'>;

export interface CourseModel {
  courses: Course[];
  loading: boolean;
  searchText: string;
  selectedGiangVien: string;
  selectedTrangThai: CourseStatus | null;
  sortBySoHocVien: boolean;

  // Actions
  fetchCourses: () => Promise<void>;
  addCourse: (course: CourseFormData) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setSearchText: (text: string) => void;
  setSelectedGiangVien: (giangVien: string) => void;
  setSelectedTrangThai: (trangThai: CourseStatus | null) => void;
  setSortBySoHocVien: (sort: boolean) => void;
}

const STORAGE_KEY = 'online_courses';

export default function useCourseModel(): CourseModel {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedGiangVien, setSelectedGiangVien] = useState('');
  const [selectedTrangThai, setSelectedTrangThai] = useState<CourseStatus | null>(null);
  const [sortBySoHocVien, setSortBySoHocVien] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const storedCourses = localStorage.getItem(STORAGE_KEY);
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      message.error('Không thể tải danh sách khóa học');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((updatedCourses: Course[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  }, []);

  const addCourse = useCallback(async (courseData: CourseFormData) => {
    try {
      // Kiểm tra tên khóa học trùng
      const isDuplicate = courses.some(
        course => course.tenKhoaHoc.toLowerCase() === courseData.tenKhoaHoc.toLowerCase()
      );
      if (isDuplicate) {
        message.error('Tên khóa học đã tồn tại');
        return;
      }

      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        soHocVien: 0,
      };

      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Thêm khóa học thành công');
    } catch (error) {
      message.error('Không thể thêm khóa học');
    }
  }, [courses, saveToStorage]);

  const updateCourse = useCallback(async (id: string, courseData: Partial<Course>) => {
    try {
      // Kiểm tra tên khóa học trùng (trừ khóa học hiện tại)
      const isDuplicate = courses.some(
        course => 
          course.id !== id && 
          course.tenKhoaHoc.toLowerCase() === courseData.tenKhoaHoc?.toLowerCase()
      );
      if (isDuplicate) {
        message.error('Tên khóa học đã tồn tại');
        return;
      }

      const updatedCourses = courses.map(course =>
        course.id === id ? { ...course, ...courseData } : course
      );
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Cập nhật khóa học thành công');
    } catch (error) {
      message.error('Không thể cập nhật khóa học');
    }
  }, [courses, saveToStorage]);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      const courseToDelete = courses.find(course => course.id === id);
      if (courseToDelete && courseToDelete.soHocVien > 0) {
        message.error('Không thể xóa khóa học đã có học viên');
        return;
      }

      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Xóa khóa học thành công');
    } catch (error) {
      message.error('Không thể xóa khóa học');
    }
  }, [courses, saveToStorage]);

  return {
    courses,
    loading,
    searchText,
    selectedGiangVien,
    selectedTrangThai,
    sortBySoHocVien,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    setSearchText,
    setSelectedGiangVien,
    setSelectedTrangThai,
    setSortBySoHocVien,
  };
} 