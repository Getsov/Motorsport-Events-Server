const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const { emailRegex, phoneRegex } = require('../shared/sharedRegex');
const { generateDateWithCurrentTime } = require('../utils/generateDateWithCurrentTime');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: 'Invalid email',
    },
  },
  organizatorName: {
    type: String,
    trim: true,
    maxlength: [40, 'Organizator name must be maximum 40 characters long!'],
    default: '',
  },
  firstName: {
    type: String,
    trim: true,
    maxlength: [15, 'First name must be maximum 15 characters long!'],
    default: '',
  },
  lastName: {
    type: String,
    trim: true,
    maxlength: [15, 'Last name must be maximum 15 characters long!'],
    default: '',
  },
  role: {
    type: String,
    enum: ['regular', 'admin', 'organizer'],
    default: 'regular',
  },
  region: {
    type: String,
    enum: [
      'Благоевград',
      'Бургас',
      'Варна',
      'Велико Търново',
      'Видин',
      'Враца',
      'Габрово',
      'Добрич',
      'Кърджали',
      'Кюстендил',
      'Ловеч',
      'Монтана',
      'Пазарджик',
      'Перник',
      'Плевен',
      'Пловдив',
      'Разград',
      'Русе',
      'Силистра',
      'Сливен',
      'Смолян',
      'София (град)',
      'София (област)',
      'Стара Загора',
      'Търговище',
      'Хасково',
      'Шумен',
      'Ямбол',
      '',
    ],
    default: '',
  },
  phone: {
    type: String,
    trim: true,
    default: '',
    validate: {
      validator: function (value) {
        // Allow empty strings or validate against the regex
        return value === '' || phoneRegex.test(value);
      },
      message: 'Invalid phone number!',
    },
  },
  createdEvents: [{ type: ObjectId, ref: 'Event' }],
  likedEvents: [{ type: ObjectId, ref: 'Event' }],
  hashedPassword: { type: String, required: true, select: false },
  isDeleted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
}, {
  timestamps: {
      currentTime: () => generateDateWithCurrentTime()
  }
});

userSchema.index(
  { email: 1 },
  {
    collation: {
      locale: 'en',
      strength: 2,
    },
  }
);

const User = model('User', userSchema);
module.exports = User;
