import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { User } from './entities/user.entity';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {

  constructor(

    @InjectModel(User.name)
    private readonly userModel: Model<User>,

  ) { }


  async create(createUserDto: CreateUserDto) {
    createUserDto.name = createUserDto.name.toLocaleLowerCase();

    try {
      const user = await this.userModel.create(createUserDto);
      return user;

    } catch (error) {
      this.handleExceptions(error);
    }

  }


  async findAll() {
    return this.userModel.find(); // Retrieve all users from the model
  }

  async findOneComplete(term: string) {

    let user: User;

    // MongoID
    if (!user && isValidObjectId(term)) {
      user = await this.userModel.findById(term);
    }

    // Name
    if (!user) {
      user = await this.userModel.findOne({ name: term.toLowerCase().trim() })
    }


    if (!user)
      throw new NotFoundException(`User with id, name not found`);


    return user;
  }

  async findOneById(term: string) {

    let user: User;

    // MongoID
    if (!user && isValidObjectId(term)) {
      user = await this.userModel.findById(term);
    }

    if (!user)
      throw new NotFoundException(`User not found`);


    return user;
  }

  async updateComplete(term: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOneComplete(term);
    if (updateUserDto.name)
      updateUserDto.name = updateUserDto.name.toLowerCase();

    try {
      await user.updateOne(updateUserDto);
      return { ...user.toJSON(), ...updateUserDto };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async updateById(term: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOneById(term);

    try {
      await user.updateOne(updateUserDto);
      return { ...user.toJSON(), ...updateUserDto };

    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.userModel.deleteOne({ _id: id });
    if (deletedCount === 0)
      throw new BadRequestException(`User with id "${id}" not found`);

    return;
  }


  private handleExceptions(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`User exists in db ${JSON.stringify(error.keyValue)}`);
    }
    console.log(error);
    throw new InternalServerErrorException(`Can't create User - Check server logs`);
  }

}
