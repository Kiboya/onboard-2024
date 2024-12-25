// src/seed.ts

// Modules
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';

// Entities
import { User } from './user/user.entity';
import { Group } from './group/group.entity';
import { Course } from './course/course.entity';
import { Class } from './class/class.entity';
import { Room } from './room/room.entity';
import { Professor } from './professor/professor.entity';

/**
 * @fileoverview Seeds the database with initial data for users, groups, courses, classes, rooms, and professors.
 */
export async function seedDatabase(dataSource: DataSource) {
  // Repositories
  const userRepository = dataSource.getRepository(User);
  const groupRepository = dataSource.getRepository(Group);
  const courseRepository = dataSource.getRepository(Course);
  const classRepository = dataSource.getRepository(Class);
  const roomRepository = dataSource.getRepository(Room);
  const professorRepository = dataSource.getRepository(Professor);

  // Seed Groups
  const groupCount = await groupRepository.count();
  if (groupCount === 0) {
    console.log('Seeding Groups...');
    const groupsData = [
      {
        name: 'Informatique',
        name_en: 'Computer Science'
      },
      {
        name: 'Génie Civil',
        name_en: 'Civil Engineering'
      },
      {
        name: 'Droit',
        name_en: 'Law'
      },
      {
        name: 'Mathématiques',
        name_en: 'Mathematics'
      },
      {
        name: 'Physique',
        name_en: 'Physics'
      },
    ];

    const groups = [];
    for (const groupData of groupsData) {
      const group = groupRepository.create(groupData);
      await groupRepository.save(group);
      groups.push(group);
      console.log(`Group '${group.name}' added.`);
    }
  } else {
    console.log('Groups already seeded.');
  }

  // Seed Users
  const userCount = await userRepository.count();
  if (userCount === 0) {
    console.log('Seeding Users...');
    const usersData = [
      {
        username: 'john.doe',
        password: 'password123',
        firstName: 'John',
        lastName: 'Doe',
        groupNames: ['Informatique', 'Génie Civil'],
      },
      {
        username: 'jane.smith',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        groupNames: ['Informatique', 'Droit'],
      },
      {
        username: 'amo',
        password: 'riz',
        firstName: 'Amo',
        lastName: 'Riz',
        groupNames: ['Informatique', 'Droit'],
      },
      {
        username: 'alice.wonder',
        password: 'alicepwd',
        firstName: 'Alice',
        lastName: 'Wonder',
        groupNames: ['Mathématiques', 'Physique'],
      },
      {
        username: 'bob.builder',
        password: 'buildit',
        firstName: 'Bob',
        lastName: 'Builder',
        groupNames: ['Génie Civil', 'Mathématiques'],
      },
      // Additional Users
      {
        username: 'carol.white',
        password: 'carolpwd',
        firstName: 'Carol',
        lastName: 'White',
        groupNames: ['Droit', 'Physique'],
      },
      {
        username: 'dave.green',
        password: 'davepwd',
        firstName: 'Dave',
        lastName: 'Green',
        groupNames: ['Informatique', 'Mathématiques'],
      },
      {
        username: 'eve.black',
        password: 'evepwd',
        firstName: 'Eve',
        lastName: 'Black',
        groupNames: ['Génie Civil', 'Physique'],
      },
    ];

    for (const userData of usersData) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = userRepository.create({
        username: userData.username,
        password: hashedPassword,
        firstName: userData.firstName,
        lastName: userData.lastName,
      });

      // Assign groups to user
      user.groups = [];
      for (const groupName of userData.groupNames) {
        const group = await groupRepository.findOne({ where: { name: groupName } });
        if (group) {
          user.groups.push(group);
        }
      }

      await userRepository.save(user);
      console.log(`User '${user.username}' added.`);
    }
  } else {
    console.log('Users already seeded.');
  }

  // Seed Courses
  const courseCount = await courseRepository.count();
  if (courseCount === 0) {
    console.log('Seeding Courses...');
    const coursesData = [
      {
        name: 'Programmation Web',
        name_en: 'Web Programming',
        groupNames: ['Informatique'],
      },
      {
        name: 'Thermodynamique',
        name_en: 'Thermodynamics',
        groupNames: ['Génie Civil'],
      },
      {
        name: 'Calcul',
        name_en: 'Calculus',
        groupNames: ['Mathématiques', 'Physique'],
      },
      {
        name: 'Physique Quantique',
        name_en: 'Quantum Physics',
        groupNames: ['Physique'],
      },
      // Additional Courses
      {
        name: 'Droit International',
        name_en: 'International Law',
        groupNames: ['Droit'],
      },
      {
        name: 'Algèbre Linéaire',
        name_en: 'Linear Algebra',
        groupNames: ['Mathématiques'],
      },
      {
        name: 'Architecture Informatique',
        name_en: 'Computer Architecture',
        groupNames: ['Informatique'],
      },
    ];

    for (const courseData of coursesData) {
      const course = courseRepository.create({
        name: courseData.name,
        name_en: courseData.name_en,
      });

      // Assign groups to course
      course.groups = [];
      for (const groupName of courseData.groupNames) {
        const group = await groupRepository.findOne({ where: { name: groupName } });
        if (group) {
          course.groups.push(group);
        }
      }

      await courseRepository.save(course);
      console.log(`Course '${course.name}' added.`);
    }
  } else {
    console.log('Courses already seeded.');
  }

  // Seed Professors
  const professorCount = await professorRepository.count();
  if (professorCount === 0) {
    console.log('Seeding Professors...');
    const professorsData = [
      { name: 'John Smith' },
      { name: 'Jane Doe' },
      { name: 'Albert Newton' },
      { name: 'Marie Curie' },
      // Additional Professors
      { name: 'Isaac Einstein' },
      { name: 'Grace Hopper' },
      { name: 'Alan Turing' },
      { name: 'Ada Lovelace' },
    ];

    const professors = [];
    for (const professorData of professorsData) {
      const professor = professorRepository.create(professorData);
      await professorRepository.save(professor);
      professors.push(professor);
      console.log(`Professor '${professor.name}' added.`);
    }
  } else {
    console.log('Professors already seeded.');
  }

  // Seed Rooms
  const roomCount = await roomRepository.count();
  if (roomCount === 0) {
    console.log('Seeding Rooms...');
    const roomsData = [
      { name: 'D101' },
      { name: 'E102' },
      { name: 'B201' },
      { name: 'C201' },
      { name: 'A301' },
      { name: 'F401' },
    ];

    const rooms = [];
    for (const roomData of roomsData) {
      const room = roomRepository.create(roomData);
      await roomRepository.save(room);
      rooms.push(room);
      console.log(`Room '${room.name}' added.`);
    }
  } else {
    console.log('Rooms already seeded.');
  }

  // Seed Classes
  const classCount = await classRepository.count();
  if (classCount === 0) {
    console.log('Seeding Classes...');
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    const classesData = [];

    // Define class times
    const classTimes = [
      { startingTime: '09:00', endingTime: '10:30' },
      { startingTime: '11:00', endingTime: '12:30' },
      { startingTime: '14:00', endingTime: '15:30' },
      { startingTime: '16:00', endingTime: '17:30' },
    ];

    // Retrieve all courses, rooms, and professors
    const allCourses = await courseRepository.find();
    const allRooms = await roomRepository.find();
    const allProfessors = await professorRepository.find();

    for (let i = 1; i <= 5; i++) { // Monday to Friday
      const classDate = new Date(startOfWeek);
      classDate.setDate(startOfWeek.getDate() + i); // Monday is 1

      for (const time of classTimes) {
        // Select a course in rotation
        const course = allCourses[(i + hashCode(time.startingTime)) % allCourses.length];
        // Select a room in rotation
        const room = allRooms[(i + hashCode(time.startingTime)) % allRooms.length];
        // Select a professor in rotation
        const professor = allProfessors[(i + hashCode(time.startingTime)) % allProfessors.length];

        classesData.push({
          date: classDate,
          startingTime: time.startingTime,
          endingTime: time.endingTime,
          classType: course.name === 'Travaux Pratiques' ? 'Travaux Pratiques' : 'Cours Magistral',
          classType_en: course.name === 'Travaux Pratiques' ? 'Lab' : 'Lecture',
          courseName: course.name,
          roomName: room.name,
          professorNames: [professor.name],
        });
      }
    }

    // Additional Classes for Expanded Courses
    for (let i = 1; i <= 5; i++) { // Monday to Friday
      const classDate = new Date(startOfWeek);
      classDate.setDate(startOfWeek.getDate() + i); // Monday is 1

      // Evening Classes
      const eveningTimes = [
        { startingTime: '18:00', endingTime: '19:30' },
        { startingTime: '20:00', endingTime: '21:30' },
      ];

      for (const time of eveningTimes) {
        // Select a different course
        const course = allCourses[(i * 2 + hashCode(time.startingTime)) % allCourses.length];
        // Select a different room
        const room = allRooms[(i * 2 + hashCode(time.startingTime)) % allRooms.length];
        // Select a different professor
        const professor = allProfessors[(i * 2 + hashCode(time.startingTime)) % allProfessors.length];

        classesData.push({
          date: classDate,
          startingTime: time.startingTime,
          endingTime: time.endingTime,
          classType: course.name === 'Travaux Pratiques' ? 'Travaux Pratiques' : 'Cours Magistral',
          classType_en: course.name === 'Travaux Pratiques' ? 'Lab' : 'Lecture',
          courseName: course.name,
          roomName: room.name,
          professorNames: [professor.name],
        });
      }
    }

    for (const classData of classesData) {
      const classEntity = classRepository.create({
        date: classData.date,
        startingTime: classData.startingTime,
        endingTime: classData.endingTime,
        classType: classData.classType,
        classType_en: classData.classType_en,
      });

      // Assign course to class
      const course = await courseRepository.findOne({
        where: { name: classData.courseName },
        relations: ['groups'],
      });
      if (course) {
        classEntity.course = course;
      }

      // Assign room to class
      const room = await roomRepository.findOne({ where: { name: classData.roomName } });
      if (room) {
        classEntity.room = room;
      }

      // Assign professors to class
      classEntity.professors = [];
      for (const professorName of classData.professorNames) {
        const professor = await professorRepository.findOne({ where: { name: professorName } });
        if (professor) {
          classEntity.professors.push(professor);
        }
      }

      await classRepository.save(classEntity);
      console.log(`Class for course '${classData.courseName}' on ${classData.date.toDateString()} at ${classData.startingTime} added.`);
    }
  } else {
    console.log('Classes already seeded.');
  }

  console.log('Database seeding completed.');
}

/**
 * Generates a hash code for the given string.
 * @param str The string for which to generate a hash code.
 * @returns The hash code for the given string. 
 */
export function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash);
};