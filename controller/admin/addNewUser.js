const userModel = require('../../models/userModel');
const bcrypt = require('bcrypt');

// Add new user controller
const addNewUser = async (req, res) => {
    const userRole = req.userRole;
    const { name, email, password, role } = req.body;

    // Checking all fields filled or not
    if(!name || !email || !password){
        return res.status(422).json({message: 'Please fill all fields',
            success: false
        });
    }
    
    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password,salt);

    try {

        // Checking current user is admin or not
        if (userRole !== 'admin') {
            return res.status(403).json({
                message: 'Only admin can add new user',
                success: false
            });
        }
        
        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if(existingUser){
            // If email is already verified, return user already exists
            if(existingUser.isVerified){
                return res.status(400).json({ message: 'User with this email already exists',
                    success: false
                });
            }else{
                existingUser.name = name;
                existingUser.password = hashedPassword;
                existingUser.role = role;
                await existingUser.save();

                return res.status(200).json({ message: 'User updated. Please verify your email.',
                    success: true
                })
            }
        }

        // Create new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
            role

        });

        await newUser.save();

        res.status(200).json({ message: 'New user created',
            success: true
        })
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ message: 'Error during registration',
            success: false
         });
    }
};

module.exports = addNewUser;