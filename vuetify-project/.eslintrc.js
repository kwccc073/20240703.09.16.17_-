module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
  ],
  overrides: [
    {
      // 指定這兩個資料夾
      files: ['src/layouts/**', 'src/pages/**'],
      rules: {
        // 關閉限制兩個英文單字組合的規定
        'vue/multi-word-component-names': 'off'
      }
    }
  ]
}
