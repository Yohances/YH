$(function () {
    //设置作品介绍字体颜色
    var ftColor = $(".work_main").attr("data-color"),
        strColor = "#" + ftColor;
    $(".work_main p").css("color", strColor);
    if (pageType == 2) {
        // 右键禁止保存
        var str_exp = '', num;
        $.each($(".exp-content img"), function (i, k) {
            str_exp += '<div class="swiper-slide"><div class="pos">';
            str_exp += '<img src="' + (k.getAttribute("src")) + '" class="forbidden_copy" data-info="作者对此作品设置了隐私保护，禁止保存至本地">';
            str_exp += '</div></div> ';
        });
        $(".fix-cover .swiper-wrapper").empty().append(str_exp);
        $(".exp-content").delegate("img", "click", function () {
            for (let i = 0; i < $(".exp-content img").length; i++) {
                if ($(".exp-content img").eq(i).attr("src") == $(this).attr("src")) {
                    num = i;
                }
            }
            if (wuid < 1 || is_deleted == 1) {
                globalTip({ 'msg': '请登录后查看原图', 'setTime': 3, 'URL': 'https://ui.cn/login.html', 'jump': true });
            } else if (phone == "") {
                globalTip({ 'msg': '请绑定手机号后查看原图', 'setTime': 3, 'URL': 'https://account.ui.cn/accountinfo.html', 'jump': true });
            } else {
                var mySwiper = new Swiper('.swiper-container', {
                    // autoplay:true,
                    initialSlide: num,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    loop: true,
                    observer: true,
                    observeParents: true,
                    observeSlideChildren: true,
                });
                $(".fix-cover").show();
                $("body").css({ "overflow": "hidden" })
            }
        })
    } else if (pageType == 1) {
        // 作品展示处理
        var imgList = "";
        var bigImg = '';
        var xcontent = JSON.parse(ocontent);
        var tagClass = "";
        var sourceImg = '';
        $.each(xcontent, function (k, v) {
            var arr = v.split("?");
            var ext = arr[0].substr(arr[0].lastIndexOf(".") + 1);
            var imgurl = arr[0];
            var img_info = "";
            var classname = "";
            if (window.devicePixelRatio > 1) {
                if (is_vip == 1 || (nopop == 1 && userid_isvip == 1)) {
                    sourceImg = arr[0];
                    if (ext == "gif") {
                        imgurl = arr[0];
                    } else {
                        imgurl += '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1800>/quality/90/';
                        classname = "lazy";
                    }
                } else {
                    sourceImg = arr[0] + '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1800>/quality/90/';
                    if (ext == "gif") {
                        imgurl += "?imageMogr2/auto-orient/strip/thumbnail/!1800>";
                    } else {
                        imgurl += '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1800>/quality/90/';
                        classname = "lazy";
                    }
                }
            } else {
                if (is_vip == 1 || (nopop == 1 && userid_isvip == 1)) {
                    sourceImg = arr[0];
                    if (ext == "gif") {
                        imgurl = arr[0];
                    } else {
                        imgurl += '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1200>/quality/90/';
                        classname = "lazy";
                    }
                } else {
                    sourceImg = arr[0];
                    if (ext == "gif") {
                        imgurl = arr[0];
                        sourceImg = arr[0];
                    } else {
                        imgurl += '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1200>/quality/90/';
                        classname = "lazy";
                        sourceImg += '?imageMogr2/auto-orient/format/jpg/strip/thumbnail/!1800>/quality/90/';
                    }
                }
            }
            if (wuid < 1 || is_deleted == 1) {
                img_info = "请登录并绑定手机号后查看原图";
                tagClass = 2;
            } else if (phone == '') {
                img_info = "请绑定手机号后查看原图";
                tagClass = 3;
            }
            imgList += '<a href="javascript:;" fa="fa" data-tag="' + tagClass + '" ><img class="forbidden_copy ' + classname + '" src="' + imgurl + '" title="' + img_info + '" alt="' + img_info + '"/></a>';
            bigImg += '<div class="swiper-slide"><div class="pos">';
            bigImg += '<img src="' + sourceImg + '" class="forbidden_copy">';
            bigImg += '</div></div>';

        })
        $("#work_img_list").append(imgList);
        $(".fix-cover .swiper-wrapper").empty().append(bigImg);
        $("#work_img_list").delegate("a", "click", function () {
            var num = $(this).index();
            var t = $(this).attr("data-tag");
            if (t == 2) {
                globalTip({ "msg": "登录并绑定手机号后才可查看原图", 'setTime': 3, 'URL': 'https://ui.cn/login.html', "jump": true })
                return false
            } else if (t == 3) {
                if (confirm("绑定手机后才可查看原图，是否绑定手机号?")) {
                    window.location.href = "https://account.ui.cn/accountinfo.html";
                }
                return false;
            } else {
                var mySwiper = new Swiper('.swiper-container', {
                    initialSlide: num,
                    navigation: {
                        nextEl: '.swiper-button-next',
                        prevEl: '.swiper-button-prev',
                    },
                    loop: true,
                    observer: true,
                    observeParents: true,
                    observeSlideChildren: true,
                });
                $(".fix-cover").show();
                $("body").css({ "overflow": "hidden" })
            }
        })
    }
    // 右侧作品列表请求
    ; (function () {
        var str = '', str2 = '';
        $.ajax({
            url: '/pubapi/projectlst',
            type: 'get',
            dataType: 'json',
            data: { "uid": uid, "size": 3,'except_pid':pid },
            success: function (res) {
                if (res.code == 1) {
                    $.each(res.data.list, function (i, k) {
                        str += '<li>';
                        str += '<a href="https://www.ui.cn/detail/' + k.id + '.html" target="_blank"><p>' + k.name;
                        if (k.ishome == 1) {
                            str += '<svg class="icon" aria - hidden="true"><use xlink: href="#icon-shoutui1"></use></svg>';
                        } else if (k.ishome == 3) {
                            str += '<svg class="icon" aria - hidden="true"><use xlink: href="#icon-putui1"></use></svg>';
                        } else if (k.ishome == 2) {
                            str += '<svg class="icon" aria - hidden="true"><use xlink: href="#icon-biantui1"></use></svg>';
                        }
                        str += '</p>';
                        str += '<div class="view">';
                        str += '<span><i class="icon-icon_browse"></i><em>' + k.vienum + '</em></span>';
                        str += '<span><i class="icon-tool_icon_comment"></i><em>' + k.commentnum + '</em></span>';
                        str += '<span><i class="icon-inspiration_icon_like_nor"></i><em>' + k.likenum + '</em></span>';
                        str += '</div>';
                        str += '</a>';
                        str += '</li >';
                    });
                    if (res.data.total > 3) {
                        str2 += '<a href="https://i.ui.cn/ucenter/' + res.data.list[0].ownerid + '.html?type=work" target="_blank" class="more">更多</a>';
                    }
                    $(".list_self p.y").text("共" + res.data.total + "个作品");
                    $(".list_self .list_detail").empty().append(str).after(str2);

                }
            },
            error: function () {

            }
        })
    })();
    // 页面滚动，右侧固定
    var asideh = $(".works-author-aside").height(); //获取右侧上半部分高度
    var navtop = $(".work_tags").offset().top //上下转换位置
    var h = $(window).scrollTop();
    if (h > $(".work_main").offset().top) {
        $(".top_bar").show();
    } else { 
        $(".top_bar").hide();
    }
    if (navtop > asideh) {
        if (h > 210 && h < navtop) {
            $('.top-aside,.r-box2').addClass("fixed");
            $(".bottom-aside").addClass('hide');
        } else if (h > navtop) {
            $('.top-aside,.r-box2').removeClass("fixed")
            $(".bottom-aside").removeClass("hide");
        } else if (h < 210) {
            $('.top-aside,.r-box2').removeClass("fixed");
            $(".bottom-aside").addClass('hide');
        }
        $('.bottom-aside').addClass("fixed"); //固定uptop初始位置
        //下半部分隐藏结束
    } else { //作品高度低的时候
        $(".bottom-aside").addClass('hide');
    } //判断结束
    $(document).scroll(function () {
        h = $(window).scrollTop();
        if (h > $(".work_main").offset().top) {
            $(".top_bar").show();
        } else {
            $(".top_bar").hide();
        }
        navtop = $(".work_tags").offset().top - 600;
        if (h > 210 && h < navtop) {
            $('.top-aside,.r-box2').addClass("fixed");
            $(".bottom-aside").addClass("hide");
        } else if (h > navtop) {
            $('.top-aside,.r-box2').removeClass("fixed")
            $(".bottom-aside").removeClass("hide");
        } else if (h < 210) {
            $('.top-aside,.r-box2').removeClass("fixed");
        }
    });
    $('.g_group a.private_msg').click(function () {
        if (wuid > 0) {
            window.open("https://i.ui.cn/letterinfo.html?fromid=" + wuid + "&toid=" + uid);
        } else {
            globalTip({ 'msg': '登录后才能发私信！', 'setTime': 3, 'URL': 'https://ui.cn/login.html', 'jump': true });
        }
    });
    $(".detail_ad").click(function () {
        var id = $(this).attr("data-id");
        $.ajax({
            url: '/adnum',
            type: 'post',
            dataType: 'json',
            data: { "ad": id},
            success: function () { 

            },
            error: function () { 

            }
        })
    })
    // 作品评论列表
    var comList = function (d) {
        var str = '', str2 = '';
        $.ajax({
            url: '/pubapi/projectcomment',
            type: 'get',
            dataType: 'json',
            data: d,
            success: function (res) {
                if (res.code == 1) {
                    if (res.data.list.length > 0) {
                        $.each(res.data.list, function (i, k) {
                            if (k.is_hot == 1) {
                                str += '<li class="pos greatCom">';
                            } else {
                                str += '<li class="pos" id="com-' + k.commentid + '">';
                            }
                            str += '<div class="abs"></div>';
                            str += '<div class="cl true_con">';
                            str += '<a href="https://i.ui.cn/ucenter/' + k.id + '.html" class="head-img z" target="_blank"><img src="' + k.actUser.avatar + k.actUser.size.max + '"></a>';
                            str += '<div class="z out">';
                            str += '<p class="answer_name">';
                            str += '<a href="https://i.ui.cn/ucenter/' + k.id + '.html" target="_blank">' + k.actUser.name + '</a>';
                            if (k.actUser.is_recommend == 1) {
                                str += '<a href="javascript:;" title="UI中国推荐设计师"><i class="icon-recommendation_designer"></i></a>';
                            }
                            if (k.actUser.is_cert == 2) {
                                str += '<a href="javascript:;" title="UI中国认证设计师"><i class="icon-certification_designer"></i></a>';
                            }
                            if (k.actUser.is_vip == 1) {
                                str += '<a href="javascript:;" title="UI中国PLUS会员"><svg class="icon" aria - hidden="true"><use xlink: href="#icon-huiyuanPLUSchunse"></use></svg></a>';
                            }
                            str += '<span class="time">' + k.time + '</span>';
                            if (k.is_hot == 1) {
                                str += '<em class="great">精彩</em>';
                            }
                            str += '</p>';
                            str += '<p class="detail_answer">' + k.content + '</p>';
                            if (k.is_hot != 1) {
                                str += '<div class="oper cl">';
                                str += '<a class="comment-toggle p-replay" href="javascript:;" id="' + k.commentid + '" _rel="' + k.id + '">回复</a>';
                                if (wuid > 0 && wuid != k.id) {
                                    str += '<a class="compid" href="javascript:;" id="c-' + k.commentid + '" rel="' + k.commentid + '" data-target="#modal-inform" pid="' + k.projectid + '">举报(<em>' + k.examine_num + '</em>)</a>';
                                }
                                if (is_admin == 1 || (wuid == uid && is_vip == 1) || wuid == k.id) {
                                    str += '<a href="javascript:;" class="del-comm" id="' + k.commentid + '" rel="' + k.projectid + '" _rel="' + k.id + '">删除评论</a>';
                                }
                                str += '</span>';
                                str += '</div>';
                            }
                            str += '</div>';
                            str += '<div class="y parent_hand">';
                            if (k.is_like == 0) {
                                str += '<p class="agree com-like" data="add" id="' + k.commentid + ' "_rel="' + k.id + '">';
                                str += '<i class="icon-dianzan"></i><span>' + k.like_num + '</span>';
                                str += '</p>';
                            } else if (k.is_like == 1) {
                                str += '<p class="agree com-like on" data="del" id="' + k.commentid + ' "_rel="' + k.id + '">';
                                str += '<i class="icon-zan_s"></i><span>' + k.like_num + '</span>';
                                str += '</p>';
                            }

                            str += '</div>';
                            str += '</div>';
                            if (k.child && k.child.list.length > 0) {
                                str += '<ul class="re-list">';
                                $.each(k.child.list, function (m, n) {
                                    str += '<li class="pos" id="com-' + n.commentid + '">';
                                    str += '<div class="cl true_con">';
                                    str += '<a href="https://i.ui.cn/ucenter/' + n.id + '.html" class="head-img z" target="_blank"><img src="' + n.actUser.avatar + n.actUser.size.max + '"></a>';
                                    str += '<div class="z">';
                                    str += '<p class="answer_name">';
                                    str += '<a href="https://i.ui.cn/ucenter/' + n.id + '.html" target="_blank">' + n.actUser.name + '</a>';
                                    if (n.actUser.is_recommend == 1) {
                                        str += '<a href="javascript:;" title="UI中国推荐设计师"><i class="icon-recommendation_designer"></i></a>';
                                    }
                                    if (n.actUser.is_cert == 2) {
                                        str += '<a href="javascript:;" title="UI中国认证设计师"><i class="icon-certification_designer"></i></a>';
                                    }
                                    if (n.actUser.is_vip == 1) {
                                        str += '<a href="javascript:;" title="UI中国PLUS会员"><svg class="icon" aria - hidden="true"><use xlink: href="#icon-huiyuanPLUSchunse"></use></svg></a>';
                                    }
                                    str += '<span class="time">' + n.time + '</span>';
                                    if (n.is_hot == 1) {
                                        str += '<em class="great">精彩</em>';
                                    }
                                    str += '</p>';
                                    str += '<p class="detail_answer"><a href="https://i.ui.cn/ucenter/' + n.toUser.id + '.html" target="_blank">@' + n.toUser.name + '</a>' + n.content + '</p>';
                                    str += '<div class="oper cl">';
                                    str += '<a class="comment-toggle p-replay" href="javascript:;" id="' + n.commentid + '" _rel="' + n.id + '">回复</a>';
                                    if (wuid > 0 && wuid != n.id) {
                                        str += '<a class="compid" href="javascript:;" id="c-' + n.commentid + '" rel="' + n.commentid + '" data-target="#modal-inform" pid="' + n.projectid + '">举报(<em>' + n.examine_num + '</em>)</a>';
                                    }
                                    if (is_admin == 1 || (wuid == uid && is_vip == 1) || wuid == n.id) {
                                        str += '<a href="javascript:;" class="del-comm" id="' + n.commentid + '" rel="' + n.projectid + '" _rel="' + n.id + '">删除评论</a>';
                                    }
                                    str += '</span>';
                                    str += '</div>';
                                    str += '</div>';
                                    str += '<div class="y">';
                                    if (n.is_like == 0) {
                                        str += '<p class="agree com-like" data="add" id="' + n.commentid + ' "_rel="' + n.id + '">';
                                        str += '<i class="icon-dianzan"></i><span>' + n.like_num + '</span>';
                                        str += '</p>';
                                    } else if (n.is_like == 1) {
                                        str += '<p class="agree com-like on" data="del" id="' + n.commentid + ' "_rel="' + n.id + '">';
                                        str += '<i class="icon-zan_s"></i><span>' + n.like_num + '</span>';
                                        str += '</p>';
                                    }

                                    str += '</div>';
                                    str += '</div>';
                                    str += '</li>';
                                })
                                str += '</ul>';
                            }
                            str += '</li>';
                        });
                        if (res.data.hasMore == 1) {
                            str2 = '<div class="w880"><a href="javascript: ;" data-page="' + (parseInt(d.page) + 1) + '" class="more_880">更多评论</a></div>';
                        }
                        if (d.page == 1) {
                            $(".comment-list").empty().append(str);
                            $(".more_880").remove();
                            $(".comment-list").after(str2);
                        } else {
                            $(".comment-list").append(str);
                            $(".more_880").remove();
                            $(".comment-list").after(str2);
                        }

                    }
                }
            },
            error: function () {

            }
        })
    }
    comList({ "pid": pid, page: 1 });
    $(document).on("click", ".more_880", function () {
        $(this).hide();
        var p = $(this).attr("data-page");
        comList({ "pid": pid, page: p });
    })
    // 弹窗出现勋章墙
    $(".aside1 .zbd_medal").delegate("img", "click", function () {
        $(".fix_medal").show();
        $('body').css({ "overflow": "hidden" })
    });
    $(".fix_medal .icon-close").click(function () {
        $(".fix_medal").hide();
        $('body').css({ "overflow-y": "auto" })
    });
    // 猜你喜欢
    ; (function () {
        var str = '',str2 = '';
        $.ajax({
            url: '/pubapi/promaybelike',
            type: 'get',
            dataType: 'json',
            data: { 'pid': pid, 'size': 12 },
            success: function (res) {
                if (res.code == 1) {
                    $.each(res.data.list, function (i, k) {
                        if (i > 3) {
                            str += '<li class="z more_li">';
                        } else {
                            str += '<li class="z">';
                        }
                        
                        str += '<a href = "https://www.ui.cn/detail/' + k.id + '.html" target="_blank">';
                        str += '<img src="' + k.cover + '">';
                        str += '<p class="guess_name">';
                        if (k.ishome == 1) {
                            str += '<svg class="icon" aria-hidden="true"><use xlink: href="#icon-shoutui1"></use></svg>';
                        } else if (k.ishome == 2) {
                            str += '<svg class="icon" aria-hidden="true"><use xlink: href="#icon-biantui1"></use></svg>';
                        } else if (k.ishome == 3) {
                            str += '<svg class="icon" aria-hidden="true"><use xlink: href="#icon-putui1"></use></svg>';
                        }
                        str += k.name + '</p>';
                        str += '<p class="tag">' + k.attr_name + '</p>';
                        str += '<div class="view">';
                        str += '<span><i class="icon-icon_browse"></i><em>' + k.vienum + '</em></span>';
                        str += '<span><i class="icon-tool_icon_comment"></i><em>' + k.commentnum + '</em></span>';
                        str += '<span><i class="icon-inspiration_icon_like_nor"></i><em>' + k.likenum + '</em></span>';
                        str += '</div>';
                        str += '</a>';
                        str += '</li>';
                    });
                    if (res.data.list.length > 4) { 
                        str2+='<a class="more_guess">更多</a>'
                    }
                    $(".guess_you_like .guess_li").empty().append(str);
                    $(".guess_you_like .guess_li").after(str2);
                }
            },
            error: function () {

            }
        })
    })();
    $(".guess_you_like").delegate(".more_guess","click",function () { 
        $(this).hide();
        $(".guess_you_like").addClass("on");
    })
    $(".aside1 .icon-jiantou").click(function () {
        $(".r-box,.new_detail").addClass("off");
        $(".r-box2").addClass("on");
        $(".top_bar").css("right", "61px");
    });
    $(".r-box2 .icon-jiantouzhankai").click(function () {
        $(".r-box,.new_detail").removeClass("off");
        $(".r-box2").removeClass("on");
        $(".top_bar").css("right", "281px");
    });
    //详情页用户关注
    $('.z_follow').click(function () {
        if (!wuid) {
            globalTip({ 'msg': '登录后才能关注！', 'setTime': 3, 'URL': 'http://ui.cn/login.html', 'jump': true });
            return false;
        } else {
            if (wuid == uid) {
                globalTip({ 'msg': '不能关注自己啊!', 'setTime': 3 });
                return false;
            } else {
                var ct,
                    data = $(this).attr('data'),
                    $this = $('.z_follow'),
                    fansNum = parseInt($('#fan-num').text());
                // 关注状态
                if (data == 'follow') {
                    ct = 'add';
                }
                // 取消关注
                if (data == 'unfollow') {
                    ct = 'del';
                };
                var followData = {
                    ct: ct,
                    followid: uid,	//被关注ID
                    uid: wuid 	//关注ID
                };
                if (data == 'follow') {	// 关注
                    $.ajax({
                        type: 'post',
                        dataType: 'jsonp',
                        url: '//i.ui.cn/follow',
                        data: followData,
                        success: function (data) {
                            if (data.code == '1') {
                                // ta 关注俺了吗?
                                if (data.isfollow != '2') {
                                    globalTip(data);
                                    $this.attr('_rel', 'havefollow');
                                    $this.addClass('z_green');
                                    $this.find('i').removeClass('icon-add-bold');
                                    $this.find('i').addClass('icon-ok-sign');
                                    $('.f2').text('已关注');
                                } else {
                                    globalTip(data);
                                    $this.attr('_rel', 'mutualfollow');
                                    $this.addClass('z_green');
                                    $this.find('i').removeClass('icon-add-bold');
                                    $this.find('i').addClass('icon-relating-bold');
                                    $('.f2').text('互相关注');
                                }
                                $this.attr('data', 'unfollow');
                                num = fansNum + 1;
                                $('#fan-num').text(num);
                                $('#fan_num').text(num);
                            } else {
                                globalTip(data);
                                return false;
                            }
                        }

                    });
                }
                if (data == 'unfollow') {	// 取消关注
                    $.ajax({
                        type: 'post',
                        dataType: 'jsonp',
                        url: '//i.ui.cn/follow',
                        data: followData,
                        success: function (data) {
                            globalTip(data);
                            if (data.code == '1') {
                                $this.attr('_rel', 'myfollow');
                                $this.removeClass('z_green');
                                $this.find('i').removeClass();
                                $this.find('i').addClass('icon-add-bold');
                                $this.attr('data', 'follow');
                                num = fansNum - 1;
                                $('.f2').text('关注');
                                if (num < 0) {
                                    num = 0;
                                }
                                $('#fan-num').text(num);
                                $('#fan_num').text(num);

                            } else {
                                globalTip(data);
                                return false;
                            }
                        }

                    });

                }
                return false;
            }
        }
    });
    // 最新佳作
    var best = function () {
        var str = '';
        $.ajax({
            url: '/Mycenter/details/changetochange2?id=' + pid + '&catid=' + catid + '&typeid=' + type + '&lookid=' + lookid,
            type: 'post',
            dataType: 'json',
            success: function (res) {
                $.each(res, function (i, k) {
                    str += '<li>';
                    str += '<a href = "https://www.ui.cn/detail/' + k.id + '.html" target = "_blank">';
                    str += '<p>' + k.name + '</p>';
                    str += '<div class="view">';
                    str += '<span><i class="icon-icon_browse"></i><em>' + k.vienum + '</em></span>';
                    str += '<span><i class="icon-tool_icon_comment"></i><em>' + k.commentnum + '</em></span>';
                    str += '<span><i class="icon-inspiration_icon_like_nor"></i><em>' + k.likenum + '</em></span>';
                    str += '</div>';
                    str += '</a>';
                    str += '</li>';
                })
                $(".bottom-aside .list_detail").empty().append(str);
            }
        })
    }
    best();
    $(".bottom-aside .article h3 div.y").click(function () {
        best();
    })
    // 微信分享二维码
    $("#qrcodeCanvas").qrcode({
        render: "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
        text: "https://m.ui.cn/detail/" + pid,    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
        width: "70",               //二维码的宽度
        height: "70",              //二维码的高度
        background: "#ffffff",      //二维码的后景色
        foreground: "#000000",      //二维码的前景色
        src: authorSrc
    });
    // 图片分享
    $("#qrcodeCanvas2").qrcode({
        render: "canvas",    //设置渲染方式，有table和canvas，使用canvas方式渲染性能相对来说比较好
        text: "https://www.ui.cn/widget/poster/" + pid + ".png",    //扫描二维码后显示的内容,可以直接填一个网址，扫描二维码后自动跳向该链接
        width: "70",               //二维码的宽度
        height: "70",              //二维码的高度
        background: "#ffffff",      //二维码的后景色
        foreground: "#000000",      //二维码的前景色
        src: authorSrc
    });
    // 生成图片
    var imageUrl = '';
    $("#share").click(function () {
        $(".share-fixed").show();
        $.ajax({
            type: "get",
            url: "/proposters",
            dataType: 'json',
            data: { 'pid': pid },
            success: function (result) {
                $(".expimg").attr("src", result.url);
                imageUrl = result.url;
            }
        });
    });
    // 下载
    $("#share-floppy-disk").on('click', function () {
        if (browserIsIe()) {
            //调用创建iframe的函数
            createIframe(imageUrl);
        } else {
            //创建原生a标签实现动态Img地址及下载触发 
            let tempa = document.createElement('a');
            tempa.href = imageUrl;
            tempa.download = 'download';
            document.body.append(tempa);
            tempa.click();
            tempa.remove();
        }
    });

    //判断是否为Trident内核浏览器(IE等)函数
    function browserIsIe() {
        if (!!window.ActiveXObject || "ActiveXObject" in window) {
            return true;
        } else {
            return false;
        }
    }
    //创建iframe并赋值的函数,传入参数为图片的src属性值.
    function createIframe(imgSrc) {
        //如果隐藏的iframe不存在则创建
        if ($("#IframeReportImg").length === 0) {
            $('<iframe style="display:none;" id="IframeReportImg" name="IframeReportImg" onload="downloadImg();" width="0" height="0" src="about:blank"></iframe>').appendTo("body");
        }
        //iframe的src属性如不指向图片地址,则手动修改,加载图片
        if ($('#IframeReportImg').attr("src") != imgSrc) {
            $('#IframeReportImg').attr("src", imgSrc);
        } else {
            //如指向图片地址,直接调用下载方法
            downloadImg();
        }
    }
    //下载图片的函数
    function downloadImg() {
        //iframe的src属性不为空,调用execCommand(),保存图片
        if ($('#IframeReportImg').src != "about:blank") {
            window.frames["IframeReportImg"].document.execCommand("SaveAs");
        }
    }
    $(".share-img .icon-close").click(function () {
        $(".share-fixed").hide();
    });
    // 编辑作品
    $(document).on('click', '.icon-edit', function () {
        $.post('/enedit', { 'pid': pid, 'actid': actid }, function (data) {
            if (data.code == 1) {
                globalTip({ 'msg': data.msg, 'setTime': data.setTime });
            } else {
                if (type == 1) {
                    window.location.href = "https://upload.ui.cn/work.html?id=" + pid;
                } else if (type == 2) {
                    window.location.href = "https://upload.ui.cn/exp.html?id=" + pid;
                }
            }
        }, 'json')
    });
    //删除作品
    $(document).on('click', '[window-target]', function () {
        // 获取弹框id
        var modalBox = $(this).attr('window-target');
        var modalBoxPos = $(modalBox).find(".modal-effect")
        // 显示弹框
        modal_1(modalBox, modalBoxPos);
    });
    $(".icon-del").click(function (event) {
        var ll_number = parseInt($(".ll_number").html());
        var sc_number = parseInt($(".sc_number").html());
        var dz_number = parseInt($(".dz_number").html());
        var pl_number = parseInt($(".pl_number").html());
        if (ll_number < 5 && sc_number == 0 && dz_number == 0 && pl_number == 0) {
            firm();
        }
        else {
            $('body').addClass('modal-open').append('<div class="modal-backdrop"></div>');
            $(".modal_de").attr({
                "id": 'modal-del',
            });
        }
    });
    function firm() {
        //利用对话框返回的值 （true 或者 false）			 
        if (confirm("您确定要删除作品吗")) {
            $.ajax({
                type: 'post',
                url: '/delProject',
                data: { 'pid': pid, 'uid': uid, 'actid': actid },
                dataType: 'json',
                success: function (msg) {
                    if (msg.code == 1) {
                        globalTip(msg);
                    } else {
                        globalTip(msg);
                        return false;
                    }

                }
            })

        }
        else {
            return false;
        }
    }
    modalPostion = function (pos) {
        //获取改变之后的宽度
        var changeWidth = $(window).width();
        var changeHeight = $(window).height();
        // 获取DIV宽度
        var smallW = $(pos).width();
        var smallH = $(pos).height();
        //计算宽度修改比例
        var divChangeWidth = (changeWidth - smallW) / 2;
        var divChangeHeight = (changeHeight - smallH) / 2;
        // 超过一屏幕的上下不居中给margin值
        if (divChangeHeight > 0) {
            $(pos).css('top', divChangeHeight);
            $(pos).css('left', divChangeWidth);
        } else {
            $(pos).css('left', divChangeWidth);
            $(pos).css('margin', "30px 0");
        }


    };

    modal_1 = function (box, pos) {
        // 浮动窗口定位
        modalPostion(pos);

        // 显示
        $('body').css('padding_right', '15px');
        $(box).addClass("in");

        $(window).resize(function () {
            // 浮动窗口定位
            modalPostion(pos);
        });

        // 点击关闭按钮以及遮罩层时关闭浮动层
        $('.icon-close, .modal-backdrop').bind('click', function () {
            $(box).removeClass("in");
            $('.modal-backdrop').remove();
            $('body').removeClass("modal-open");
            $('body').css('padding_right', '0');
        });

        // 点击关闭按钮以及遮罩层时关闭浮动层
        $('.close-btn, .modal-backdrop').bind('click', function () {
            $(box).removeClass("in");
            $('.modal-backdrop').remove();
            $('body').removeClass("modal-open");
            $('body').css('padding_right', '0');
        });
    };
    $(".feedback").click(function () {
        $(".pop-back").show();
        $("body").css({ "overflow": "hidden" })
    });
    $(".pop-back .icon-close").click(function () {
        $(".pop-back").hide();
        $("body").css({ "overflow-y": "auto" })
    });
    $(".pop-back").on('click', function (e) {
        var contentEle = $('.back-con');
        if (contentEle !== e.target && contentEle.has(e.target).length === 0) {
            $(".pop-back").hide();
        };
    });
    $(".top_bar").delegate(".comment", "click", function () {
        $("#textarea").focus();
    })

})