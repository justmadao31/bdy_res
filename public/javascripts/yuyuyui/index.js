Vue.prototype.$axios = axios;
var vueApp = new Vue({
    el: '#vueApp',
    data: {
        userDto: null,
        activeNav: '1',
        loginForm: {
            username: '',
            password: '',
            password2: '',
            email: '',
            code: ''
        },
        loginType: 'login',
        loading: false,
        character: [
            {
                title: '结城友奈',
                value: '1'
            },
            {
                title: '东乡美森',
                value: '2'
            },
            {
                title: '三好夏凛',
                value: '3'
            },
            {
                title: '犬吠埼风',
                value: '4'
            },
            {
                title: '犬吠埼树',
                value: '5'
            },
            {
                title: '乃木园子（中）',
                value: '6'
            },
            {
                title: '鹫尾须美',
                value: '7'
            },
            {
                title: '三之轮银',
                value: '8'
            },
            {
                title: '乃木园子（小）',
                value: '9'
            },
            {
                title: '乃木若叶',
                value: '10'
            },
            {
                title: '高嶋友奈',
                value: '11'
            },
            {
                title: '郡千景',
                value: '12'
            },
            {
                title: '土居球子',
                value: '13'
            },
            {
                title: '伊予岛杏',
                value: '14'
            },
            {
                title: '上里日向',
                value: '15'
            },
            {
                title: '白鸟歌野',
                value: '16'
            },
            {
                title: '藤森水都',
                value: '17'
            },
            {
                title: '古波藏棗',
                value: '18'
            },
            {
                title: '秋原雪花',
                value: '19'
            },
            {
                title: '赤岭友奈',
                value: '20'
            },
            {
                title: '弥勒莲华',
                value: '27'
            },
            {
                title: '桐生静',
                value: '28'
            },
            {
                title: '楠芽吹',
                value: '21'
            },
            {
                title: '山伏雫',
                value: '22'
            },
            {
                title: '加贺城雀',
                value: '23'
            },
            {
                title: '弥勒夕海子',
                value: '24'
            },
            {
                title: '国土亚耶',
                value: '25'
            },
            {
                title: '其他',
                value: '26'
            }
        ],
        timeline: [
            {
                content: '视频增加了线路2，觉得视频卡顿的人可以试试',
                timestamp: '2019-12-7'
            },
            {
                content: '增加了注册功能，现在可以发弹幕了',
                timestamp: '2019-11-25'
            },
            {
                content: '增加了首页更新信息，现在可以拉取b站的弹幕了',
                timestamp: '2019-11-14'
            },
            {
                content: '更换了播放器，增加了PayPal主页，欢迎支持',
                timestamp: '2019-11-13'
            },
            {
                content: '图鉴完成了查看详情',
                timestamp: '2019-11-10'
            }, {
                content: '关于本站里添加了收款码，欢迎支持',
                timestamp: '2019-11-10'
            },
            {
                content: '图鉴添加了缩略图',
                timestamp: '2019-11-9'
            },
            {
                content: '添加了图鉴查询（没有详情查看）',
                timestamp: '2019-11-9'
            },
            {
                content: '增加了视频剧情',
                timestamp: '2019-11'
            }, {

                content: '创建成功',
                timestamp: '2019-11'
            }
        ],
        newsList: [],
        //剧情视频
        activeVideoNode: null,
        videoUrl: null,
        props: {
            label: 'label',
            children: 'children',
            isLeaf: 'leaf'
        },
        dp: null,
        trimDanmuForm: {
            cid: '',
            newTime: '',
            oldTime: ''
        },
        dialogLoginVisible: false,
        editNode: null,
        videoRoute: 1,
        videoBase: 'http://justmadao.club/video/',
        //卡面图鉴
        cardsPageNo: 1,
        cardsPageSize: 12,
        cardsTotal: 1,
        cardList: [],
        cardsForm: {
            color: [],
            rate: [],
            character: []
        },
        isCardEdit: false,
        activeCard: null
    },
    methods: {
        //通用部分
        navSelect: function (key, keyPath) {
            this.activeNav = key
        },
        J_login: function () {
            if (this.loginForm.username.trim() == '') {
                this.$alert('用户名不能为空', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (this.loginForm.password.trim() == '') {
                this.$alert('密码不能为空', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }

            this.$axios.post('/login', this.loginForm)
                .then(response => {
                    if (response.data.status == 1) {
                        location.reload()
                    } else if (response.data.status == 0) {
                        this.$alert(response.data.message, '错误', {
                            confirmButtonText: '确定'
                        });
                    } else if (response.data.status == 2) {
                        this.$alert(response.data.message, '错误', {
                            confirmButtonText: '确定'
                        });
                        this.dialogLoginVisible = false
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        J_sign: function () {
            if (this.loginForm.username.trim() == '') {
                this.$alert('用户名不能为空', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (this.loginForm.password.trim() == '') {
                this.$alert('密码不能为空', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (!/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,12}$/.test(this.loginForm.password)) {
                this.$alert('密码需要6-12位英文与数字的组合', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (this.loginForm.password != this.loginForm.password2) {
                this.$alert('两次输入的密码不一致', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.loginForm.email)) {
                this.$alert('邮箱格式不正确', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            if (this.loginForm.code.trim() == '') {
                this.$alert('验证码不能为空', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            this.$axios.post('/sign', this.loginForm)
                .then(res => {
                    if (res.data.status == 1) {
                        this.$alert(res.data.message, '成功', {
                            confirmButtonText: '确定',
                            callback: action => {
                                location.reload()
                            }
                        });
                    } else {
                        this.$alert(res.data.message, '错误', {
                            confirmButtonText: '确定'
                        });
                    }
                })

        },
        sentCode: function () {
            if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(this.loginForm.email)) {
                this.$alert('邮箱格式不正确', '错误', {
                    confirmButtonText: '确定'
                });
                return
            }
            this.$axios.post('/sendCode', {email: this.loginForm.email})
                .then(res => {
                    this.$alert(res.data.message, '确认', {
                        confirmButtonText: '确定'
                    });
                })
        },
        getNews: function () {
            this.$axios.post('/yuyuyui/getNews')
                .then(res => {
                    this.newsList = res.data.result
                })
        },
        //视频剧情
        videoTreeClick(data, node) {
            this.activeVideoNode = node
            if (data.isLeaf) {
                this.videoUrl = this.videoPath + '.mp4';
                this.dpInit()
            }
        },
        dpInit: function () {
            if (this.dp) this.dp.destroy()
            this.dp = new DPlayer({
                container: document.getElementById('dplayer'),
                video: {
                    url: this.videoBase + this.videoUrl
                },
                danmaku: {
                    id: this.activeVideoNode.data.id,
                    user: 'justmadao',
                    api: '/yuyuyui/getdanmu/',
                    addition: ['/yuyuyui/getBiliBilidanmu?cid=' + this.activeVideoNode.data.cid]
                }
            });
        },
        loadNode(node, resolve) {
            if (node.level == 0) {
                resolve([{
                    "id": 1,
                    "pid": 0,
                    "label": "闪光的花结",
                    "isLeaf": 0,
                    "src": "",
                    "size": 0,
                    "orderNo": 0,
                    "leaf": false
                }, {
                    "id": 6,
                    "pid": 0,
                    "label": "树海的记忆",
                    "isLeaf": 0,
                    "src": "",
                    "size": 0,
                    "orderNo": 1,
                    "leaf": false
                }])
            } else {
                this.getVideoTreeNode(node).then(response => {
                    resolve(response.data.result)
                })
            }
        },
        changeVideoRoute: function (type) {
            if (this.videoRoute == type) return
            this.videoRoute = type
            switch (type) {
                case 1:
                    this.videoBase = 'http://justmadao.club/video/';
                    break;
                case 2:
                    this.videoBase = 'http://172.81.238.32:3000/video/';
                    break;
            }
            this.dpInit()
        },
        getVideoTreeNode: function (node) {
            return this.$axios.post('/yuyuyui/getVideoTreeNode', {pid: node.data ? node.data.id : 0})
        },
        getVideoPath: function (path, node) {
            var p = node.label + path
            if (node.level == 1) {
                return p
            } else {
                return this.getVideoPath('/' + p, node.parent);
            }
        },
        clickEditNode: function (e) {
            this.editNode = JSON.parse(JSON.stringify(e.row))
        },
        saveVideoNode: function () {
            this.editNode.isLeaf = this.editNode.leaf ? 1 : 0
            this.editNode.path = this.videoPath
            //console.log(this.editNode)
            this.$axios.post('/yuyuyui/saveVideoNode', this.editNode)
                .then(response => {
                    this.$message({
                        message: '保存成功',
                        type: 'success'
                    });
                    this.editNode = null
                    this.getVideoTreeNode(this.activeVideoNode).then(res => {
                        this.activeVideoNode.childNodes = []
                        this.activeVideoNode.doCreateChildren(res.data.result)
                    })
                })
        },
        createNewVideoNode: function () {
            this.editNode = {
                id: null,
                pid: this.activeVideoNode ? this.activeVideoNode.data.id : 0,
                orderNo: 0,
                label: '',
                leaf: false,
                src: '',
                size: 0,
                cid: 0,
                img: '',
                isLeaf: 0
            }
        },
        gotoXL: function () {
            window.open(this.activeVideoNode.data.src)
        },
        trimDanmu: function () {
            this.$axios.post('/yuyuyui/trimDanmu', this.trimDanmuForm)
                .then(res => {
                    alert(res.data.message)
                })
        },
        //卡面图鉴
        getCards: function (page) {
            if (page) this.cardsPageNo = page
            var param = {
                pageNo: this.cardsPageNo,
                pageSize: this.cardsPageSize,
                color: this.cardsForm.color,
                character: this.cardsForm.character,
                rate: this.cardsForm.rate
            }
            this.$axios.post('/yuyuyui/getCards', param)
                .then(res => {
                    this.cardsTotal = res.data.totalCount
                    this.cardList = res.data.result;
                })
        },
        cardsPageChange: function (e) {
            this.cardsPageNo = e
            this.getCards()
        },
        getCardPath: function (type, path) {
            if (type == 1) {
                return 'http://172.81.238.32:3000' + path.replace('yuyuyui', '/images/thumbnail').replace('png', 'jpg')
            } else {
                return 'http://172.81.238.32:3000' + path.replace('yuyuyui', '/images/cards')
            }
        },
        toCardInfo: function (card) {
            this.isCardEdit = true
            this.getCardById(card ? card.id : null)
        },
        getCardById: function (id) {
            if (id) {
                this.$axios.post('/yuyuyui/getCardById', {id: id})
                    .then(res => {
                        this.activeCard = res.data.result[0];
                    })
            } else {
                this.activeCard = {
                    "id": null,
                    "title": "",
                    "character": "",
                    "color": "",
                    "rate": "",
                    "createtime": "",
                    "beforeImg": "",
                    "beforeImgName": "",
                    "afterImg": "",
                    "afterImgName": "",
                    "leaderSkillName": "",
                    "leaderSkillConctent": "",
                    "skillName": "",
                    "skillContent": "",
                    "abilityName": "",
                    "abilityContent": "",
                    "description": "",
                    "akt": 0,
                    "hp": 0,
                    "grown": 0,
                    "speed": "",
                    "cost": 0,
                    "crt": '',
                    "strength": ''
                }
            }
        },
        uploadCardImg: function (type) {
            if (this.activeCard.title == '' || this.activeCard.character == '') {
                this.$alert('请先填写卡名和角色', '错误', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });
                return
            }

            var formdata = new FormData()
            var file = document.getElementById(type == 1 ? 'uploadBefore' : 'uploadAfter').files[0]
            var fileName = this.activeCard.title + '·' + this.activeCard.character + (type == 1 ? 'before' : 'after') + file.name.substring(file.name.lastIndexOf('.'), file.name.length)
            formdata.append("pic", file);
            formdata.append("fileName", fileName);
            //this.$axios.post('/yuyuyui/uploadCardImg', formdata)
            this.$axios.post('http://172.81.238.32:3000/yuyuyui/uploadCardImg', formdata)
                .then(res => {
                    if (res.data.status == 1) {
                        this.$alert('上传成功', '成功', {
                            confirmButtonText: '确定',
                            callback: action => {

                            }
                        });
                        if (type == 1) {
                            this.activeCard.beforeImgName = 'yuyuyui/' + fileName
                        } else {
                            this.activeCard.afterImgName = 'yuyuyui/' + fileName
                        }
                    } else {
                        alert(res.data.message)
                    }
                })
        },
        saveCard: function () {
            if (this.activeCard.title == '') {
                this.$alert('请先填写卡名', '错误', {
                    confirmButtonText: '确定',
                    callback: action => {

                    }
                });
                return
            }
            //console.log(JSON.stringify(this.activeCard, null, 4))
            this.$axios.post('/yuyuyui/saveCard', this.activeCard)
                .then(res => {
                    this.$alert('保存成功', '成功', {
                        confirmButtonText: '确定',
                        callback: action => {

                        }
                    });
                })
        }
    },
    computed: {
        videoPath: function () {
            if (this.activeVideoNode == null) return ''
            return this.getVideoPath('', this.activeVideoNode)
        },
        editVideoNode: function () {
            var list = []
            if (this.activeVideoNode) {
                this.activeVideoNode.childNodes.forEach(function (o, i) {
                    list.push(o.data)
                })
            }

            return list;
        },
        cardInfo: function () {
            if (this.activeCard) {
                return [
                    {
                        label: '领队技能',
                        name: this.activeCard.leaderSkillName,
                        description: this.activeCard.leaderSkillConctent
                    },
                    {label: '必杀技', name: this.activeCard.skillName, description: this.activeCard.skillContent},
                    {label: '被动效果', name: this.activeCard.abilityName, description: this.activeCard.abilityContent}
                ]
            } else {
                return []
            }
        }
    },
    watch: {
        'activeNav': function (newValue, oldValue) {
            if (newValue == null) {
                this.activeNav = oldValue
            }

            if (this.dp) {
                if (newValue != '4') {
                    this.dp.pause()
                } else {
                    this.dp.play()
                }
            }

        }
    },
    created: function () {
// 添加请求拦截器
        this.$axios.interceptors.request.use(config => {
            // 在发送请求之前做些什么
            this.loading = true
            return config;
        }, function (error) {
            // 对请求错误做些什么
            return Promise.reject(error);
        });

// 添加响应拦截器
        this.$axios.interceptors.response.use(response => {
            // 对响应数据做点什么
            this.loading = false
            return response;
        }, function (error) {
            // 对响应错误做点什么
            return Promise.reject(error);
        });

        this.getNews()
    },
    mounted: function () {
        window.vueApp = this;
    }
})