import axios from "axios";
let server_url = '/'
// server_url = 'http://192.168.8.48:8000/';
let base_url = server_url + 'cnaude';
export function get_captcha() {
    return axios({
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
            alert('请求失败(get_captcha)')
        }
    }).catch(()=>{
            alert('发送请求图片验证码失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function member_login(loginData) {
    return axios({
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
                 alert( response.data.data);
            }
        }).catch(()=>{
            alert('发送登录请求失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function member_register(loginData) {
    return axios({
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
            if(response.data.code===0){
                alert( response.data.data);
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('发送注册请求失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function list_session(token,session_id) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('请求历史数据失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function assistant(token,session_id, content_in,model_type) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('发送请求失败,请联系管理员！')
            throw new Error('请求失败'); // 如果需要，可以在这里抛出一个错误
        });
}



export function latest_session(token) {
    return axios({
        method: 'POST',
        url: base_url+'/latest_session/',
        data: {
            token:token,
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
            alert( response.data.data);
        }
    }).catch(()=>{
            alert('请求查找当前会话失败,请联系管理员！')
            throw new Error('请求失败');
    });
}



export function del_session(token,session_id) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('请求删除会话失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function generate_session(token) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('请求新会话失败,请联系管理员！')
            throw new Error('请求失败');
        });
}



export function member_info(token) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('请求用户信息失败,请联系管理员！')
            throw new Error('请求失败');
        });
}


export function member_edit(token,loginData) {
    return axios({
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
            if(response.data.code===0){
                return response.data.data;
            }else if(response.data.code===1){
                alert( response.data.data);
            }
        }).catch(()=>{
            alert('修改用户资料失败,请联系管理员！')
            throw new Error('请求失败');
        });
}
