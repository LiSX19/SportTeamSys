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

![概念图1](img\概念图1.png)

![概念图2](img\概念图2.png)



## 4. 数据库设计


### ER图：

![ER图](img\ER图.png)

### 关系模式：

* ##### 用户信息表（<u>用户id</u>、登录密码、头像、昵称、性别、生日、联系方式）

```sql
CREATE TABLE 用户信息表 (
    用户id INT AUTO_INCREMENT PRIMARY KEY,  -- 用户ID，自增主键
    登录密码 VARCHAR(255) NOT NULL,        -- 登录密码，非空
    头像 VARCHAR(255),                     -- 头像路径，可以为空
    昵称 VARCHAR(50) NOT NULL,             -- 昵称，非空
    性别 ENUM('男', '女', '其他') NOT NULL, -- 性别，枚举类型，非空
    生日 DATE,                             -- 生日，可以为空
    联系方式 VARCHAR(20)                   -- 联系方式，可以为空
);
```



* ##### 运动种类表（<u>运动名称</u>、运动分类、是否有氧）

```sql
CREATE TABLE sportname (
    id INT AUTO_INCREMENT PRIMARY KEY,
    运动名称 VARCHAR(255) NOT NULL,
    运动类型 VARCHAR(255) NOT NULL,
    是否有氧 TINYINT
);
```



* ##### 队伍信息表（<u>组队id</u>、发起人、运动时间、运动水平、运动地点、开幕开始时间、招募截止时间、已报人数、需求人数、招募状态）

```sql
CREATE TABLE 队伍信息表 (
    队伍编号 INT AUTO_INCREMENT PRIMARY KEY,  -- 队伍编号，自增主键
    发起人 VARCHAR(255) NOT NULL,          -- 发起人，非空
    运动时间 DATETIME NOT NULL,            -- 运动时间，非空
    运动水平 TINYINT CHECK (运动水平 BETWEEN 0 AND 5),  -- 运动水平，范围0-5
    运动地点 VARCHAR(255) NOT NULL,        -- 运动地点，非空
    开始时间 DATETIME NOT NULL,            -- 开始时间，非空
    招募截止时间 DATETIME NOT NULL,        -- 招募截止时间，非空
    已报人数 INT DEFAULT 0,                -- 已报人数，默认为0
    需求人数 INT NOT NULL,                 -- 需求人数，非空
    招募状态 TINYINT CHECK (招募状态 BETWEEN 0 AND 7)  -- 招募状态，范围0-7
);
```



* ##### 报名状态表（<u>队伍编号</u>、<u>用户id</u>、组队状态）

```sql
CREATE TABLE 报名状态表 (
    队伍编号 INT NOT NULL,  -- 队伍编号，外键关联队伍信息表
    用户id INT NOT NULL,    -- 用户id，外键关联用户信息表
    组队状态 TINYINT CHECK (组队状态 BETWEEN 0 AND 5),  -- 组队状态，范围0-5
    PRIMARY KEY (队伍编号, 用户id),  -- 复合主键，确保每个用户对每个队伍的报名状态唯一
    FOREIGN KEY (队伍编号) REFERENCES 队伍信息表(队伍编号),  -- 外键约束，关联队伍信息表
    FOREIGN KEY (用户id) REFERENCES 用户信息表(用户id)  -- 外键约束，关联用户信息表
);
```

