
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import jwt from "jsonwebtoken";


// Register a new user
export const register = async (req, res) => {
  const { name, email, password, mobile_number, fcmtoken, date_of_birth, user_role, address_line_1,  address_line_2, address_line_3, address_line_4,pincode,city, state,country,memberId } = req.body;
  
  try {
    let isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    let user = new User({
      name,
      email,
      password,
      memberId,
      mobile_number,
      fcmtoken,
      date_of_birth,
      user_role,
      address_line_1,
      address_line_2,
      address_line_3,
      address_line_4,
      pincode,
      city,
      state,
      country
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);


    await user.save();

    if(user){
      const payload = { user: { id: user.id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' })
   
      const {password,...userResponse} = user._doc
     
      res.status(201).json({ token, ...{user:userResponse} });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error ' + error});
  }
};

// Login user
export const login = async (req, res) => {
  const { email} = req.body;
  try {
    let user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '365d' });
    const {password,...userResponse} = user._doc

    res.status(200).json({ token, ...{user:userResponse} });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user data
export const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user data
export const updateUser = async (req, res) => {
  const { name, mobile_number, fcmtoken, date_of_birth, address_line_1,  address_line_2, address_line_3, address_line_4,city,state,country,pincode,memberId } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // member Id should not be updated
    user.name = name || user.name;
    user.mobile_number = mobile_number || user.mobile_number;
    user.fcmtoken = fcmtoken || user.fcmtoken;
    user.date_of_birth = date_of_birth || user.date_of_birth;
    user.address_line_1 = address_line_1 || user.address_line_1;
    user.address_line_2 = address_line_2 || user.address_line_2;
    user.address_line_3 = address_line_3 || user.address_line_3;
    user.address_line_4 = address_line_4 || user.address_line_4;
    user.city = city || user.city;
    user.state = state || user.state;
    user.country = country || user.country;
    user.memberId = memberId || user.memberId
    user.pincode = pincode || user.pincode;

    await user.save();

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout user
export const logout = (req, res) => {
  // To "log out" a user, simply invalidate the token on the client side
  // For demonstration, we'll just send a success message
  res.json({ message: 'User logged out successfully' });
};


// Delete user
export const deleteUser = async(req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByIdAndDelete(userId);

    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully' });
} catch (err) {
    res.status(500).json({ error: err.message });
}
};

// List all users
export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};



export const paginatdUsers  = async(req,res) =>{
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
  const search = req.query.search || '';
  try {
    const query = {
      ...filter,
      ...(search && { $text: { $search: search } })
  };

  const results = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();

  const count = await User.countDocuments(query);
  const totalPages = Math.ceil(count / limit);

    res.json({
        users:results,
        currentPage: page,
        totalPages: totalPages
    });
} catch (err) {
    res.status(500).json({ message: err.message });
}
}


