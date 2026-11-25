import z from "zod";
import mongoose, { type ExtendedDocument, PluginTypeExtender } from "#/configurations/db";

const name = z
  .string()
  .regex(/^[a-zA-Z\s]+$/)
  .min(4)
  .max(64);
const email = z.email().max(64);
const phoneNumber = z.e164();
const password = z.string().length(8);
const role = z.enum(["SELLER", "CONSUMER", "LOGISTICS_PARTNER", "ADMIN"]);
const UserValidator = z.strictObject({ name, email, password, phoneNumber, role });
type User = z.infer<typeof UserValidator>;

const UserSchema = new mongoose.Schema<ExtendedDocument<User>>(
  {
    name: {
      type: String,
      required: [true, "name is required."],
      validator: {
        validate: (value: string) => name.safeParse(value).success,
        message: (props: { value: string }) => `${props.value} is not a valid admin name.`,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      validator: {
        validate: (value: string) => email.safeParse(value).success,
        message: (props: { value: string }) => `${props.value} is not a valid email.`,
      },
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      unique: true,
      valodator: {
        validate: (value: string) => password.safeParse(value).success,
        message: (props: { value: string }) => `${props.value} is not a valid password.`,
      },
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      validator: {
        validate: (value: string) => phoneNumber.safeParse(value).success,
        message: (props: { value: string }) => `${props.value} is not a valid phone number`,
      },
    },
    role: {
      type: String,
      enum: role.options,
      required: [true, "Role is required"],
      validator: {
        validate: (value: string) => role.safeParse(value).success,
        message: (props: { value: string }) => `${props.value} is not a valid role option`,
      },
    },
  },
  { timestamps: true },
);
const UserModel = mongoose.model<ExtendedDocument<User>, PluginTypeExtender<User>>(
  "user",
  UserSchema,
);
export default UserModel;
