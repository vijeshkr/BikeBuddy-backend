const userModel = require('../../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendVerificationEmail } = require('../../common/utils');

// Signup controller
const signup = async (req, res) => {
    const { name, email, password } = req.body;


    // Checking all fields filled or not
    if(!name || !email || !password){
        return res.status(422).json({message: 'Please fill all fields',
            success: false
        });
    }
    
    // Hashing password
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password,salt);

    // Create verification token
    const verificationToken = jwt.sign({email}, process.env.JWT_SECRET,{
        expiresIn: '5m'
    });

    try {
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
                existingUser.verificationToken = verificationToken;
                await existingUser.save();

                // Send verification email with new link
                const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${existingUser.verificationToken}`;
                await sendVerificationEmail(existingUser.email,verificationLink);

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
            verificationToken

        });

        await newUser.save();

        // Send verification email with new link
        const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${newUser.verificationToken}`;
        await sendVerificationEmail(newUser.email,verificationLink);

        res.status(200).json({ message: 'User created. Check your email to verify your account',
            success: true
        })
    } catch (error) {
        console.error('Error: ', error);
        res.status(500).json({ message: 'Error during registration',
            success: false
         });
    }
};

module.exports = signup;