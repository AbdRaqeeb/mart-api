import { Field, InputType } from '@nestjs/graphql';
import { FileUpload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class UploadPhotoInput {
  @Field(() => GraphQLUpload)
  image: FileUpload;
}
