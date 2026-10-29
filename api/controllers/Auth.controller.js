import { handleError } from '../helpers/handleError.js'
import User from '../models/user.model.js'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { sendEmail } from '../helpers/sendEmail.js'

/* ------------------------------------------------------------------ */
/*  Register                                                          */
/* ------------------------------------------------------------------ */
export const Register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body

    const exists = await User.findOne({ email })
    if (exists) return next(handleError(409, 'User already registered.'))

    const hashedPassword = bcryptjs.hashSync(password, 10)
    await new User({ name, email, password: hashedPassword }).save()

    res.status(200).json({ success: true, message: 'Registration successful.' })
  } catch (err) {
    next(handleError(500, err.message))
  }
}

/* ------------------------------------------------------------------ */
/*  Login                                                             */
/* ------------------------------------------------------------------ */
export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(handleError(404, 'Invalid login credentials.'))

    const match = await bcryptjs.compare(password, user.password)
    if (!match) return next(handleError(401, 'Invalid login credentials.'))

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      process.env.JWT_SECRET
    )

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/'
      })
      .status(200)
      .json({
        success: true,
        user: { ...user.toObject({ getters: true }), password: undefined },
        message: 'Login successful.'
      })
  } catch (err) {
    next(handleError(500, err.message))
  }
}

/* ------------------------------------------------------------------ */
/*  Google Login                                                      */
/* ------------------------------------------------------------------ */
export const GoogleLogin = async (req, res, next) => {
  try {
    const { name, email, avatar } = req.body
    let user = await User.findOne({ email })

    if (!user) {
      const randomPwd = Math.random().toString(36).slice(-8)
      const hashed = bcryptjs.hashSync(randomPwd, 10)
      user = await new User({ name, email, password: hashed, avatar }).save()
    }

    const token = jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
        email: user.email,
        avatar: user.avatar
      },
      process.env.JWT_SECRET
    )

    res
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/'
      })
      .status(200)
      .json({
        success: true,
        user: { ...user.toObject({ getters: true }), password: undefined },
        message: 'Login successful.'
      })
  } catch (err) {
    next(handleError(500, err.message))
  }
}

/* ------------------------------------------------------------------ */
/*  Logout                                                            */
/* ------------------------------------------------------------------ */
export const Logout = async (_req, res, next) => {
  try {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        path: '/'
      })
      .status(200)
      .json({ success: true, message: 'Logout successful.' })
  } catch (err) {
    next(handleError(500, err.message))
  }
}

/* ------------------------------------------------------------------ */
/*  Forgot Password – send reset link                                 */
/* ------------------------------------------------------------------ */
export const ForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(handleError(404, 'User not found.'))

    // raw token & hashed token for DB
    const rawToken = crypto.randomBytes(32).toString('hex')
    user.resetPasswordToken = crypto.createHash('sha256').update(rawToken).digest('hex')
user.resetPasswordExpire = Date.now() + 60 * 60 * 1000 // 1 hour
    await user.save()

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`
    const html = `
      <h2>Password Reset Request</h2>
      <p>Click the link below to reset your password (valid for 15 minutes):</p>
      <a href="${resetUrl}">${resetUrl}</a>
    `

    await sendEmail(user.email, 'Reset your password', html)

    res.status(200).json({
      success: true,
      message: 'Password reset email sent. Please check your inbox.'
    })
  } catch (err) {
    next(handleError(500, err.message))
  }
}

export const ResetPassword = async (req, res, next) => {
  try {
    console.log('ResetPassword called');
    const { token } = req.params;
    const { password } = req.body;
    console.log('Token:', token);
    console.log('Password:', password);

    if (!token || !password) {
      return next(handleError(400, 'Token and password are required.'));
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    console.log('Hashed token:', hashedToken);

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return next(handleError(400, 'Invalid or expired reset token.'));
    }

    user.password = bcryptjs.hashSync(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log('Password reset successful for user:', user.email);

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully.'
    });
  } catch (err) {
    console.error('ResetPassword error:', err);
    next(handleError(500, err.message));
  }
}
