import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/User.routes.js'
import categoryRoutes from './routes/Category.routes.js'
import productRoutes from './routes/Product.routes.js'
import adminRoutes from './routes/Admin.routes.js'

dotenv.config({ path: '.env' })

import connectToDB from './config/db.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use('/api/user', userRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/product', productRoutes)
app.use('/api/admin', adminRoutes)

connectToDB()
const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`)
})