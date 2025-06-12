# 运动组队系统开发

## 1. 使用工具

- #### 前端：HTML、CSS、JavaScript、vue3

- #### 后端：java（Spring Boot）

- #### 数据库管理：MySQL Workbench

## 2. 需求分析

- #### 用户登录及验证、个人信息

- #### 发布组队信息界面，包含运动类型、时间地点、水平、需求人数等字段

- #### 有组队界面，包含组队信息列表。

- #### 删除、添加、修改组队列表。

- #### 支持组队的报名，报名后要能更新已报名人数、查看报名名单等。

## 3. 页面需求

#### <u>下划线功能</u> 代表优先度较低，推迟完成。

#### 加粗功能 代表跳转页面

* 欢迎页面
  * 标题文字/logo
  * **登录按钮**
  * **注册按钮**
  * 说明文字
* 登录界面
  * 账号/密码输入框
  * **登录按钮**
  * **<u>找回密码按钮</u>**
* 注册界面
  * <u>邮箱地址输入框</u>
  * 账号输入框
  * 密码输入框
  * 确认密码输入框
  * <u>上传头像</u>
  * 昵称输入框
  * 性别输入框
  * 生日输入框
  * 联系方式输入框
  * 注册按钮
* 主界面
  * 个人主页
    * 显示用户信息
    * 编辑信息功能
    * <u>上传头像功能</u>
    * 历史组队信息-->组队详情页
  * 组队页面
    * 搜索框
    * 筛选框（若干）
    * 组队信息列表-->组队详情页
  * 发起组队
    * 筛选框（若干）
    * 文本框（若干）
    * 发布按钮
  * 组队详情页
    * 展示组队信息
    * 成员状态列表
    * 退出/报名按钮

### 效果示例：

![概念图1](img/概念图1.png)

![概念图2](img/概念图2.png)



## 4. 数据库设计


### 关系模式：

* ##### 表结构：`t_user`

  * `t_user`:表名
  * `uid`: 用户唯一标识，主键，自动递增。

  - `password`: 用户密码，字符串类型，不能为空。

  - `nickname`: 用户昵称，字符串类型，不能为空。

  - `sex`: 用户性别，枚举类型（`Male`、`Female`、`Other`），不能为空。

  - `birthday`: 用户生日，日期类型。

  - `phone`: 用户手机号，字符串类型，唯一。
  - `avatar`: 用户头像路径，字符串类型，允许为空。

* ##### 说明

  1. **主键**：`uid` 是主键，自动递增。
  2. **性别**：`sex` 使用枚举类型，限制性别只能是 `Male`、`Female` 或 `Other`。
  3. **手机号**：`phone` 使用 `VARCHAR(15)`，并设置为唯一约束，确保手机号不会重复。
  4. **生日**：`birthday` 使用 `DATE` 类型，用于存储日期。

```sql
CREATE TABLE `t_user` (
    `uid` INT AUTO_INCREMENT PRIMARY KEY, -- 用户唯一标识
    `password` VARCHAR(255) NOT NULL,     -- 用户密码
    `nickname` VARCHAR(255) NOT NULL,     -- 用户昵称
    `sex` ENUM('Male', 'Female', 'Other') NOT NULL, -- 用户性别
    `birthday` DATE,                      -- 用户生日
    `phone` VARCHAR(15) UNIQUE,           -- 用户手机号
    `avatar` VARCHAR(255)                 -- 用户头像路径
);
```



* ##### 表结构：`sportname`

  - `sid`: 运动项目的唯一标识，主键，自动递增。
  - `sname`: 运动项目的名称，字符串类型，不能为空。
  - `stype`: 运动项目的类型，字符串类型，不能为空。

* **说明**

  * **主键**：`sid` 是主键，自动递增。
  * **运动项目名称**：`sname` 使用 `VARCHAR(255)`，不能为空。
  * **运动项目类型**：`stype` 使用 `VARCHAR(255)`，不能为空。

```sql
CREATE TABLE `sportname` (
    `sid` INT AUTO_INCREMENT PRIMARY KEY, -- 运动项目唯一标识
    `sname` VARCHAR(255) NOT NULL,       -- 运动项目名称
    `stype` VARCHAR(255) NOT NULL        -- 运动项目类型
);
```



* ##### 表结构：`teaminfo`

  - `tid`: 队伍的唯一标识，主键，自动递增。
  - `sponsor`: 运动id，必须是 `sid`，外键关联到 `t_sportname` 表的 `sid` 列。
  - `sponsor`: 发起人，必须是 `uid`，外键关联到 `t_user` 表的 `uid` 列。
  - `level`: 队伍水平，整数类型。
  - `already`: 已报名人数，整数类型。
  - `need`: 需要的人数，整数类型。
  - `tstatus`: 队伍状态，整数类型。
  - `runtime`: 运动时间，日期时间类型。
  - `starttime`: 开始时间，日期时间类型。
  - `endtime`: 结束时间，日期时间类型。

* ##### 说明：

  1. **主键**：`tid` 是主键，自动递增。
  2. **外键**：`sponsor` 是外键，关联到 `t_user` 表的 `uid` 列。这确保了 `sponsor` 的值必须是有效的用户 ID。
  3. **时间字段**：`runtime`、`starttime` 和 `endtime` 使用 `DATETIME` 类型，用于存储日期和时间。
  4. **整数字段**：`level`、`already`、`need` 和 `status` 使用 `INT` 类型，用于存储整数值。

```sql
CREATE TABLE `teaminfo` (
    `tid` INT AUTO_INCREMENT PRIMARY KEY, -- 队伍唯一标识
    `sponsor` INT NOT NULL,               -- 发起人，必须是 `uid`
    `level` INT,                          -- 队伍水平
    `already` INT,                        -- 已报名人数
    `need` INT,                           -- 需要的人数
    `tstatus` INT,                         -- 队伍状态
    `runtime` DATETIME,                   -- 运动时间
    `starttime` DATETIME,                 -- 开始时间
    `endtime` DATETIME,                   -- 结束时间
    FOREIGN KEY (`sponsor`) REFERENCES `t_user`(`uid`) -- 外键关联到 `t_user` 表的 `uid` 列
);

-- 添加 sid 列
ALTER TABLE `t_teaminfo`
ADD COLUMN `sid` INT NOT NULL;

-- 添加外键约束
ALTER TABLE `t_teaminfo`
ADD CONSTRAINT `fk_t_teaminfo_sid`
FOREIGN KEY (`sid`) REFERENCES `t_sportname` (`sid`);
```



* ##### 表结构：`t_teammember`

  - `uid`: 用户的唯一标识，外键关联到 `t_user` 表的 `uid` 列。
  - `tid`: 队伍的唯一标识，外键关联到 `t_teaminfo` 表的 `tid` 列。
  - `sid`: 运动项目的唯一标识，外键关联到 `t_sport` 表的 `sid` 列。
  - `mstatus`: 成员状态，整数类型。

* ##### 说明：

  1. **主键**：使用复合主键 `(uid, tid, sid)`，确保每个用户在每个队伍中只能参与一个运动项目。
  2. **外键**：
     - `uid` 关联到 `t_user` 表的 `uid` 列。
     - `tid` 关联到 `t_teaminfo` 表的 `tid` 列。
     - `sid` 关联到 `t_sport` 表的 `sid` 列。
  3. **成员状态**：`mstatus` 使用 `INT` 类型，用于存储成员的状态。

```sql
CREATE TABLE `t_teammember` (
    `uid` INT NOT NULL, -- 用户的唯一标识
    `tid` INT NOT NULL, -- 队伍的唯一标识
    `sid` INT NOT NULL, -- 运动项目的唯一标识
    `mstatus` INT,      -- 成员状态
    PRIMARY KEY (`uid`, `tid`, `sid`), -- 复合主键
    FOREIGN KEY (`uid`) REFERENCES `t_user`(`uid`), -- 外键关联到 t_user 表
    FOREIGN KEY (`tid`) REFERENCES `t_teaminfo`(`tid`), -- 外键关联到 t_teaminfo 表
    FOREIGN KEY (`sid`) REFERENCES `t_sportname`(`sid`) -- 外键关联到 t_sport 表
);
```

