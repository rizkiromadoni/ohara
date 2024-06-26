import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcryptjs"

const emailRegexPattern: RegExp = /^[^\s@]+@[^s@].[^\s@]+$/

export interface IUser extends Document {
    name: string
    email: string
    password: string
    avatar: {
        public_id: string
        url: string
    },
    role: string
    isVerified: boolean
    courses: Array<{courseId: string}>
    comparePassword: (password: string) => Promise<boolean>
}

const userSchema: Schema<IUser> = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add an email"],
        validate: {
            validator: (email: string) => emailRegexPattern.test(email),
        },
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    avatar: {
        public_id: String,
        url: String
    },
    role: {
        type: String,
        default: "user"
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    courses: [
        {
            courseId: String
        }
    ]
}, { timestamps: true })

userSchema.pre<IUser>("save", async function (next) {
    if (!this?.isModified("password")) {
        next()
    }

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password)
}

const userModel: Model<IUser> = mongoose.model("User", userSchema)
export default userModel