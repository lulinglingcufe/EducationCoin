# EduCoin
This tutorial hasn't been complete yet, we will finish it recently. Thank you for your interest : )



EduCoin is a demo of enterprise-class application build on top of Fabric. It serves as a good guide to learn Hyperledger Fabric, Composer and Caliper development. The experiment results demonstrate the performance and bottlenecks of Fabric applications.

# EduCoin Bussiness Network Entities

​                  



# EduCoin Smart Contract

First We describe the EduCoin Smart Contract based on Hyperledger Composer and explain how to deploy it in a single machine.

##### The experimental environment requires:

- docker
- docker-compose 

Because Fabric peer nodes can run as docker containers. Employing docker technology, we are able to reduce the deployment cost.  If you are not familiar with docker, you can go through this guide,  and Google for problems meet or leave the questions in the **issues** section of this Github repository , we will give you feedback if possible.

Two commands are useful:

```
docker stop $(docker ps -a -q) //stop all the containers
docker rm $(docker ps -a -q)   //delete all the containers
```

### Basic knowledge of Composer

If you want to learn about the chaincode language of Hyperledger Composer, we recommend you go through the guides of Composer. This is the github repository URL of [Composer](https://github.com/hyperledger/composer) . And in the **Getting started with building an application** section we have:

- [Introduction](https://hyperledger.github.io/composer/latest/introduction/introduction.html)
- [Introduction Video](https://www.youtube.com/watch?v=fdFUsrsv5iw&t=23s)
- [Quick Start](https://hyperledger.github.io/composer/latest/installing/installing-index.html)
- [Tutorials](https://hyperledger.github.io/composer/latest/tutorials/tutorials.html)

These guide links are very useful to understand Composer. Note that, for Chinese users, if you want to watch the videos in YouTube and use the **[composer playground](https://composer-playground.mybluemix.net/)**,  you should solve the Great Firewall problem .

##### Foucus on learning Comoser smart contract & Our guide

Because we use docker in the whole experiment, we don't need to install npm packages like *composer-cli@0.20* and *composer-rest-server@0.20* introduced in **[Installing the development environment for composer](https://hyperledger.github.io/composer/latest/installing/development-tools.html/)**. We also prepare a **guide** for you to focus on [learning the composer smart contract language](https://github.com/lulinglingcufe/LearnComposer).





1. The caliper directory contains strcipt to test the performance of ecucation coin network.
2. The DigitalEducationCoin directory contains composer smart contract for ecucation coin.
3. The Hitchhiker directory contains strcipt to run docker container to benchmark the composer-rest-server,  which offer RESTful Apis for  ecucation coin network.

