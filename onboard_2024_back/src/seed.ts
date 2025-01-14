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
import { Absence } from './absence/absence.entity';
import { CardContent } from './home/home-card-content.entity';
import { Card } from './home/home-card.entity';

// DTOs
import { HomeCardContentDto, HomeCardDto } from './dto/home-card.dto';

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
  const absenceRepository = dataSource.getRepository(Absence);
  const cardRepository = dataSource.getRepository(Card);
  const cardContentRepository = dataSource.getRepository(CardContent);

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
        dateOfBirth: '1990-01-15',
        mobilePhone: '+33612345678',
        email: 'john.doe@example.com',
        groupNames: ['Informatique', 'Génie Civil'],
      },
      {
        username: 'jane.smith',
        password: 'password123',
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1992-03-21',
        mobilePhone: '+33623456789',
        email: 'jane.smith@example.com',
        groupNames: ['Informatique', 'Droit'],
      },
      {
        username: 'amo',
        password: 'riz',
        firstName: 'Amo',
        lastName: 'Riz',
        dateOfBirth: '1995-07-08',
        mobilePhone: '+33634567890',
        email: 'amo.riz@example.com',
        groupNames: ['Informatique', 'Droit'],
      },
      {
        username: 'alice.wonder',
        password: 'alicepwd',
        firstName: 'Alice',
        lastName: 'Wonder',
        dateOfBirth: '1993-11-30',
        mobilePhone: '+33645678901',
        email: 'alice.wonder@example.com',
        groupNames: ['Mathématiques', 'Physique'],
      },
      {
        username: 'bob.builder',
        password: 'buildit',
        firstName: 'Bob',
        lastName: 'Builder',
        dateOfBirth: '1991-05-25',
        mobilePhone: '+33656789012',
        email: 'bob.builder@example.com',
        groupNames: ['Génie Civil', 'Mathématiques'],
      },
      // Additional Users
      {
        username: 'carol.white',
        password: 'carolpwd',
        firstName: 'Carol',
        lastName: 'White',
        dateOfBirth: '1994-09-12',
        mobilePhone: '+33667890123',
        email: 'carol.white@example.com',
        groupNames: ['Droit', 'Physique'],
      },
      {
        username: 'dave.green',
        password: 'davepwd',
        firstName: 'Dave',
        lastName: 'Green',
        dateOfBirth: '1989-12-03',
        mobilePhone: '+33678901234',
        email: 'dave.green@example.com',
        groupNames: ['Informatique', 'Mathématiques'],
      },
      {
        username: 'eve.black',
        password: 'evepwd',
        firstName: 'Eve',
        lastName: 'Black',
        dateOfBirth: '1996-02-18',
        mobilePhone: '+33689012345',
        email: 'eve.black@example.com',
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
        dateOfBirth: userData.dateOfBirth,
        mobilePhone: userData.mobilePhone,
        email: userData.email,
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
        { startingTime: '20:00', endingTime: '21:00' },
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

  // Seed Absences
  const absenceCount = await absenceRepository.count();
  if (absenceCount === 0) {
    console.log('Seeding Absences...');
    const users = await userRepository.find();

    const reasons = ['Sick leave', 'Family emergency', 'Vacation', 'Personal reasons', 'Conference'];
    const additionalInfos = ['Flu', 'Hospital visit', 'Trip to Europe', 'Personal time', 'Attending conference'];
    const statuses = ['approved', 'pending', 'rejected'];

    for (const user of users) {
      const absencesData = [];
      const numberOfAbsences = Math.floor(Math.random() * 3) + 1; // Each user will have 1 to 3 absences

      for (let i = 0; i < numberOfAbsences; i++) {
        const startDate = new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + Math.floor(Math.random() * 5) + 1);

        absencesData.push({
          startDate: startDate.toISOString().split('T')[0],
          endDate: endDate.toISOString().split('T')[0],
          reason: reasons[Math.floor(Math.random() * reasons.length)],
          additionalInfo: additionalInfos[Math.floor(Math.random() * additionalInfos.length)],
          status: statuses[Math.floor(Math.random() * statuses.length)],
          user: user,
        });
      }

      for (const absenceData of absencesData) {
        const absence = absenceRepository.create(absenceData);
        await absenceRepository.save(absence);
        console.log(`Absence for user '${user.username}' added.`);
      }
    }
  } else {
    console.log('Absences already seeded.');
  }

  // Seed Cards
  const cardCount = await cardRepository.count();
  if (cardCount === 0) {
    console.log('Seeding Home cards...');
    const cardsData: HomeCardDto[] = [
      {
        title: 'Dates académiques importantes',
        title_en: 'Important Academic Dates',
        cssClass: 'important',
        order: 1,
        contents: [
          { type: 'text', content: 'Fin du semestre : 15 juin 2025', content_en: 'End of Semester: June 15, 2025', cssClass: 'date-item', order: 1 },
          { type: 'text', content: 'Examens finaux : 1-14 juin 2025', content_en: 'Final Exams: June 1-14, 2025', cssClass: 'date-item warning', order: 2 },
          { type: 'text', content: 'Vacances d\'été : 1 juillet - 31 août 2025', content_en: 'Summer Break: July 1 - August 31, 2025', cssClass: 'date-item', order: 3 },
        ],
      },
      {
        title: 'Ressources du campus',
        title_en: 'Campus Resources',
        cssClass: 'resources',
        order: 2,
        contents: [
          { type: 'link', content: 'Catalogue de la bibliothèque', content_en: 'Library Catalog', url: 'https://library.example.com', cssClass: 'resource-link list', order: 1 },
          { type: 'link', content: 'Support informatique', content_en: 'IT Support', url: 'https://support.example.com', cssClass: 'resource-link list', order: 2 },
          {
            type: 'paragraph',
            content: 'Explorez nos ressources en ligne pour améliorer votre expérience d\'apprentissage.',
            content_en: 'Explore our online resources to enhance your learning experience.',
            cssClass: 'justified',
            order: 3,
            children: [
              { type: 'text', content: 'Explorez nos ', content_en: 'Explore our ', cssClass: '', order: 1 },
              { type: 'link', content: 'ressources en ligne', content_en: 'online resources', url: 'https://resources.example.com', cssClass: 'resource-link', order: 2 },
              { type: 'text', content: ' pour améliorer votre expérience d\'apprentissage.', content_en: ' to enhance your learning experience.', cssClass: '', order: 3 },
            ],
          },
        ],
      },
      {
        title: 'Horaires des services du campus',
        title_en: 'Campus Services Hours',
        cssClass: 'services',
        order: 3,
        contents: [
          { type: 'text', content: 'Bibliothèque : 8h00 - 22h00', content_en: 'Library: 8:00 AM - 10:00 PM', cssClass: 'service-hours', order: 1 },
          { type: 'text', content: 'Cafétéria : 7h30 - 20h00', content_en: 'Cafeteria: 7:30 AM - 8:00 PM', cssClass: 'service-hours', order: 2 },
          { type: 'text', content: 'Gymnase : 6h00 - 23h00', content_en: 'Gym: 6:00 AM - 11:00 PM', cssClass: 'service-hours', order: 3 },
        ],
      },
      {
        title: 'Contacts importants',
        title_en: 'Important Contacts',
        cssClass: 'contacts',
        order: 4,
        contents: [
          {
            type: 'paragraph',
            content: 'Services aux étudiants : +33 1 23 45 67 89\nUrgences : 112',
            content_en: 'Student Services: +33 1 23 45 67 89\nEmergency: 112',
            cssClass: 'contact-info justified',
            order: 1,
            children: [
              { type: 'text', content: 'Services aux étudiants : +33 1 23 45 67 89', content_en: 'Student Services: +33 1 23 45 67 89', cssClass: 'contact-item', order: 1 },
              { type: 'text', content: 'Urgences : 112', content_en: 'Emergency: 112', cssClass: 'contact-item emergency', order: 2 },
            ],
          },
          {
            type: 'paragraph',
            content: 'Pour plus d\'assistance, visitez le bureau de l\'administration pendant les heures de bureau.',
            content_en: 'For more assistance, visit the Administration Office during working hours.',
            cssClass: 'centered',
            order: 2,
            children: [
              { type: 'text', content: 'Pour plus d\'assistance, visitez le ', content_en: 'For more assistance, visit the ', cssClass: '', order: 1 },
              { type: 'link', content: 'bureau de l\'administration', content_en: 'Administration Office', url: 'https://admin.example.com', cssClass: 'resource-link', order: 2 },
              { type: 'text', content: ' pendant les heures de bureau.', content_en: ' during working hours.', cssClass: '', order: 3 },
            ],
          },
        ],
      },
      {
        title: 'Annonces du campus',
        title_en: 'Campus Announcements',
        cssClass: 'important',
        order: 5,
        contents: [
          {
            type: 'paragraph',
            content: 'L\'université organisera un symposium technologique le mois prochain. Ne manquez pas les événements passionnants !',
            content_en: 'The university will be hosting a tech symposium next month. Don\'t miss out on the exciting events!',
            cssClass: 'justified',
            order: 1,
            children: [
              { type: 'text', content: 'L\'université organisera un ', content_en: 'The university will be hosting a ', cssClass: '', order: 1 },
              { type: 'link', content: 'symposium technologique', content_en: 'tech symposium', url: 'https://symposium.example.com', cssClass: 'resource-link', order: 2 },
              { type: 'text', content: ' le mois prochain. Ne manquez pas les événements passionnants !', content_en: ' next month. Don\'t miss out on the exciting events!', cssClass: '', order: 3 },
            ],
          },
          { type: 'text', content: 'Veuillez respecter toutes les directives sanitaires durant les événements.', content_en: 'Please adhere to all health guidelines during the events.', cssClass: 'warning', order: 2 },
        ],
      },
      {
        title: 'Liens utiles',
        title_en: 'Useful Links',
        cssClass: 'resources',
        order: 6,
        contents: [
          {
            type: 'paragraph',
            content: 'Accédez au portail étudiant pour gérer vos cours et emplois du temps.',
            content_en: 'Access the student portal to manage your courses and schedules.',
            cssClass: 'centered',
            order: 1,
            children: [
              { type: 'text', content: 'Accédez au ', content_en: 'Access the ', cssClass: '', order: 1 },
              { type: 'link', content: 'portail étudiant', content_en: 'student portal', url: 'https://portal.example.com', cssClass: 'resource-link', order: 2 },
              { type: 'text', content: ' pour gérer vos cours et emplois du temps.', content_en: ' to manage your courses and schedules.', cssClass: '', order: 3 },
            ],
          },
          { type: 'text', content: 'Pour tout problème, contactez le support informatique.', content_en: 'For any issues, contact IT Support.', cssClass: 'centered', order: 2 },
        ],
      },
    ];

    for (const cardData of cardsData) {
      const card = cardRepository.create({
        title: cardData.title,
        title_en: cardData.title_en,
        cssClass: cardData.cssClass,
        order: cardData.order,
        contents: cardData.contents.map(contentData => mapContentDtoToEntity(contentData)),
      });

      await cardRepository.save(card);

      console.log(`Home card '${card.title}' added.`);
    }
  } else {
    console.log('Home cards already seeded.');
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

/**
 * Maps HomeCardContentDto to CardContent entity, including nested children.
 * @param contentDto The content DTO to map.
 * @returns The mapped CardContent entity.
 */
function mapContentDtoToEntity(contentDto: HomeCardContentDto): CardContent {
  const content = new CardContent();
  content.type = contentDto.type;
  content.content = contentDto.content;
  content.content_en = contentDto.content_en;
  content.url = contentDto.url;
  content.cssClass = contentDto.cssClass;
  content.order = contentDto.order;

  if (contentDto.children && contentDto.children.length > 0) {
    content.children = contentDto.children.map(childDto => mapContentDtoToEntity(childDto));
  } else {
    content.children = [];
  }

  return content;
}