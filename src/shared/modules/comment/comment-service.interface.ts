import { CreateCommentDto } from './dto/create-comment-dto.js';
import { DocumentType } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import {IDocumentExists} from '../../types';
import { ICheckUserIsAuthor } from '../../types/check-user-is-author.service.js';

export interface ICommentService extends IDocumentExists, ICheckUserIsAuthor {
  create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>>;
  findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]>;
  deleteByOfferId(offerId: string): Promise<number | null>;
}
