import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

enum UserRole {
    Admin = 'admin',
    Operator = 'operador',
    Barman = 'barman',
    SuperAdmin = 'superadmin',
}

@Schema()
export class User extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false })
    dni?: string;

    @Prop({ required: true, enum: UserRole })
    role: UserRole;
}

export const UserSchema = SchemaFactory.createForClass(User);
