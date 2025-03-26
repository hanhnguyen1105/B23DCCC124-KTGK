import { useState, useCallback } from 'react';

export type Course = {
  id: string;
  name: string;
  instructor: string;
  students: number;
  status: 'Đang mở' | 'Đã kết thúc' | 'Tạm dừng';
};

export default function useCoursesModel() {
  const [courses, setCourses] = useState<Course[]>(
    JSON.parse(localStorage.getItem('courses') || '[]')
  );

  const saveCourses = useCallback((newCourses: Course[]) => {
    localStorage.setItem('courses', JSON.stringify(newCourses));
    setCourses(newCourses);
  }, []);

  return { courses, setCourses: saveCourses };
}
