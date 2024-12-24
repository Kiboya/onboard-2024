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
      { name: 'Computer Science' },
      { name: 'Civil Engineering' },
      { name: 'Law' },
      { name: 'Mathematics' }, 
      { name: 'Physics' },      
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
        groupNames: ['Computer Science'],
      },
      {
        username: 'jane.smith',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        groupNames: ['Civil Engineering'],
      },
      {
        username: 'amo',
        password: 'riz',
        firstName: 'Amo',
        lastName: 'Riz',
        groupNames: ['Computer Science'],
      },
      {
        username: 'alice.wonder',
        password: 'alicepwd',
        firstName: 'Alice',
        lastName: 'Wonder',
        groupNames: ['Mathematics', 'Physics'],
      },
      {
        username: 'bob.builder',
        password: 'buildit',
        firstName: 'Bob',
        lastName: 'Builder',
        groupNames: ['Law'],
      },
      // Add more users as needed
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
        name: 'Web Programming',
        groupNames: ['Computer Science'],
      },
      {
        name: 'Thermodynamics',
        groupNames: ['Civil Engineering'],
      },
      {
        name: 'Calculus',
        groupNames: ['Mathematics'],
      },
      {
        name: 'Quantum Physics',
        groupNames: ['Physics'],
      },
    ];

    for (const courseData of coursesData) {
      const course = courseRepository.create({
        name: courseData.name,
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
      { name: 'Prof. John Smith' },
      { name: 'Prof. Jane Doe' },
      { name: 'Prof. Albert Newton' }, 
      { name: 'Prof. Marie Curie' }, 
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
      { name: 'Room 101' },
      { name: 'Room 102' },
      { name: 'Room 201' }, 
      { name: 'Lab 1' }, 
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

    for (let i = 0; i < 5; i++) { // Monday to Friday
      const classDate = new Date(startOfWeek);
      classDate.setDate(startOfWeek.getDate() + i);
      
      classesData.push(
        {
          date: classDate,
          startingTime: '09:00',
          endingTime: '10:30',
          classType: 'Lecture',
          courseName: 'Web Programming',
          roomName: 'Room 101',
          groupNames: ['Computer Science'],
          professorNames: ['Prof. John Smith'],
        },
        {
          date: classDate,
          startingTime: '11:00',
          endingTime: '12:30',
          classType: 'Lecture',
          courseName: 'Calculus',
          roomName: 'Room 201',
          groupNames: ['Mathematics'],
          professorNames: ['Prof. Albert Newton'],
        },
        {
          date: classDate,
          startingTime: '14:00',
          endingTime: '15:30',
          classType: 'Lab',
          courseName: 'Quantum Physics',
          roomName: 'Lab 1',
          groupNames: ['Physics'],
          professorNames: ['Prof. Marie Curie'],
        }
      );
    }

    for (const classData of classesData) {
      const classEntity = classRepository.create({
        date: classData.date,
        startingTime: classData.startingTime,
        endingTime: classData.endingTime,
        classType: classData.classType,
      });

      // Assign course to class
      const course = await courseRepository.findOne({
        where: { name: classData.courseName },
        relations: ['classes'],
      });
      if (course) {
        classEntity.course = course;
      }

      // Assign room to class
      const room = await roomRepository.findOne({ where: { name: classData.roomName } });
      if (room) {
        classEntity.room = room;
      }

      // Assign groups to class
      classEntity.groups = [];
      for (const groupName of classData.groupNames) {
        const group = await groupRepository.findOne({ where: { name: groupName } });
        if (group) {
          classEntity.groups.push(group);
        }
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
      console.log(`Class for course '${classData.courseName}' on ${classData.date.toDateString()} added.`);
    }
  } else {
    console.log('Classes already seeded.');
  }

  console.log('Database seeding completed.');
}