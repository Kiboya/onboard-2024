// src/group/group.service.ts

// Modules
import { Injectable } from '@nestjs/common';

// DTOs
import { GroupResponseDto } from '../dto/group-response.dto';

// Entities
import { Group } from './group.entity';

// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * @fileoverview Provides services for managing groups, including retrieving all groups.
 */
@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,
  ) {}

  /**
   * Retrieves all groups with language support.
   *
   * @param lang - The language in which to retrieve the data.
   * @returns An array of GroupResponseDto objects.
   */
  async getAllGroups(lang: 'en' | 'fr'): Promise<GroupResponseDto[]> {
    const groups = await this.groupRepository.find();

    return groups.map(group => ({
      id: group.id,
      name: lang === 'en' && group.name_en ? group.name_en : group.name,
    }));
  }
}