<template>
    <div id="login">
       <div class="login-wrap">
           <ul class="menu-tab">
               <li :class="{'current':item.current}" v-for="(item,index) in menuTab" :key="index" @click="toggleMneu(item)">{{item.txt}}</li>
           </ul>
           <!-- 表单 start -->
           <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="medium">

                <el-form-item  prop="username" class="item-from">
                    <label>邮箱</label>
                    <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
                </el-form-item>

                <el-form-item  prop="password" class="item-from">
                    <label>密码</label>
                    <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="passwords" class="item-from" v-show="model ==='register' ">
                    <label>重复密码</label>
                    <el-input type="text" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
                </el-form-item>

                <el-form-item  prop="code" class="item-from">
                    <label>验证码</label>
                    <el-row :gutter="11">
                        <el-col :span="15">
                            <el-input v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                        </el-col>
                        <el-col :span="9">
                            <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status">{{codeButtonStatus.text}}</el-button>
                        </el-col>
                    </el-row>
                </el-form-item>

                <el-form-item>
                    <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block" :disabled="loginButtonStatus">{{model==="login" ?"登录" : "注册"}}</el-button>
                </el-form-item>
            </el-form>
       </div>
    </div>
</template>
<script>
import sha1 from "js-sha1";
 import {GetSms,Register,Login} from "@/api/login"
 import {reactive,ref,onMounted} from "@vue/composition-api"
 import { stripscript,calidateEmail,calidatePassword,calidatecode } from "@/utils/validate";
export default {
    name:"login",
    setup(props,context){
        let checkAge = (rule, value, callback) => {
        //过滤后的数据
        ruleForm.code = stripscript(value)
        value = ruleForm.code 
        if (value === '') {
          return callback(new Error('验证码不能为空'));
        }else if(!calidatecode(value)){
          return callback(new Error('格式错误'));
        }else{
          callback();  
        }
      };
      //验证用户名为邮箱
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(!calidateEmail(value)){
            callback(new Error('用户名格式错误'));
        }else{
          callback();
        }
      };
      //验证密码
      let validatePassword = (rule, value, callback) => {
        //过滤后的数据
        ruleForm.password = stripscript(value)
        value = ruleForm.password
      
        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (!calidatePassword(value)) {
          callback(new Error('密码为6~20位'));
        } else {
          callback();
        }
      };
      /*
      *声明数据
      */
       
      //这里面放置data数据·生命周期·自定义的函数
        const menuTab = reactive([
              {txt:"登录",current:true,type:"login"},
              {txt:"注册",current:false,type:"register"}
          ])
          //模块值
          const model = ref("login")
          //登录按钮禁用状态
          const loginButtonStatus = ref(true);
          //验证码按钮状态
          const codeButtonStatus = reactive({
             status:false,
             text:"获取验证码",
          });
          //倒计时变量
          const timer = ref(null);
          //表单绑定数据
          const ruleForm = reactive({
          username: '',
          password: '',
          passwords:'',
          code: ''
          })
          //表单的验证
          const rules = reactive({
          username: [
            { validator: validateUsername, trigger: 'blur' }
          ],
          password: [
            { validator: validatePassword, trigger: 'blur' }
          ],
          passwords: [
            { validator: validatePasswords, trigger: 'blur' }
          ],
          code: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }) 
         //验证重复密码
       let validatePasswords = (rule, value, callback) => {
        //如果模块值为login的时候直接通过
        if(model.value === "login"){callback();}
        //过滤后的数据
        ruleForm.passwords = stripscript(value)
        value = ruleForm.passwords
      
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value != this.ruleForm.password) {
          callback(new Error('密码不一致'));
        } else {
          callback();
        }
      };
          /*
          * 声明函数
          */
        /*
        *获取验证码
        */
         const getSms = (()=>{
           //提示
           if(ruleForm.username == ""){
              context.root.$message.error("邮箱不能为空!!");
             return false
           }
          /* if(calidateEmail(ruleForm.username)){
             context.root.$message.error("邮箱格式错误!!");
             return false
           }*/
           //获取验证码
           let requestData = {
            username:ruleForm.username,
            module: model.value
           };
           //修改获取验证码按钮状态
           codeButtonStatus.status= true;
           codeButtonStatus.text= "发送中";
           GetSms(requestData).then(res => {
             let data = res.data;
                context.root.$message({
                  message:data.message,
                  type:"success"
                })
                //启用登录或注册按钮
                loginButtonStatus.value = false;
                //倒计时
                countDown(60);
               
           }).catch(err => {
             
           })
         });
         //切换模块
          const  toggleMneu = (item =>{
            
            menuTab.forEach(item=>{
               item.current = false;
           }) 
           //高光
           item.current=true;
           //修改模块值
           model.value = item.type
           resetFromData();
           clearCountDown();
          });
          //清除表单数据
          const resetFromData = (()=>{
             //重置表单
           context.refs["ruleForm"].resetFields();
          })
           /*
         *提交表单
         */
        const submitForm = (formName =>{
          
           context.refs[formName].validate((valid) => {
            //表单验证通过
            if (valid) {
              if(model.value === "login"){
                login()
              }else{
                register()
              }
          } else {
            
            return false;
          }
        });
        }) 
        /*
        *登录
        */
      const login = (()=>{
        let data = {
          username:ruleForm.username,
          password:sha1(ruleForm.password),
          code:ruleForm.code,
        }
         context.root.$store.dispatch("app/login",data).then(response =>{
              context.root.$router.push({
                 name:"console",
              });
         }).catch(error =>{

         })
        //  Login(data).then(response=>{
        //    //登录成功
        //   console.log(response)
        //   context.root.$router.push({
        //     name:"console",
        //   });
        //  }).catch(error=>{

        //  })
       })
       /*
       *注册
       */
        const register = (()=>{
            let data ={
               username:ruleForm.username,
               password:sha1(ruleForm.password),
               code:ruleForm.code,
               model:"register"
             }
             //注册接口
             Register(data).then(response=>{
                 let data = response.data
                 context.root.$message({
                   message:data.message,
                   type:"success"
                 })
               //模拟注册成功
                toggleMneu(menuTab[0])
                clearCountDown();
             }).catch(error=>{
               //失败执行的代码
             })
        })
        /*
        *倒计时
        */
         const countDown = ((number)=>{
           //判断定时器是否存在，存在则清除
           if(timer.value){clearInterval(timer.value)}
           let time = number;
            timer.value = setInterval(()=>{
              time--
              
              if(time === 0){
                clearInterval(timer.value);
                 codeButtonStatus.status= true;
                 codeButtonStatus.text= "再次获取";
              }else{
                 codeButtonStatus.text= `倒计时${time}秒`
              }
             
             },1000)
         })
         /*
         *清除倒计时
         */
         const clearCountDown = (()=>{
           //还原验证码按钮默认状态
            codeButtonStatus.status = false
            codeButtonStatus.text = "获取验证码"
            //清除定时器
            clearInterval(timer.value);
            });
         /*
         *生命周期
         */
        //挂在完成后
        onMounted(()=>{
          
        })
        return {
          menuTab,
          model,
          toggleMneu,
          submitForm,
          ruleForm,
          rules,
          getSms,
          loginButtonStatus,
          codeButtonStatus
        }
    },
}
</script>
<style lang="scss" scoped>
#login{
    height:100vh;
    background-color:#344a5f;
}
.login-wrap{
    width:330px;
    margin:auto;
}
.menu-tab{
    text-align:center;
    li{
        display:inline-block;
        width:88px;
        line-height:36px;
        font-size:14px;
        color:#fff;
        border-radius:2px;
        cursor:pointer;
    }
    .current{
        background-color:rgba(0,0,0,.1);
    }
}
.login-form{
    margin-top:29px;
    label{
        display:block;
        margin-bottom:3px;
        font-size:14px;
        color:#fff;
    }
    .item-from{
        margin-bottom:13px;
    }
    .block{
        display:block;
        width:100%;
    }
    .login-btn{margin-top:19px;}
}
</style>