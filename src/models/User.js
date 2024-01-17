const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username required']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email required']
    },
    password: {
        type: String,
        required: [true, 'Password required']
    },
    verified: {
        type: Boolean,
        default: false,
        required: true
    },
    online: {
        type: Boolean,
        default: true
    },
    // friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    lang: {
        type: String,
        required: true
    }


});


userSchema.methods.toJSON = function () {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
};


module.exports = mongoose.model('User', userSchema);