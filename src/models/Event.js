const {
    Schema,
    model,
    Types: { ObjectId },
} = require('mongoose');
const { phoneRegex, validTime } = require('../utils/sharedRegex');

const eventSchema = new Schema({
    shortTitle: {
        type: String,
        required: true,
        // index: { unique: true },
        maxlength: [24, 'Short title must be maximum 24 characters long!'],
    },
    longTitle: {
        type: String,
        default: '',
    },
    shortDescription: {
        type: String,
        required: true,
        minlength: [2, 'Short description must be minimum 2 characters long!'],
        maxlength: [
            48,
            'Short description must be maximum 40 characters long!',
        ],
    },
    longDescription: {
        type: String,
        required: true,
        minlength: [10, 'Long description must be minimum 10 characters long!'],
        maxlength: [
            250,
            'Long description must be maximum 250 characters long!',
        ],
    },
    dates: {
        type: [
            {
                startDate: {
                    type: Date,
                    required: true,
                    validate: {
                        validator: function (date) {
                            return (
                                date >=
                                new Date(new Date().setHours(0, 0, 0, 0))
                            );
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
                endDate: {
                    type: Date,
                    // required: true,
                    validate: {
                        validator: function (date) {
                            return date >= this.startDate;
                        },
                        message:
                            'End date must be equal or greater than start date!',
                    },
                },
            },
        ],
    },
    imageUrl: {
        type: String,
        default: '',
        // validate: {
        //   validator: (value) => validString.test(value),
        //   message: "Invalid URL, must start with HTTP:// or HTTPS://",
        // },
    },
    // TODO: To add some storage later!
    // imageFile: {
    //     data: Buffer,
    //     connectType: String
    // },
    contacts: {
        // TODO: Check later for unique COORDS..!
        coordinates: {
            lat: { type: String, required: true },
            long: { type: String, required: true },
        },
        region: {
            type: String,
            required: true,
            enum: [
                'Бургас',
                'Благоевград',
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
                'София (област)',
                'София (град)',
                'Стара Загора',
                'Търговище',
                'Хасково',
                'Шумен',
                'Ямбол',
            ],
        },
        address: { type: String, required: true },
        phone: {
            type: String,
            default: '',
            validate: {
                validator: function (value) {
                    // Allow empty strings or validate against the regex
                    return value === '' || phoneRegex.test(value);
                },
                message: 'Invalid phone number!',
            },
        },
        email: { type: String, required: true },
    },
    category: {
        type: String,
        required: true,
        // TODO: Check later if we'll let them as they are or to be in cyrillic?
        enum: [
            'Drag',
            'Drift',
            'Time Attack',
            'Offroad',
            'Moto Race',
            'Motocross',
            'Hill Climb',
            'Track',
            'Rally',
            'Rally Sprint',
            'Rallycross',
            'Autocross',
            'Karting',
            'SIM Racing',
            'Събори',
        ],
    },
    likes: [{ type: ObjectId, ref: 'User' }],
    // TODO: We must add Admin model later!
    creator: { type: ObjectId, ref: 'User', required: true },
    winners: {
        type: [
            {
                //TODO: Is it requred true (winners) when creating event
                name: { type: String, required: true },
                vehicle: { type: String, required: true },
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
        { price: { type: Number }, description: { type: String } },
    ],
    visitorPrices: {
        type: [
            {
                price: { type: Number, required: true },
                description: { type: String, required: true },
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
