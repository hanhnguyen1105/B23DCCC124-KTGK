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
  linhVuc: string;
  soHocVien: number;
  trangThai: string;
}

export type CourseFormData = Omit<Course, 'id'>;

export interface CourseModel {
  courses: Course[];
  loading: boolean;
  searchText: string;
  selectedInstructor: string;
  selectedStatus: CourseStatus | null;
  sortByStudents: boolean;

  // Actions
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id' | 'studentCount'>) => Promise<void>;
  updateCourse: (id: string, course: Partial<Course>) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  setSearchText: (text: string) => void;
  setSelectedInstructor: (instructor: string) => void;
  setSelectedStatus: (status: CourseStatus | null) => void;
  setSortByStudents: (sort: boolean) => void;
}

const STORAGE_KEY = 'online_courses';

export default function useCourseModel(): CourseModel {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [selectedInstructor, setSelectedInstructor] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<CourseStatus | null>(null);
  const [sortByStudents, setSortByStudents] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const storedCourses = localStorage.getItem(STORAGE_KEY);
      if (storedCourses) {
        setCourses(JSON.parse(storedCourses));
      }
    } catch (error) {
      message.error('Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveToStorage = useCallback((updatedCourses: Course[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  }, []);

  const addCourse = useCallback(async (courseData: Omit<Course, 'id' | 'studentCount'>) => {
    try {
      const newCourse: Course = {
        ...courseData,
        id: Date.now().toString(),
        studentCount: 0,
      };

      const updatedCourses = [...courses, newCourse];
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Course added successfully');
    } catch (error) {
      message.error('Failed to add course');
    }
  }, [courses, saveToStorage]);

  const updateCourse = useCallback(async (id: string, courseData: Partial<Course>) => {
    try {
      const updatedCourses = courses.map(course =>
        course.id === id ? { ...course, ...courseData } : course
      );
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Course updated successfully');
    } catch (error) {
      message.error('Failed to update course');
    }
  }, [courses, saveToStorage]);

  const deleteCourse = useCallback(async (id: string) => {
    try {
      const courseToDelete = courses.find(course => course.id === id);
      if (courseToDelete && courseToDelete.studentCount > 0) {
        message.error('Cannot delete course with existing students');
        return;
      }

      const updatedCourses = courses.filter(course => course.id !== id);
      setCourses(updatedCourses);
      saveToStorage(updatedCourses);
      message.success('Course deleted successfully');
    } catch (error) {
      message.error('Failed to delete course');
    }
  }, [courses, saveToStorage]);

  return {
    courses,
    loading,
    searchText,
    selectedInstructor,
    selectedStatus,
    sortByStudents,
    fetchCourses,
    addCourse,
    updateCourse,
    deleteCourse,
    setSearchText,
    setSelectedInstructor,
    setSelectedStatus,
    setSortByStudents,
  };
} 