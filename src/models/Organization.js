const {
  Schema,
  model,
  Types: { ObjectId },
} = require("mongoose");
const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const emailRegex2 = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;

OrgnaizationSchema = new Schema({
  name: { type: String, require: true },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => emailRegex.test(value),
      message: "Invalid email",
    },
  },
  //TODO adress,
  managerFirstName: { type: String, require: true },
  managerLasttName: { type: String, require: true },
  //TODO regex for phone, or minimum and maximum length
  phone: { type: String, require: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  createdEvents: { type: ObjectId, ref: "Event", required: true },
  isDeleted: { type: Boolean, default: false },
});
/*


isDeleted,

*/

const Organization = model("Organization", OrgnaizationSchema);
module.exports = Organization;
