import { Router } from 'express'
import passport from 'passport'
import UserModel from '../models/user.model.js'
import { createHash, generateToken,isValidPassword } from '../utils.js'

const router = Router()

router.post('/sessions/login', async (req, res) => {

  const { email, password } = req.body
  const user = await UserModel.findOne({ email })

  console.log('user desde la DB es:', user)


  //validacion de que exista el user (email)
  if (!user) {

      //return res.status(401).json({ message: 'Correo o contraseña invalidos.' });

      return res.render('error', { title: 'Hello People 🖐️', messageError: 'Usuario no registrado.' })
  }


  //por medio del modelo/esquema de UserModel. estamos verificando que la contraseña ingresada en el Post session/login sea igual a la que existe en la base de datos cuando nos registramos (session/register)
  if (!isValidPassword(password,user.password)) {

    

      return res.render('error', { title: 'Hello People 🖐️', messageError: 'Correo o contraseña invalidos.' })
  }

  console.log('user', user)
  const token = generateToken(user)
  res
    .cookie('access_token', token, { maxAge: 1000 * 60 * 10, httpOnly: true })
    .redirect('/profile')
})

router.post('/sessions/register', async (req, res, next) => {

  try {

    const { first_name, last_name, email, password, age } = req.body;



    if (!first_name || !last_name || !email || !password || !age) {
      return done(new Error('Todos los campos son requeridos.'));
    }

    const findEmail = await UserModel.findOne({ email: email })

    console.log(findEmail)

    if (findEmail) {
      return res.status(409).json({ error: 'Ya existe un usuario con el correo en el sistema.' });
    }

    const newUserRegister = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role: "user"
    }
    const newUser = await UserModel.create(newUserRegister);

    res.redirect('/login')
  } catch (error) {
    next(error);
  }
})


router.post('/sessions/recovery-password', async (req, res) => {
  const { body: { email, password } } = req
  if (!email || !password) {
    //return res.status(400).json({ message: 'Todos los campos son requeridos.' })
    return res.render('error', { title: 'Hello People 🖐️', messageError: 'Todos los campos son requeridos.' })
  }
  const user = await UserModel.findOne({ email })
  if (!user) {
    //return res.status(401).json({ message: 'Correo o contraseña invalidos.' })
    return res.render('error', { title: 'Hello People 🖐️', messageError: 'Correo o contraseña invalidos.' })
  }
  user.password = createHash(password)
  await UserModel.updateOne({ email }, user)
  res.redirect('/login')
})

router.get('/sessions/current', passport.authenticate('current', { session: false }), (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'No estas autenticado.' })
  }
  res.status(200).json(req.user)
})

router.get('/session/logout', (req, res) => {
  // Eliminar la cookie de token del cliente
  res.clearCookie('access_token');

  // Redirigir al usuario a la página de login u otra página según tu aplicación
  res.redirect('/login');
});


router.get('/sessions/github', passport.authenticate('github', { scope: ['user:email'], session: false }))

router.get('/sessions/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), (req, res) => {
  console.log('req.user', req.user)
  const token = generateToken(req.user)
  res
    .cookie('access_token', token, { maxAge: 1000 * 60 * 30, httpOnly: true })
    .redirect('/profile')
})

export default router