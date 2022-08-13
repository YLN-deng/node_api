// 导入数据库连接模块
const db = require("../db/index");

// 导入处理密码的模块
const bcrypt = require("bcryptjs");

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
  // 定义查询用户基本信息的 sql 语句
  const sql = `select id, username, nickname, email, user_pic from ev_users where id=?`;

  // 调用 db.query() 执行sql语句
  db.query(sql, req.user.id, (err, results) => {
    // 执行sql语句失败
    if (err) return res.cc(err);

    // 执行sql语句成功，但是查询结果为空
    if (results.length !== 1) {
      return res.cc("获取用户信息失败");
    }

    // 用户信息获取成功
    res.send({
      status: 0,
      message: "获取用户信息成功",
      data: results[0],
    });
  });
};

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
  // 定义更改用户信息的sql语句
  const sql = `update ev_users set ? where id=?`;

  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) return res.cc("更新用户基本信息失败");

    res.cc("更新用户信息成功", 0);
  });
};

// 更新用户密码
exports.updatePassword = (req, res) => {
  // 根据id查询用户信息
  const sql = `select * from ev_users where id=?`;
  // 执行sql
  db.query(sql, req.user.id, (err, results) => {
    if (err) return res.cc(err);

    if (results.length !== 1) return res.cc("用户不存在");

    // 判断旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("原密码输入有误！");

    // 定义更新密码的sql语句
    const sql = `update ev_users set password=? where id=?`;

    // 对新密码进行加密
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);

    // 调用db.query 执行sql
    db.query(sql, [newPwd, req.user.id], (err, results) => {
      if (err) return res.cc(err);

      if (results.affectedRows !== 1) {
        res.cc("更新密码失败");
      }

      res.cc("更新密码成功", 0);
    });
  });
};

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
  const sql = `update ev_users set user_pic=? where id=?`;

  db.query(sql, [req.body.avatar, req.user.id], (err, results) => {
    if (err) return res.cc(err);

    if (results.affectedRows !== 1) {
      res.cc("更换头像失败");
    }

    res.cc("更换头像成功", 0);
  });
};
