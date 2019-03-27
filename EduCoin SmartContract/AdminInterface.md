## 1.查看管理员中央账户

用户标识符 email : centralbank@email.com

用户余额 accountBalance : 0

总共发行课程币数量 totalIssueToken: 0

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/CentralBank'

GET Response：
[
  {
    "$class": "token.CentralBank",
    "totalIssueToken": 222,
    "email": "centralbank@email.com",
    "accountBalance": 0.1065
  }
]
```



## 2.管理员查看待审核的用户充值记录

使用query，请求url GetUserTokenRechargeN。

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/queries/GetUserTokenRechargeN'

GET Response（按照tokenRechargeID升序排列）：

[
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "recharge3",  //充值ID
    "confirmBank": "N", //充值审核状态
    "tokenNum": 10.2,
    "user": "resource:token.User#user1@email.com"
  },
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "recharge4",
    "confirmBank": "N",
    "tokenNum": 150,
    "user": "resource:token.User#user1@email.com"
  },
```





## 3.1管理员确认用户的线下账户已经付钱：用户课程币增加 & 管理员中央账户发行课程币总量增加。（同意）

```
POST  Parameters：
{
  "$class": "token.CheckUserRecharge",
  "rechargeID": "resource:token.UserTokenRecharge#recharge4" //用户请求充值ID
}	

Curl:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "$class": "token.CheckUserRecharge", \ 
   "rechargeID": "resource:token.UserTokenRecharge#recharge4" \ 
 }	' 'http://IP:3040/api/CheckUserRecharge'
```



## 3.2管理员拒绝用户充值请求：用户充值请求（asset）的充值审核状态变成R （拒绝）

```
POST  Parameters：
{
  "$class": "token.RejectUserRecharge",
  "rechargeID": "resource:token.UserTokenRecharge#recharge2"
}

Curl:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "$class": "token.RejectUserRecharge", \ 
   "rechargeID": "resource:token.UserTokenRecharge#recharge2" \ 
 }' 'http://IP:3040/api/RejectUserRecharge'
```



## 3.3  查看管理员已经审核的用户充值记录

使用query，请求url GetUserTokenRechargeY。返回"confirmBank"字段为"Y"的已审核的用户充值请求。

```
Curl:

http://IP:3040/api/queries/GetUserTokenRechargeY

GET Response（按照tokenRechargeID升序排列）：

[
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "recharge1",
    "confirmBank": "Y",
    "tokenNum": 222,
    "user": "resource:token.User#user1@email.com"
  },
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "recharge4",
    "confirmBank": "Y",
    "tokenNum": 150,
    "user": "resource:token.User#user1@email.com"
  }
]
```



## 3.4 查看管理员已经拒绝的用户充值记录

使用query，请求url GetUserTokenRechargeR。返回"confirmBank"字段为"R"的已拒绝的用户充值请求。

```
Curl:

http://IP:3040/api/queries/GetUserTokenRechargeY

GET Response（按照tokenRechargeID升序排列）：

[
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "recharge2",
    "confirmBank": "R",
    "tokenNum": 12,
    "user": "resource:token.User#user1@email.com"
  }
]
```

## 3.5 查看管理员同意用户充值请求的操作时间

请求参数为“rechargeID”:用户充值请求ID。

使用了filter :  {"where": {"rechargeID": "resource:token.UserTokenRecharge#recharge4"}}

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/CheckUserRecharge?filter=%7B%22where%22%3A%20%7B%22rechargeID%22%3A%20%22resource%3Atoken.UserTokenRecharge%23recharge4%22%7D%7D'
 
 注意这里的参数要加上class!!
 
GET Response：
[
  {
    "$class": "token.CheckUserRecharge",
    "logs": [],
    "rechargeID": "resource:token.UserTokenRecharge#recharge4",
    "transactionId": "0ae6ee0d79a8f7c7a3268168f71e6dc5978e4e7c6e23b82c3e38a75669bbd7eb",
    "timestamp": "2018-09-05T07:06:22.391Z"  //管理员同意的时间
  }
]
```



## 3.6 查看管理员拒绝用户充值请求的操作时间

请求参数为“rechargeID”: 用户充值请求ID。

使用了filter :  {"where": {"rechargeID": "resource:token.UserTokenRecharge#recharge2"}}

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/RejectUserRecharge?filter=%7B%22where%22%3A%20%7B%22rechargeID%22%3A%20%22resource%3Atoken.UserTokenRecharge%23recharge2%22%7D%7D'
 
 注意这里的参数要加上class!!
 
GET Response：
[
{
    "$class": "token.RejectUserRecharge",
    "logs": [],
    "rechargeID": "resource:token.UserTokenRecharge#recharge2",   //充值请求ID
    "transactionId": "6472c5990a20efa437f3ed1b01eeda3a4608a40b2931fac9582d5553a6f9edaf",
    "timestamp": "2018-09-05T07:09:20.842Z"   //管理员拒绝充值请求的时间
  }
]
```



## 4.查看权益分配合约

权益分配ID  contractID :  contract@mooc

分配给平台的百分比 platformPer : 0.003
分配给服务提供商的百分比 companyPer:  0.997

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/Contract'

GET Response：
[
  {
    "$class": "token.Contract",
    "contractID": "contract@mooc",
    "platformPer": 0.003,
    "companyPer": 0.997
  }
]
```

