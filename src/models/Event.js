const {
  Schema,
  model,
  Types: { ObjectId },
} = require('mongoose');

const { phoneRegex, validTime, emailRegex } = require('../shared/sharedRegex');

const eventSchema = new Schema({
  shortTitle: {
    type: String,
    required: true,
    trim: true,
    maxlength: [20, 'Short title must be maximum 24 characters long!'],
  },
  longTitle: {
    type: String,
    trim: true,
    default: '',
    maxlength: [80, 'Long title must be maximum 80 characters long!']
  },
  shortDescription: {
    type: String,
    required: true,
    trim: true,
    minlength: [2, 'Short description must be minimum 2 characters long!'],
    maxlength: [140, 'Short description must be maximum 140 characters long!'],
  },
  longDescription: {
    type: String,
    trim: true,
    maxlength: [2000, 'Long description must be maximum 2000 characters long!'],
  },
  dates: {
    type: [
      {
        date: {
          type: Date,
          required: true,
          validate: {
            validator: function (date) {
              return date >= new Date(new Date().setHours(0, 0, 0, 0));
            },
            message: 'Start date cannot be in the past!',
          },
        },
        startTime: {
          type: String,
          required: true,
          validate: {
            validator: (value) => validTime.test(value),
            message: 'Invalid time format! Example: hh:mm (24h)',
          },
        },
        endTime: {
          type: String,
          required: true,
          validate: {
            validator: (value) => validTime.test(value),
            message: 'Invalid time format! Example: hh:mm (24h)',
          },
        },
      },
    ],
  },
  dateCreated: {
    type: Date,
    required: true,
    validate: {
      validator: function (date) {
        return date >= new Date(new Date().setHours(0, 0, 0, 0));
      },
      message: 'Start date cannot be in the past!',
    },
  },
  imageUrl: {
    type: String,
    trim: true,
    default: '',
  },
  contacts: {
    // TODO: Check later for unique COORDS..!
    coordinates: {
      lat: { type: String, required: true, trim: true },
      lng: { type: String, required: true, trim: true },
    },
    region: {
      type: String,
      required: true,
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
        'Чужбина'
      ],
    },
    address: { type: String, required: true, trim: true },
    phone: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator: function (value) {
          // Allow empty strings or validate against the regex
          return value === '' || phoneRegex.test(value);
        },
        message: 'Invalid phone number!',
      },
    },
    email: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: (value) => emailRegex.test(value),
        message: 'Invalid email',
      },
    },
  },
  categories: {
    type: [
      {
        type: String,
        enum: [
          'Автокрос',
          'Драг',
          'Дрифт',
          'Картинг',
          'Мото Рейс',
          'Мотокрос',
          'Офроуд',
          'Писта',
          'Планинско изкачване',
          'Рали',
          'Рали Крос',
          'Рали Спринт',
          'СИМ Рейс',
          'Тайм Атак',
          'Други',
          'Събори',
        ],
      },
    ],
    validate: {
      validator: (value) => {
        return new Set(value).size === value.length;
      },
      message: 'Categories must be unique!',
    },
    validate: {
      validator: (value) => {
        return value.length !== 0;
      },
      message: 'Add at least one category!',
    },
    required: true,
  },
  likes: [{ type: ObjectId, ref: 'User' }],
  creator: { type: ObjectId, ref: 'User', required: true },
  winners: {
    type: [
      {
        name: { type: String, required: true, trim: true },
        vehicle: { type: String, required: true, trim: true },
        place: { type: Number, required: true },
      },
    ],
    validate: {
      validator: function (array) {
        return array.length <= 3;
      },
      message: 'Winners must be a maximum of 3 persons!',
    },
  },
  participantPrices: [
    { price: { type: Number }, description: { type: String, trim: true } },
  ],
  visitorPrices: {
    type: [
      {
        price: { type: Number, required: true },
        description: { type: String, required: true, trim: true },
      },
    ],
    validate: {
      validator: function (array) {
        return array.length > 0;
      },
      message: 'VisitorPrices must contain at least 1 price!',
    },
  },
  isDeleted: { type: Boolean, default: false },
  isApproved: { type: Boolean, default: false },
});

eventSchema.index(
  { title: 1 },
  {
    collation: {
      locale: 'en',
      strength: 2,
    },
  }
);

const Event = model('Event', eventSchema);
module.exports = Event;
