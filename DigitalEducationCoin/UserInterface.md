## 1.1查询用户余额

用户标识符 email : test1@qq.com

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/User/test1%40qq.com'


GET Responses：

{
    "$class": "token.Company",
    "email": " test1@qq.com",
    "accountBalance": 2296.5
  }
```





## 1.2用户查看已购买服务记录

1.列表：按照时间先后 ，显示"消费服务ID" 和"时间"。

使用query，请求url 为GetUserConsumeServiceU。

```
Parameters：

user的值是 resource:token.User#test@qq.com  //注意这里的参数需要加上class!!

Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/queries/GetUserConsumeServiceU?user=resource%3Atoken.User%23test1%40qq.com'

GET Response（按照timestamp从前到后升序排列）：

[
  {
    "$class": "token.UserConsumeService",
    "logs": [],
    "serviceID": "resource:token.Service#service1@mooc",
    "user": "resource:token.User#test1@qq.com",
    "transactionId": "f091e301bee8bdf158d4750b20c7f5cfebec7944dee0c4bb9e3677b3cbeec68d",
    "timestamp": "2018-10-09T10:22:04.950Z"
  }
]
```



2.点开某一个"消费服务ID" 和"时间"，可以看到"消费服务ID"的具体内容。

服务标识符 serviceID:  service1@mooc

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/Service/service2%40mooc'

GET Responses：

{
  "$class": "token.Service",
  "serviceID": "service1@mooc",
  "serviceName": "高数课程",
  "servicePrice": 35.5,
  "company": "resource:token.Company#mooc@email.com"
}
```

"消费服务ID"的具体内容包括：服务名称、服务价格、服务提供商



## 2.1用户充值：用户提出一个充值请求

功能描述：输入充值金额，提交，alert 充值成功。

需要提交的参数：

用户ID email :  user1@email.com
充值金额 tokenNum:  150
充值记录的ID rechargeID :  recharge4

```
POST Jason Parameters：
{
  "$class": "token.UserRecharge",
  "tokenNum": 150,  
  "rechargeID": "recharge4",   
  "user": "resource:token.User#user1@email.com"  ### 注意加上class!
}

Curl:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "$class": "token.UserRecharge", \ 
   "tokenNum": 150,   \ 
   "rechargeID": "recharge4",    \ 
   "user": "resource:token.User#user1%40email.com"   \ 
 }' 'http://IP:3040/api/UserRecharge'
```



## 2.2用户查看充值记录

1.查看用户**已审核通过的充值请求**的记录



1.1 列表：按照"充值ID "的升序 ，显示"充值ID" 、"充值金额"。

使用query，请求url 为GetUserTokenRechargeUserY    

```
Parameters：

user的值是 resource:token.User#test1@qq.com  //注意这里的参数需要加上class!!

Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/queries/GetUserTokenRechargeUserY?user=resource%3Atoken.User%23test1%40qq.com'

GET Response（按照"充值ID "从字符顺序小到大升序排列）：

[
  {
    "$class": "token.UserTokenRecharge",
    "tokenRechargeID": "rid1539080496412",
    "confirmBank": "Y",
    "tokenNum": 1001,
    "user": "resource:token.User#test1@qq.com"
  }
]
```



1.2  点开某一个"充值ID" ，查看"提出充值请求的时间"。

使用了filter :  {"where": {"rechargeID": "rid1539080496412"}}

上面得到的 "tokenRechargeID": "recharge1"，作为rechargeID的请求参数。

```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/UserRecharge?filter=%7B%22where%22%3A%20%7B%22rechargeID%22%3A%20%22rid1539080496412%22%7D%7D'

GET Responses：

[
  {
    "$class": "token.UserRecharge",
    "logs": [],
    "tokenNum": 1001,
    "rechargeID": "rid1539080496412",
    "user": "resource:token.User#test1@qq.com",
    "transactionId": "877cd85e35eed6a49370581d910f9b17ad86b19ba8b8f7f0181e51a663ca0162",
    "timestamp": "2018-10-09T10:21:36.479Z"
  }
]
```

 "timestamp"代表了"用户提出充值请求的时间"。



## 4.1用户提现：用户提出一个提现请求

//TODO



## 5.1用户转账：用户提出一个转账请求

功能描述：输入转账金额，转账地址，提交，alert 转账成功。

需要提交的参数：

用户ID from:   resource:token.User#test2@qq.com

(需要加上class参数)

转账ID to :   resource:token.User#test@qq.com



转账金额 transferNum:  11.4



转账记录的ID transferID:  tf12

```
POST Jason Parameters：
{
  "$class": "token.TokenTransferU_U",
  "transferNum": 11.4,
  "transferID": "tf12",
  "fromuser": "resource:token.User#test2@qq.com",
  "to": "resource:token.User#test@qq.com"
}

Curl:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "$class": "token.TokenTransferU_U", \ 
   "transferNum": 11.4, \ 
   "transferID": "tf12", \ 
   "fromuser": "resource:token.User#test2%40qq.com", \ 
   "to": "resource:token.User#test%40qq.com" \ 
 }' 'http://IP:3040/api/TokenTransferU_U'
```



## 5.2用户查看转账记录

1.查看用户**成功转账**的记录



1.1 列表：按照"转账时间 "的升序 ，显示"转账ID" 、"转账金额"、"转账地址"。

使用query，请求url 为GetUserTokenTransferU_U   

```
Parameters：

fromuser 的值是 resource:token.User#test2@qq.com  //注意这里的参数需要加上class!!

Curl:

http://IP:3040/api/queries/GetUserTokenTransferU_U?fromuser=resource%3Atoken.User%23test2%40qq.com

GET Response（按照"时间戳 timestamp"从字符顺序小到大升序排列）：

[
  {
    "$class": "token.TokenTransferU_U",
    "logs": [],
    "transferNum": 11.4,
    "transferID": "tf12",
    "fromuser": "resource:token.User#test2@qq.com",
    "to": "resource:token.User#test@qq.com",
    "transactionId": "3079aa6f0fa9cecb9d131d9db6dc5a422fe266bc85a5729e506279f21de22ead",
    "timestamp": "2018-10-12T03:48:27.957Z"
  }
]
```





## 6.1获取服务列表

服务标识符 serviceID : service1@mooc
服务名称 serviceName : 微积分课程
服务价格 servicePrice : 25.5
服务提供商 company: resource:token.Company#mooc@email.com



```
Curl:

curl -X GET --header 'Accept: application/json' 'http://IP:3040/api/Service'


GET Responses：

[
  {
    "$class": "token.Service",
    "serviceID": "service1@mooc",
    "serviceName": "微积分课程",
    "servicePrice": 25.5,
    "company": "resource:token.Company#mooc@email.com" 
  },
  {
    "$class": "token.Service",
    "serviceID": "service2@mooc",
    "serviceName": "高数课程",
    "servicePrice": 35.5,
    "company": "resource:token.Company#mooc@email.com"
  },
```

## 6.2获取用户已购买服务列表

见1.2

## 6.3用户购买服务

功能描述：点击选项，用户确认购买

服务标识符 serviceID : service2@mooc
用户标识符 user : user1@email.com



```
POST  Parameters：

{
  "$class": "token.UserConsumeService",
  "serviceID": "service2@mooc",
  "user": "resource:token.User#user1@email.com"
}

Curl:

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{ \ 
   "$class": "token.UserConsumeService", \ 
   "serviceID": "service2%40mooc", \ 
   "user": "resource:token.User#user1%40email.com" \ 
 }' 'http://IP:3040/api/UserConsumeService'
```







