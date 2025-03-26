import { Course, CourseFormData } from '@/models/course';

const STORAGE_KEY = 'online_courses';

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    tenKhoaHoc: 'Lập trình React cơ bản',
    giangVien: 'Nguyễn Văn A',
    linhVuc: 'frontend',
    soHocVien: 120,
    trangThai: 'active'
  },
  {
    id: '2',
    tenKhoaHoc: 'Lập trình Backend với Node.js',
    giangVien: 'Trần Thị B',
    linhVuc: 'backend',
    soHocVien: 85,
    trangThai: 'active'
  },
  {
    id: '3',
    tenKhoaHoc: 'Lập trình ứng dụng iOS',
    giangVien: 'Lê Văn C',
    linhVuc: 'mobile',
    soHocVien: 65,
    trangThai: 'inactive'
  },
  {
    id: '4',
    tenKhoaHoc: 'Lập trình Vue.js nâng cao',
    giangVien: 'Phạm Thị D',
    linhVuc: 'frontend',
    soHocVien: 95,
    trangThai: 'active'
  },
  {
    id: '5',
    tenKhoaHoc: 'Lập trình Backend với Python',
    giangVien: 'Hoàng Văn E',
    linhVuc: 'backend',
    soHocVien: 110,
    trangThai: 'active'
  }
];

class CourseService {
  constructor() {
    // Khởi tạo dữ liệu mẫu nếu storage trống
    if (!localStorage.getItem(STORAGE_KEY)) {
      this.saveCoursesToStorage(SAMPLE_COURSES);
    }
  }

  private getCoursesFromStorage(): Course[] {
    const coursesJson = localStorage.getItem(STORAGE_KEY);
    return coursesJson ? JSON.parse(coursesJson) : [];
  }

  private saveCoursesToStorage(courses: Course[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  }

  getAllCourses(): Course[] {
    return this.getCoursesFromStorage();
  }

  getCourseById(id: string): Course | undefined {
    const courses = this.getCoursesFromStorage();
    return courses.find(course => course.id === id);
  }

  createCourse(courseData: CourseFormData): Course {
    const courses = this.getCoursesFromStorage();
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
    };
    courses.push(newCourse);
    this.saveCoursesToStorage(courses);
    return newCourse;
  }

  updateCourse(id: string, courseData: CourseFormData): Course {
    const courses = this.getCoursesFromStorage();
    const index = courses.findIndex(course => course.id === id);
    if (index === -1) {
      throw new Error('Không tìm thấy khóa học');
    }
    courses[index] = {
      ...courses[index],
      ...courseData,
    };
    this.saveCoursesToStorage(courses);
    return courses[index];
  }

  deleteCourse(id: string): void {
    const courses = this.getCoursesFromStorage();
    const filteredCourses = courses.filter(course => course.id !== id);
    this.saveCoursesToStorage(filteredCourses);
  }
}

export const courseService = new CourseService();
