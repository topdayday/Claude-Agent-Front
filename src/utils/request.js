import axios from "axios";
import { MessageBox } from "element-ui";

// Create axios instance with timeout
const instance = axios.create({
    timeout: 600000, //  60 seconds timeout
});

let server_url = '/'
// server_url = 'http://127.0.0.1:8000/';
let base_url = server_url + 'cnaude';

export function login_out() {
    localStorage.removeItem('token');
    localStorage.removeItem('session_id');
    location.reload(true);
}

export function get_captcha() {
    return instance({
        method: 'POST',
        url: base_url+'/get_captcha/',
        data: {},
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
    .then(response => {
        if(response.data.code===0){
            return response.data.data;
        }else{
            MessageBox.alert('请求失败(get_captcha)','提示')
        }
    }).catch(()=>{
            MessageBox.alert('发送请求图片验证码失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function member_login(loginData) {
    return instance({
        method: 'POST',
        url:base_url+'/login/',
        data: {
            login_name:loginData.username,
            password:loginData.password,
            captcha:loginData.captcha,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('发送登录请求失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function member_register(loginData) {
    return instance({
        method: 'POST',
        url: base_url+'/register/',
        data: {
            login_name:loginData.username,
            password:loginData.password,
            captcha:loginData.captcha,
            invite_code:loginData.invite_code,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            }
            else if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('发送注册请求失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function list_session(token,session_id) {
    return instance({
        method: 'POST',
        url:base_url+'/list_session/',
        data: {
            token:token,
            session_id:session_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            } else  if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            MessageBox.alert('请求历史数据失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function assistant(token,session_id, content_in,model_type) {
    return instance({
        method: 'POST',
        url: base_url+'/assistant/',
        data: {
            token:token,
            session_id:session_id,
            content_in:content_in,
            model_type:model_type,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            } else   if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
                return '';
            }
        }).catch(()=>{
            MessageBox.alert('发送请求失败,请联系管理员！','提示')
            throw new Error('请求失败'); // 如果需要，可以在这里抛出一个错误
        });
}



export function latest_session(token,page_number) {
    return instance({
        method: 'POST',
        url: base_url+'/latest_session/',
        data: {
            token:token,
            page_number:page_number,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
    .then(response => {
        if(response.data.code===-1){
            MessageBox.alert( response.data.data,'提示');
            login_out();
        } else  if(response.data.code===0){
            return response.data.data;
        }else if(response.data.code===1){
            MessageBox.alert( response.data.data,'提示');
        }
    }).catch(()=>{
            MessageBox.alert('请求查找当前会话失败,请联系管理员！','提示')
            throw new Error('请求失败');
    });
}



export function del_conversation(token,c_id) {
    return instance({
        method: 'POST',
        url:base_url+'/del_conversation/',
        data: {
            token:token,
            c_id:c_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
    .then(response => {
        if(response.data.code===-1){
            login_out();
            MessageBox.alert( response.data.data,'提示');
        } else   if(response.data.code===0){
            return response.data.data;
        }else if(response.data.code===1){
            MessageBox.alert( response.data.data);
        }
    }).catch(()=>{
        MessageBox.alert('请求删除对话失败,请联系管理员！','提示')
        throw new Error('请求失败');
    });
}



export function del_session(token,session_id) {
    return instance({
        method: 'POST',
        url:base_url+'/del_session/',
        data: {
            token:token,
            session_id:session_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                login_out();
                MessageBox.alert( response.data.data,'提示');
            } else   if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data);
            }
        }).catch(()=>{
            MessageBox.alert('请求删除会话失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function generate_session(token) {
    return instance({
        method: 'POST',
        url: base_url+'/generate_session/',
        data: {
            token:token,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            } else   if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('请求新会话失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}



export function member_info(token) {
    return instance({
        method: 'POST',
        url: base_url+'/member_info/',
        data: {
            token:token,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            } else   if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('请求用户信息失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}


export function member_edit(token,loginData) {
    return instance({
        method: 'POST',
        url:base_url+'/member_edit/',
        data: {
            token:token,
            new_password:loginData.new_password,
            password:loginData.password,
            mobile:loginData.mobile,
            email:loginData.email,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===-1){
                MessageBox.alert( response.data.data,'提示');
                login_out();
            } else   if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('修改用户资料失败,请联系管理员！','提示')
            throw new Error('请求失败');
        });
}

export function list_llm() {
    return instance({
        method: 'POST',
        url:base_url+'/list_llm/',
        data: {
          
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                MessageBox.alert( response.data.data,'提示');
            }
        }).catch(()=>{
            MessageBox.alert('获取模型列表失败,请联系管理员！','提示')
            throw new Error('获取模型列表失败');
        });
}