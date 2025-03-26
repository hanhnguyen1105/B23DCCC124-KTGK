import { Course, CourseFormData, CourseStatus } from '@/models/course';

const STORAGE_KEY = 'online_courses';

const SAMPLE_COURSES: Course[] = [
  {
    id: '1',
    tenKhoaHoc: 'Lập trình React cơ bản',
    giangVien: 'Nguyễn Văn A',
    moTa: 'Khóa học cung cấp kiến thức cơ bản về React và các khái niệm quan trọng',
    soHocVien: 120,
    trangThai: CourseStatus.OPEN
  },
  {
    id: '2',
    tenKhoaHoc: 'Lập trình Backend với Node.js',
    giangVien: 'Trần Thị B',
    moTa: 'Học cách xây dựng server-side với Node.js và Express',
    soHocVien: 85,
    trangThai: CourseStatus.OPEN
  },
  {
    id: '3',
    tenKhoaHoc: 'Lập trình ứng dụng iOS',
    giangVien: 'Lê Văn C',
    moTa: 'Khóa học về phát triển ứng dụng iOS với Swift',
    soHocVien: 65,
    trangThai: CourseStatus.PAUSED
  },
  {
    id: '4',
    tenKhoaHoc: 'Lập trình Vue.js nâng cao',
    giangVien: 'Phạm Thị D',
    moTa: 'Nâng cao kỹ năng lập trình với Vue.js và các tính năng nâng cao',
    soHocVien: 95,
    trangThai: CourseStatus.OPEN
  },
  {
    id: '5',
    tenKhoaHoc: 'Lập trình Backend với Python',
    giangVien: 'Hoàng Văn E',
    moTa: 'Xây dựng backend với Python và Django framework',
    soHocVien: 110,
    trangThai: CourseStatus.CLOSED
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

  getGiangVienList(): string[] {
    const courses = this.getCoursesFromStorage();
    return Array.from(new Set(courses.map(course => course.giangVien)));
  }

  createCourse(courseData: CourseFormData): Course {
    const courses = this.getCoursesFromStorage();
    const newCourse: Course = {
      ...courseData,
      id: Date.now().toString(),
      soHocVien: 0,
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
    const courseToDelete = courses.find(course => course.id === id);
    if (courseToDelete && courseToDelete.soHocVien > 0) {
      throw new Error('Không thể xóa khóa học đã có học viên');
    }
    const filteredCourses = courses.filter(course => course.id !== id);
    this.saveCoursesToStorage(filteredCourses);
  }

  isDuplicateTenKhoaHoc(tenKhoaHoc: string, currentId?: string): boolean {
    const courses = this.getCoursesFromStorage();
    return courses.some(
      course => 
        course.tenKhoaHoc.toLowerCase() === tenKhoaHoc.toLowerCase() && 
        course.id !== currentId
    );
  }
}

export const courseService = new CourseService();
