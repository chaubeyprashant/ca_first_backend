import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  memberId:{type:Number,required:true},
  password: { type: String, required: true,select:false },
  mobile_number: { type: String, required: true },
  fcmtoken: { type: String },
  date_of_birth: { type: Date, required: true },
  user_role: { type: String, default: "user" },
  address_line_1: { type: String, required: true },
  address_line_2: { type: String, required: false,default:"" },
  address_line_3: { type: String, required: false,default:"" },
  address_line_4: { type: String, required: false,default:"" },
  city:{type:String,required:true},
  state:{type:String,required:true},
  country:{type:String,required:true,default:"India"},
  pincode: { type: String, required: true },
  cop_status:{ type: String, required: false,default:"" },
  ccp_fcp:{ type: String, required: false,default:"" },
  sex:{ type: String, required: false,default:"" },
},{
  timestamps: true
});

const User = mongoose.model("User", userSchema);

userSchema.index({ name: 'text'});

export default User
