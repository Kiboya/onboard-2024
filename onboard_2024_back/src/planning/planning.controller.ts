import { Body, Controller, Post } from '@nestjs/common';
import { PlanningService } from 'src/planning/planning.service';
import { CourseDto } from 'src/dto/course.dto';

@Controller('planning')
export class PlanningController {
    constructor(private readonly planningService: PlanningService) {}

    @Post('addcourse')
    async addCourse(@Body() CourseDto: CourseDto) {
    const course = await this.planningService.addCourse(CourseDto);
    return { message: 'Course added successfully', course };
    }

}
