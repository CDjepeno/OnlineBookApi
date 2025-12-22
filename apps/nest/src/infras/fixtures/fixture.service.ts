import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Sexe } from 'src/domaine/enums/sexe.enum';
import { Repository } from 'typeorm';
import { Book } from '../models/book.model';
import { Booking } from '../models/booking.model';
import { Contact } from '../models/contact.model';
import { User } from '../models/user.model';

@Injectable()
export class FixtureService {
  private readonly logger = new Logger(FixtureService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
    @InjectRepository(Contact)
    private contactRepository: Repository<Contact>,
  ) {}

  async loadFixtures() {
    this.logger.log('🌱 Chargement des fixtures...');

    try {
      const userCount = await this.userRepository.count();
      if (userCount > 0) {
        this.logger.log('✅ Les fixtures sont déjà chargées');
        return;
      }

      const users = await this.createUsers();
      this.logger.log(`✅ ${users.length} utilisateurs créés`);

      const contacts = await this.createContacts();
      this.logger.log(`✅ ${contacts.length} contacts créés`);

      const books = await this.createBooks(users);
      this.logger.log(`✅ ${books.length} livres créés`);

      const bookings = await this.createBookings(users, books);
      this.logger.log(`✅ ${bookings.length} réservations créées`);

      this.logger.log('🎉 Fixtures chargées avec succès !');
    } catch (error) {
      this.logger.error('❌ Erreur lors du chargement des fixtures', error);
      throw error;
    }
  }

  private async createUsers(): Promise<User[]> {
    const usersData = [
      {
        email: 'admin@example.com',
        password: 'Admin123!',
        name: 'Admin User',
        phone: '+33 6 12 34 56 78',
        sexe: Sexe.HOMME,
      },
      {
        email: '123@test.fr',
        password: 'test12',
        name: 'John Doe',
        phone: '+33 6 23 45 67 89',
        sexe: Sexe.HOMME,
      },
      {
        email: 'test@test.fr',
        password: 'test12',
        name: 'Jane Smith',
        phone: '+33 6 34 56 78 90',
        sexe: Sexe.FEMME,
      },
    ];

    const users = this.userRepository.create(usersData);
    return await this.userRepository.save(users);
  }

  private async createContacts(): Promise<Contact[]> {
    const contactsData = [
      {
        name: 'Support Technique',
        email: 'support@example.com',
        message: 'Demande de support technique pour un problème de connexion',
      },
      {
        name: 'Service Commercial',
        email: 'commercial@example.com',
        message:
          'Question concernant les tarifs et les abonnements disponibles',
      },
      {
        name: 'Marie Dupont',
        email: 'marie.dupont@example.com',
        message:
          'Informations sur les nouvelles fonctionnalités de la plateforme',
      },
    ];

    const contacts = this.contactRepository.create(contactsData);
    return await this.contactRepository.save(contacts);
  }

  private async createBooks(users: User[]): Promise<Book[]> {
    const booksData = [
      // Développement & Programmation
      {
        title: 'Clean Code',
        author: 'Robert C. Martin',
        description:
          'A Handbook of Agile Software Craftsmanship - Essential reading for developers who want to write better code.',
        releaseAt: new Date('2008-08-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Design Patterns',
        author: 'Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides',
        description:
          'Elements of Reusable Object-Oriented Software - The classic Gang of Four book on design patterns.',
        releaseAt: new Date('1994-10-31'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51szD9HC9pL._SX395_BO1,204,203,200_.jpg',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'The Pragmatic Programmer',
        author: 'Andrew Hunt, David Thomas',
        description:
          'Your Journey to Mastery - A modern classic on software development best practices.',
        releaseAt: new Date('2019-09-13'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51W1sBPO7tL._SX380_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      {
        title: 'Refactoring',
        author: 'Martin Fowler',
        description:
          'Improving the Design of Existing Code - Learn how to improve your codebase incrementally.',
        releaseAt: new Date('2018-11-20'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Domain-Driven Design',
        author: 'Eric Evans',
        description:
          'Tackling Complexity in the Heart of Software - The blue book that started it all.',
        releaseAt: new Date('2003-08-20'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51OWGtzQLRL._SX375_BO1,204,203,200_.jpg',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        description:
          'Unearthing the Excellence in JavaScript - Master the essential parts of the language.',
        releaseAt: new Date('2008-05-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/5143RlZ3Y7L._SX381_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      {
        title: "You Don't Know JS",
        author: 'Kyle Simpson',
        description:
          'Deep dive into the core mechanisms of JavaScript - An essential series for serious developers.',
        releaseAt: new Date('2015-03-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/41T5H8u7fUL._SX331_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Eloquent JavaScript',
        author: 'Marijn Haverbeke',
        description:
          'A Modern Introduction to Programming - Learn to write elegant, efficient code.',
        releaseAt: new Date('2018-12-04'),
        coverUrl: 'https://eloquentjavascript.net/img/cover.jpg',
        userId: users[1].id,
        user: users[1],
      },
      // Architecture & Système
      {
        title: 'Building Microservices',
        author: 'Sam Newman',
        description:
          'Designing Fine-Grained Systems - The definitive guide to microservices architecture.',
        releaseAt: new Date('2015-02-20'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51V1WXPrM9L._SX379_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      {
        title: 'Clean Architecture',
        author: 'Robert C. Martin',
        description:
          "A Craftsman's Guide to Software Structure - Build systems that stand the test of time.",
        releaseAt: new Date('2017-09-10'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/41BKx1AxQWL._SX380_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Software Architecture Patterns',
        author: 'Mark Richards',
        description:
          'Understanding Common Architecture Patterns - Learn when and how to apply them.',
        releaseAt: new Date('2015-01-01'),
        coverUrl: 'https://www.oreilly.com/library/cover/9781491971437/250w/',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'Site Reliability Engineering',
        author: 'Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Murphy',
        description:
          'How Google Runs Production Systems - Learn from the best in the industry.',
        releaseAt: new Date('2016-04-16'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51XswmTPDxL._SX379_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      // DevOps & Cloud
      {
        title: 'The Phoenix Project',
        author: 'Gene Kim, Kevin Behr, George Spafford',
        description:
          'A Novel about IT, DevOps, and Helping Your Business Win - Transform your organization.',
        releaseAt: new Date('2013-01-10'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51Yy7oWd8qL._SX331_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Kubernetes in Action',
        author: 'Marko Luksa',
        description:
          'Master container orchestration - Deploy, manage, and scale applications with K8s.',
        releaseAt: new Date('2017-12-21'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51hLXs8mYgL._SX397_BO1,204,203,200_.jpg',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'Docker Deep Dive',
        author: 'Nigel Poulton',
        description:
          'Master containerization technology - Everything you need to know about Docker.',
        releaseAt: new Date('2020-08-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/41vF0APQ6dL._SX348_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      // Data & AI
      {
        title: 'Designing Data-Intensive Applications',
        author: 'Martin Kleppmann',
        description:
          'The Big Ideas Behind Reliable, Scalable Systems - A modern classic for backend engineers.',
        releaseAt: new Date('2017-03-16'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51ZSpMl1-2L._SX379_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Machine Learning Yearning',
        author: 'Andrew Ng',
        description:
          'Technical Strategy for AI Engineers - Learn how to structure ML projects.',
        releaseAt: new Date('2018-01-01'),
        coverUrl:
          'https://d2wvfoqc9gyqzf.cloudfront.net/content/uploads/2018/09/Ng-MLY01-13.png',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'Hands-On Machine Learning',
        author: 'Aurélien Géron',
        description:
          'With Scikit-Learn, Keras, and TensorFlow - Practical guide to building intelligent systems.',
        releaseAt: new Date('2019-10-15'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51aqYc1QyrL._SX379_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },

      // Soft Skills & Career
      {
        title: 'The Mythical Man-Month',
        author: 'Frederick P. Brooks Jr.',
        description:
          'Essays on Software Engineering - Timeless wisdom on managing software projects.',
        releaseAt: new Date('1975-01-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51WIpM70FEL._SX334_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Soft Skills',
        author: 'John Sonmez',
        description:
          "The Software Developer's Life Manual - Career advice for programmers.",
        releaseAt: new Date('2014-12-29'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51WiLueukSL._SX396_BO1,204,203,200_.jpg',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'The Clean Coder',
        author: 'Robert C. Martin',
        description:
          'A Code of Conduct for Professional Programmers - What it means to be a professional developer.',
        releaseAt: new Date('2011-05-23'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51eRFE-QoeL._SX382_BO1,204,203,200_.jpg',
        userId: users[2].id,
        user: users[2],
      },
      // Web Development
      {
        title: 'Learning React',
        author: 'Alex Banks, Eve Porcello',
        description:
          'Modern Patterns for Developing React Apps - Master the leading frontend framework.',
        releaseAt: new Date('2020-06-09'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51Ga5GuElyL._SX379_BO1,204,203,200_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Full Stack JavaScript Development',
        author: 'Azat Mardan',
        description:
          'Using MongoDB, Express, React, and Node - Build complete web applications.',
        releaseAt: new Date('2018-12-01'),
        coverUrl:
          'https://images-na.ssl-images-amazon.com/images/I/51RQFXlFwqL._SX397_BO1,204,203,200_.jpg',
        userId: users[1].id,
        user: users[1],
      },
      {
        title: 'CSS Secrets',
        author: 'Lea Verou',
        description:
          'Better Solutions to Everyday Web Design Problems - Master modern CSS techniques.',
        releaseAt: new Date('2015-06-04'),
        coverUrl:
          'https://covers.oreillystatic.com/images/0636920031123/cat.gif',
        userId: users[2].id,
        user: users[2],
      },
      // Security
      {
        title: 'Web Application Security',
        author: 'Andrew Hoffman',
        description:
          'Exploitation and Countermeasures - Protect your applications from common attacks.',
        releaseAt: new Date('2020-03-10'),
        coverUrl: 'https://m.media-amazon.com/images/I/71DXVFuv8VL._SY466_.jpg',
        userId: users[0].id,
        user: users[0],
      },
      {
        title: 'Hacking: The Art of Exploitation',
        author: 'Jon Erickson',
        description:
          'Understanding security through offensive techniques - Know your enemy.',
        releaseAt: new Date('2008-02-01'),
        coverUrl: 'https://m.media-amazon.com/images/I/51cftOLu+qL._SY466_.jpg',
        userId: users[1].id,
        user: users[1],
      },
    ];

    const books = this.bookRepository.create(booksData);
    return await this.bookRepository.save(books);
  }

  private async createBookings(
    users: User[],
    books: Book[],
  ): Promise<Booking[]> {
    const now = new Date();

    const bookingsData = [];

    for (let i = 0; i < 30; i++) {
      const userIndex = i % users.length;
      const bookIndex = i % books.length;

      let startDayOffset, endDayOffset;

      if (i < 10) {
        startDayOffset = 1 + i * 3;
        endDayOffset = startDayOffset + 7;
      } else if (i < 20) {
        startDayOffset = -(i - 10) * 2;
        endDayOffset = startDayOffset + 14;
      } else {
        startDayOffset = -(20 + (i - 20) * 5);
        endDayOffset = startDayOffset + 7;
      }

      bookingsData.push({
        startAt: new Date(now.getTime() + startDayOffset * 24 * 60 * 60 * 1000),
        endAt: new Date(now.getTime() + endDayOffset * 24 * 60 * 60 * 1000),
        userId: users[userIndex].id,
        bookId: books[bookIndex].id,
        hasFuturReservation: i < 10,
        user: users[userIndex],
        book: books[bookIndex],
      });
    }

    const bookings = this.bookingRepository.create(bookingsData);
    return await this.bookingRepository.save(bookings);
  }
}
