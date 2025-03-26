export const validateCourseName = (name: string, existingCourses: string[]): boolean => {
    return !existingCourses.includes(name.trim().toLowerCase());
  };
  