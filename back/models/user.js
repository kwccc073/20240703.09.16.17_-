import { Schema, model, ObjectId } from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcrypt'
import UserRole from '../enums/UserRole.js'

const cartSchema = Schema({
  p_id: {
    type: ObjectId,
    ref: 'products',
    required: [true, '使用者購物車商品必填']
  },
  quantity: {
    type: Number,
    required: [true, '使用者購物車商品數量必填'],
    min: [1, '使用者購物車商品數量不符']
  }
})

const schema = new Schema({
  // 使用者帳號
  account: {
    type: String,
    required: [true, '使用者帳號必填'],
    minlength: [4, '使用者帳號長度不符'],
    maxlength: [20, '使用者帳號長度不符'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isAlphanumeric(value)
      },
      message: '使用者帳號格式錯誤'
    }
  },
  // 使用者密碼
  password: {
    type: String,
    required: [true, '使用者密碼必填']
  },
  // 使用者信箱
  email: {
    type: String,
    required: [true, '使用者信箱必填'],
    unique: true,
    validate: {
      validator (value) {
        return validator.isEmail(value)
      },
      message: '使用者信箱格式錯誤'
    }
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [cartSchema]
  },
  // 使用者或管理員（通常會分開兩個model，但這個範例是合在一起）
  role: {
    // 資料型態為數字，預設值為檔案UserRole裡的USER
    type: Number,
    default: UserRole.USER
  }
}, {
  timestamps: true, // 紀錄建立時間&更新時間
  versionKey: false // 紀錄資料修改幾次
})

// schema.pre() 是 Mongoose 中的一個方法，用於在某些操作（如保存、刪除、更新等）發生之前執行預處理邏輯
// save表示在被保存之前執行
schema.pre('save', function (next) {
  const user = this
  if (user.isModified('password')) {
    if (user.password.length < 4 || user.password.length > 20) {
      const error = new Error.ValidationError()
      error.addError('password', new Error.ValidatorError({ message: '使用者密碼長度不符' }))
      next(error) // 如果有錯誤，將錯誤傳遞給 next()
      return
    } else {
      user.password = bcrypt.hashSync(user.password, 10)
    }
  }
  /* 在 Mongoose 中，next() 函數主要用於中間件（.pre() 和 .post()）中
  中間件允許在特定的操作（如保存、刪除、更新等）之前或之後插入自定義邏輯。next() 函數在中間件中用來將控制權傳遞給下一個中間件或最終的操作。 */
  next()
})

// 購物車總數量--------------------------------
// virtual -> 建立虛擬欄位cartQuantity
// .get() -> 定義該欄位資料產生的方式
schema.virtual('cartQuantity').get(function () {
  // 現在這筆的使用者資料
  const user = this // 這裡不可使用箭頭函式，不然this會取不到資料
  // .reduce() -> 累加（把所有數量加起來）
  return user.cart.reduce((total, current) => {
    return total + current.quantity
  }, 0) // 初始值是0
})

export default model('users', schema)
