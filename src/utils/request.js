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
        url: base_url + '/get_captcha/',
        data: {},
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === 0) {
                return response.data.data;
            } else {
                MessageBox.alert('请求失败(get_captcha)', '提示')
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('发送请求图片验证码失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function member_login(loginData) {
    return instance({
        method: 'POST',
        url: base_url + '/login/',
        data: {
            login_name: loginData.username,
            password: loginData.password,
            captcha: loginData.captcha,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('发送登录请求失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function member_register(loginData) {
    return instance({
        method: 'POST',
        url: base_url + '/register/',
        data: {
            login_name: loginData.username,
            password: loginData.password,
            captcha: loginData.captcha,
            invite_code: loginData.invite_code,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            }
            else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('发送注册请求失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function list_session(token, session_id) {
    return instance({
        method: 'POST',
        url: base_url + '/list_session/',
        data: {
            token: token,
            session_id: session_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data;
            } else if (response.data.code === 1) {
                alert(response.data);
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求历史数据失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function assistant(token, session_id, content_in, model_type) {
    return instance({
        method: 'POST',
        url: base_url + '/assistant/',
        data: {
            token: token,
            session_id: session_id,
            content_in: content_in,
            model_type: model_type,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
                return '';
            }
        }).catch((e) => {
            console.error(e);
            if (e.status === 524) {
                return null;
                // MessageBox.alert('发送请求超时,请稍后刷新页面查看！','提示')
            } else {
                MessageBox.alert('发送请求失败,请联系管理员！', '提示')
                throw new Error('请求失败'); // 如果需要，可以在这里抛出一个错误
            }
        });
}



export function latest_session(token, page_number, filter_date) {
    return instance({
        method: 'POST',
        url: base_url + '/latest_session/',
        data: {
            token: token,
            page_number: page_number,
            filter_date: filter_date,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求查找当前会话失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}



export function del_conversation(token, c_id) {
    return instance({
        method: 'POST',
        url: base_url + '/del_conversation/',
        data: {
            token: token,
            c_id: c_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                login_out();
                MessageBox.alert(response.data.data, '提示');
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data);
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求删除对话失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}



export function del_session(token, session_id) {
    return instance({
        method: 'POST',
        url: base_url + '/del_session/',
        data: {
            token: token,
            session_id: session_id,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                login_out();
                MessageBox.alert(response.data.data, '提示');
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data);
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求删除会话失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function generate_session(token) {
    return instance({
        method: 'POST',
        url: base_url + '/generate_session/',
        data: {
            token: token,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求新会话失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}



export function member_info(token) {
    return instance({
        method: 'POST',
        url: base_url + '/member_info/',
        data: {
            token: token,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('请求用户信息失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}


export function member_edit(token, loginData) {
    return instance({
        method: 'POST',
        url: base_url + '/member_edit/',
        data: {
            token: token,
            new_password: loginData.new_password,
            password: loginData.password,
            mobile: loginData.mobile,
            email: loginData.email,
        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('修改用户资料失败,请联系管理员！', '提示')
            throw new Error('请求失败');
        });
}

export function list_llm() {
    return instance({
        method: 'POST',
        url: base_url + '/list_llm/',
        data: {

        },
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === 0) {
                return response.data.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
            }
        }).catch((e) => {
            console.error(e);
            MessageBox.alert('获取模型列表失败,请联系管理员！', '提示')
            throw new Error('获取模型列表失败');
        });
}

export function assistant_with_attachments(token, session_id, content_in, model_type, attachments) {
    // 创建FormData对象
    const formData = new FormData();
    formData.append('token', token);
    formData.append('session_id', session_id);
    formData.append('content', content_in);
    formData.append('model_type', model_type);

    // 添加附件到FormData
    if (attachments) {
        attachments.forEach((file) => {
            formData.append('attachments', file);
        });
    }


    return instance({
        method: 'POST',
        url: base_url + '/assistant_with_attachments/',
        data: formData,
        headers: {
            'Authorization': 'Bearer Auction'
        }
    })
        .then(response => {
            if (response.data.code === -1) {
                MessageBox.alert(response.data.data, '提示');
                login_out();
            } else if (response.data.code === 0) {
                return response.data;
            } else if (response.data.code === 1) {
                MessageBox.alert(response.data.data, '提示');
                return '';
            }
        }).catch((e) => {
            console.error(e);
            if (e.status === 524) {
                return null;
            } else {
                MessageBox.alert('发送附件请求失败,请联系管理员！', '提示')
                throw new Error('请求失败');
            }
        });
}


// 检查是否为图片类型
function isImageFile(mimeType, fileName) {
    // 通过MIME类型检查
    if (mimeType && mimeType.startsWith('image/')) {
        return true;
    }
    
    // 通过文件扩展名检查
    if (fileName) {
        const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
        const ext = fileName.toLowerCase().substring(fileName.lastIndexOf('.'));
        return imageExtensions.includes(ext);
    }
    
    return false;
}

// 创建图片预览弹窗
function showImagePreview(imageUrl, fileName) {
    // 创建遮罩层
    const overlay = document.createElement('div');
    console.log('==========>>>')
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 9999;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
    `;
    
    // 创建图片容器
    const container = document.createElement('div');
    container.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        position: relative;
        background: white;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    `;
    
    // 创建关闭按钮
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '×';
    closeBtn.style.cssText = `
        position: absolute;
        top: 10px;
        right: 15px;
        background: none;
        border: none;
        font-size: 24px;
        cursor: pointer;
        color: #666;
        z-index: 10000;
    `;
    
    // 创建文件名标题
    const title = document.createElement('div');
    title.textContent = fileName || '图片预览';
    title.style.cssText = `
        text-align: center;
        margin-bottom: 15px;
        font-weight: bold;
        color: #333;
    `;
    
    // 创建图片元素
    const img = document.createElement('img');
    img.src = imageUrl;
    img.style.cssText = `
        max-width: 100%;
        max-height: 70vh;
        display: block;
        margin: 0 auto;
    `;
    
    // 创建下载按钮
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = '下载图片';
    downloadBtn.style.cssText = `
        display: block;
        margin: 15px auto 0;
        padding: 8px 16px;
        background: #409EFF;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    `;
    
    // 组装元素
    container.appendChild(closeBtn);
    container.appendChild(title);
    container.appendChild(img);
    container.appendChild(downloadBtn);
    overlay.appendChild(container);
    document.body.appendChild(overlay);
    
    // 事件处理
    const closePreview = () => {
        document.body.removeChild(overlay);
    };
    
    closeBtn.onclick = closePreview;
    overlay.onclick = (e) => {
        if (e.target === overlay) closePreview();
    };
    
    downloadBtn.onclick = (e) => {
        e.stopPropagation();
        // 触发实际下载
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = fileName || 'image';
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // ESC键关闭
    const handleKeydown = (e) => {
        if (e.key === 'Escape') {
            closePreview();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);
}

export function downloadAttachment(id, fileName, mimeType) {
    const token = localStorage.getItem('token');
    if (!token) {
        MessageBox.alert('请先登录', '提示');
        return Promise.reject('No token');
    }

    // 构建下载URL，使用GET请求并将token作为查询参数
    const downloadUrl = `${base_url}/download_attachment/${id}/?token=${encodeURIComponent(token)}`;
    // 检查是否为图片文件
    if (isImageFile(mimeType, fileName)) {
        console.log('isImageFile',111)
        // 如果是图片，显示预览
        showImagePreview(downloadUrl, fileName);
        return Promise.resolve();
    } else {
        // 如果不是图片，直接下载
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.style.display = 'none';
        
        // 添加到DOM并触发点击
        document.body.appendChild(link);
        link.click();
        
        // 清理DOM
        document.body.removeChild(link);
        
        return Promise.resolve();
    }
}