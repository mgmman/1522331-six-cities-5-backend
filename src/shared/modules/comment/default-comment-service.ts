import { inject, injectable } from 'inversify';
import { ICommentService } from './comment-service.interface.js';
import { Component } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentEntity } from './comment.entity.js';
import { CreateCommentDto } from './dto/create-comment-dto.js';
import { IOfferService } from '../offer/offer-service.interface.js';
import { UpdateOfferDto } from '../offer/dto/update-offer-dto.js';

@injectable()
export class DefaultCommentService implements ICommentService{
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>,
    @inject(Component.OfferService) private readonly offerService: IOfferService
  ) {}

  public async checkUserIsAuthor(entityId: string, userId: string): Promise<boolean> {
    const offer = await this.commentModel.findById(entityId).populate(['author']).exec();
    return offer?.author.id === userId;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.commentModel
      .exists({_id: documentId})) !== null;
  }

  public async create(dto: CreateCommentDto): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create(dto);
    const offer = await this.offerService.findById(dto.offerId);
    const newRating = (offer!.rating * offer!.commentCount + dto.rating) / (offer!.commentCount + 1);
    const update = { rating: newRating, commentCount: offer!.commentCount + 1 };
    await this.offerService.updateById(offer!.id, update)
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    return this.commentModel
      .find({offerId})
      .populate('userId');
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
