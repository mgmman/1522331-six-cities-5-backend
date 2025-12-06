import {IsNumber, IsString, Length, Max, Min} from 'class-validator';
import {commentValidations} from './comment-validations.js';

export class CreateCommentRequestDto {
  @IsString({ message: commentValidations.text.invalidFormat })
  @Length(5, 1024, { message: commentValidations.text.lengthField })
  public text: string;

  @IsNumber(undefined, { message: commentValidations.rating.invalidFormat })
  @Min(1, { message: commentValidations.rating.range })
  @Max(5, { message: commentValidations.rating.range })
  public rating: number;
}
