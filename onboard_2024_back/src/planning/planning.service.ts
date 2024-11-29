import { Injectable } from '@nestjs/common';
import { CourseDto } from 'src/dto/course.dto';
import { Planning } from './planning.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class PlanningService {
    constructor(
        @InjectRepository(Planning)
        private planningRepository: Repository<Planning>,
        private jwtService: JwtService,
    ) {}

    async addCourse(CourseDto: CourseDto): Promise <Planning> 
    {
        const course = this.planningRepository.create(CourseDto);
        return await this.planningRepository.save(course);
    }

}
