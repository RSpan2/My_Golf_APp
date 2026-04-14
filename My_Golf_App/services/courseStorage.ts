import AsyncStorage from '@react-native-async-storage/async-storage';

import { type Course } from '@/constants/course';

const COURSES_KEY = '@golf_courses';

export async function loadCourses(): Promise<Course[]> {
  const raw = await AsyncStorage.getItem(COURSES_KEY);
  if (!raw) return [];
  return JSON.parse(raw) as Course[];
}

export async function saveCourses(courses: Course[]): Promise<void> {
  await AsyncStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export async function getCourseById(id: string): Promise<Course | undefined> {
  const courses = await loadCourses();
  return courses.find((c) => c.id === id);
}

export async function upsertCourse(course: Course): Promise<void> {
  const courses = await loadCourses();
  const index = courses.findIndex((c) => c.id === course.id);
  if (index >= 0) {
    courses[index] = course;
  } else {
    courses.push(course);
  }
  await saveCourses(courses);
}

export async function deleteCourse(id: string): Promise<void> {
  const courses = await loadCourses();
  await saveCourses(courses.filter((c) => c.id !== id));
}
