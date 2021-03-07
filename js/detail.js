//作品收藏
$(document).on('click', '#p-collect,.cole,.ping-num', function () {
	if (wuid.length > 0) {
		var $this = $(this);
		var data = $this.attr('data');
		var num = parseInt($('#favnum i').text());
		// 添加收藏
		if (data == 'add') {
			var str = "";
			$.ajax({
				url: "https://i.ui.cn/Uweb/Api/allBookMarkList",
				type: "get",
				xhrFields: {
					withCredentials: true
				},
				dataType: "json",
				data: { "projectid": pid, "type": type },
				success: function (data) {
					g_t = data.type;
					if (data.code == 1 && data.data) {
						$.each(data.data, function (i, k) {
							str += '<li class="cl pos">';
							str += '<div class="togChoose cl">';
							str += '<div class="z cl cli-choose" data-id="' + k.id + '">';
							str += '<i class="icon-check z"></i>';
							str += '<i class="icon-checked z"></i>';
							str += '<p class="z">' + k.name + '</p>';
							str += '</div>';
							str += '<a href="javascript:;" class="edit y">编辑</a>';
							str += '</div>';
							str += '<div class="abs">';
							str += '<input type="text" value="' + k.name + '">';
							str += '<i class="icon-no notfinish" title="取消"></i>';
							str += '<i class="icon-yes finish"  data-id="' + k.id + '" title="完成"></i>';
							str += '</div>';
							str += '</li>';
						});
						$(".file-out").show();
						$("body").css({ "overflow": "hidden" });
						$(".file-out .ope-l").addClass("hide");
						$(".file-out .more-ope").removeClass("hide");
						$(".file-out .files-list").empty().append(str);
					}
				}
			})
		}
		// 取消收藏
		if (data == 'del') {
			$.ajax({
				type: 'post',
				url: '/collect',
				data: { 'pid': pid, 'ownerid': uid, 'act': 'del' },
				dataType: 'json',
				success: function (msg) {
					if (msg.code == 1) {
						$("#p-collect,.cole,.ping-num").attr("data", "add");
						$(".work_tags .operate .y1 div.z em").text("收藏");
						globalTip({ "msg": "取消收藏成功" });
						$(".work_tags .operate .y1 div.cl").removeClass("on");
						$('#favnum i').text(num - 1);
						$(".cole").removeClass("on");
						$(".cole").find("span").text("收藏");
						$('.r-box2 a.icon-tool_icon_collection_fill').removeClass("on").find("em").text(num - 1);
					} else {
						globalTip(msg);
					}
					return false;
				}
			})
		}
	} else { 
		globalTip({ "msg": "请登录后再进行收藏", "jump": true, "URL":"https://ui.cn/login.html"})
	}

});
$(".file-out .cancle,.file-out .icon-close").click(function () {
	$(".file-out").hide();
	$("body").css({ "overflow-y": "auto" });
});
$(".file-out").delegate(".togChoose .cli-choose", "click", function () {
	$(this).toggleClass("on");
});
$(".icon-shandian").click(function () {
	var num = parseInt($('#favnum i').text());
	if (wuid.length > 0) {
		$.ajax({
			url: '/pubapi/projectfav',
			type: 'post',
			dataType: 'json',
			data: { "pid": pid },
			success: function (data) { 
				if (data.data.is_fav == 1) {
					if (data.data.bookmark) {
						globalTip({ "msg": "收藏到" + data.data.bookmark.name + "成功" });
					} else {
						globalTip({ "msg": "收藏成功" });
					}
					$("#p-collect,.cole,.ping-num").attr("data", "del");
					$(".work_tags .operate .y1 div.z em").text("已收藏");
					$(".work_tags .operate .y1 div.cl").addClass("on");
					$('#favnum i').text(num + 1);
					$(".cole").addClass("on");
					$(".cole").find("span").text("已收藏");
					$('.r-box2 a.icon-tool_icon_collection_fill').addClass("on").find("em").text(num + 1);
				} else if (data.data.is_fav == 0) { 
					$("#p-collect,.cole,.ping-num").attr("data", "add");
					$(".work_tags .operate .y1 div.z em").text("收藏");
					globalTip({ "msg": "取消收藏成功" });
					$(".work_tags .operate .y1 div.cl").removeClass("on");
					$('#favnum i').text(num - 1);
					$(".cole").removeClass("on");
					$(".cole").find("span").text("收藏");
					$('.r-box2 a.icon-tool_icon_collection_fill').removeClass("on").find("em").text(num - 1);
				}
			}
		})
	} else {
		globalTip({ "msg": "请登录后再进行收藏", "jump": true, "URL": "https://ui.cn/login.html" })
	}
	
})
var g_t = '', arr = [];
$(".file-out .more-ope .sure").click(function () {
	var num = parseInt($('#favnum i').text());
	$.each($(".files-list li"), function (i, k) {
		var node = $(".files-list li").eq(i).find(".cli-choose");
		if (node.hasClass("on")) {
			arr.push(node.attr("data-id"));
		}
	});
	if (arr.length > 0) {
		$.ajax({
			url: "https://i.ui.cn/Uweb/Api/addToBookmark",
			type: "post",
			dataType: "json",
			xhrFields: {
				withCredentials: true
			},
			data: { "projectid": pid, "bookmark": arr, "type": g_t },
			success: function (data) {
				if (data.code == 1) {
					$(".file-out").hide();
				}
			}
		});
		$.ajax({
			type: 'post',
			url: '/collect',
			data: { 'pid': pid, 'ownerid': uid, 'act': 'add' },
			dataType: 'json',
			success: function (msg) {
				if (msg.code == 1) {
					$('#favnum i').text(num + 1);
					$(".cole").addClass("on");
					$('.r-box2 a.icon-tool_icon_collection_fill').addClass("on").find("em").text(num + 1);
					globalTip({ "msg": "成功添加到勾选收藏夹" });
					$("body").css({ "overflow-y": "auto" });
					$(".work_tags .operate .y1 div.z em").text("已收藏");
					$(".work_tags .operate .y1 div.cl").addClass("on");
					$(".cole").find("span").text("已收藏");
					$("#p-collect,.ping-num").attr('data', 'del');
				} else {
					globalTip(msg);
				}
				return false;
			}
		})
	} else {
		$.ajax({
			type: 'post',
			url: '/collect',
			data: { 'pid': pid, 'ownerid': uid, 'act': 'add' },
			dataType: 'json',
			success: function (msg) {
				if (msg.code == 1) {
					$(".file-out").hide();
					$("body").css({ "overflow-y": "auto" });
					globalTip({ "msg": "收藏成功" });
					$("#p-collect,.cole,.ping-num").attr("data", "del");
					$(".work_tags .operate .y1 div.z em").text("已收藏");
					$(".work_tags .operate .y1 div.cl").addClass("on");
					$('#favnum i').text(num + 1);
					$(".cole").addClass("on");
					$(".cole").find("span").text("已收藏");
					$('.r-box2 a.icon-tool_icon_collection_fill').addClass("on").find("em").text(num + 1);
				} else {
					globalTip(msg);
				}
				return false;
			}
		})
	}
});
var gloabalName = "";
// 修改文件夹名称
$(".file-out .more-ope").delegate(".edit", "click", function () {
	var _this = $(this);
	_this.hide();
	_this.parent("div.togChoose").siblings(".abs").show();
	gloabalName = $.trim(_this.siblings(".cli-choose").find("p").text());
	_this.parent("div.togChoose").siblings(".abs").find("input").focus();
	_this.parent("div.togChoose").siblings(".abs").find("input").val(gloabalName);
});
$(".file-out .more-ope").delegate(".finish", "click", function () {
	var _this = $(this);
	var fatherNode = _this.parent("div.abs");
	var bmId = _this.attr("data-id");
	var fileName = _this.siblings("input").val();
	if (gloabalName == fileName) {
		fatherNode.hide();
		fatherNode.siblings(".togChoose").find(".edit").show();
	} else {
		if (_this.siblings("input").hasClass("new")) {
			$.ajax({
				url: "https://i.ui.cn/Uweb/Api/createBookMark",
				type: "post",
				dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				data: { "name": fileName, "type": 0 },
				success: function (data) {
					if (data.code == 1) {
						globalTip({ "msg": data.msg });
						fatherNode.hide();
						fatherNode.siblings(".togChoose").find(".cli-choose").attr("data-id", data.data);
						fatherNode.siblings(".togChoose").find(".edit").hide();
						fatherNode.siblings(".togChoose").find("p.z").text(fileName);
						_this.attr("data-id", data.data)
						_this.siblings("input").removeClass("new");
					} else {
						globalTip({ "msg": data.msg });
						_this.siblings("input").focus();
					}
				}
			})
		} else {
			$.ajax({
				url: "https://i.ui.cn/index.php/Uweb/Api/editbookmark",
				type: "post",
				dataType: "json",
				xhrFields: {
					withCredentials: true
				},
				data: { "name": fileName, "id": bmId },
				success: function (data) {
					if (data.code == 1) {
						globalTip({ "msg": data.msg });
						fatherNode.hide();
						fatherNode.siblings(".togChoose").find(".cli-choose").attr("data-id", data.data);
						fatherNode.siblings(".togChoose").find(".edit").show();
						fatherNode.siblings(".togChoose").find("p.z").text(fileName);
					} else {
						globalTip({ "msg": data.msg });
					}
				}
			})
		}
	}

});
$(".file-out .more-ope").delegate(".notfinish", "click", function () {
	var _this = $(this);
	var fatherNode = _this.parent("div.abs");
	var ept = fatherNode.siblings(".togChoose").find(".cli-choose").attr("data-id");
	if (ept > 0) {
		fatherNode.hide();
		fatherNode.siblings(".togChoose").find(".edit").show();
	} else {
		_this.parents("li").remove();
	}
});
$(".file-out .more-ope").delegate("input", "blur", function () {
	var inValue = $.trim($(this).val());
	var putValue = $.trim($(this).parent("div.abs").siblings("div.togChoose").find(".cli-choose p").text());
	if ($(this).hasClass("new")) {
		if (inValue == "") {
			$(this).parents("li").remove();
		}
	} else {
		if (inValue == putValue) {
			$(this).parent("div.abs").hide();
		}
	}
});
$(".file-out .more-ope").delegate(".ope a.z", "click", function () {
	var str = '<li class="cl pos">';
	str += '<div class="togChoose cl">';
	str += '<div class="z cl cli-choose on">';
	str += '<i class="icon-check z"></i>';
	str += '<i class="icon-checked z"></i>';
	str += '<p class="z">默认收藏夹</p>';
	str += '</div>';
	str += '<a href="javascript:;" class="edit y">编辑</a>';
	str += '</div>';
	str += '<div class="abs" style="display:block">';
	str += '<input type="text" class="new" autofocus>';
	str += '<i class="icon-no notfinish" title="取消"></i>';
	str += '<i class="icon-yes finish" title="完成"></i>';
	str += '</div>';
	str += '</li>';
	$(".file-out .more-ope .files-list").prepend(str);
	setTimeout("$('.file-out .more-ope .files-list input.new').focus()", 500);
});

//下载附件
$('#p-down').click(function () {
	//未登录或者账号被禁用
	if (!wuid) {
		globalTip({ 'msg': '登录后才能下载！', 'setTime': 3, 'URL': 'https://ui.cn/login.html', 'jump': true });
		return false;
	}
	if (state == 1) {

		globalTip({ 'msg': '你的账户已被注销,请你使用反馈渠道联系管理员！', 'setTime': 5 });
		return false;
	}

});

// 作品点赞
$(document).on('click', '.p-like', function () {
	var data = $(this).attr('data'),
		$this = $(this);
	$.ajax({
		type: 'post',
		url: '/praise',
		data: { 'pid': pid, 'ownerid': uid, 'type': data },
		dataType: 'json',
		success: function (msg) {
			//登录
			if (msg.code == 1) {
				// if(msg.actnum&&msg.actnum<5){
				$(".sun").show();
				window.setTimeout(function () {
					$(".sun").hide();
				}, 3000);
				// }
				globalTip(msg);
				$('.p-like').attr('data', 'unlike');
				$('.p-like').addClass("on");
				$('.p-like').find('i').attr("class", "icon-inspiration_icon_like_def");
				$('.p-like').find('.like-num').text(msg.num);
				$('.p-like').attr("title", '已赞');
				$('.zan_agree').find('span').text("已赞");
				$(".r-box2 a.icon-inspiration_icon_like_def").find("em").text(msg.num);
			} else {
				globalTip(msg);
			}
			//未登陆
			if (msg.code == 2) {
				globalTip(msg);
				$('.p-like').addClass("on");
				$('.p-like').find('i').attr("class", "icon-inspiration_icon_like_def");
				$('.p-like').find('.like-num').text(msg.num);
				$('.p-like').attr("title", '已赞');
				$('.zan_agree').find('span').text("已赞");
				$(".r-box2 a.icon-inspiration_icon_like_def").find("em").text(msg.num);

			} else {
				globalTip(msg);
			}

			//取消
			if (msg.code == 3) {
				globalTip(msg);
				$('.p-like').attr('data', 'like');
				$('.p-like').removeClass("on");
				$('.p-like').not(".zan_agree").find('i').attr("class", "icon-inspiration_icon_like_nor")
				$('.p-like').find('.like-num').text(msg.num);
				$('.p-like').attr("title", '赞');
				$('.zan_agree').find('span').text("赞");
				$(".r-box2 a.icon-inspiration_icon_like_def").find("em").text(msg.num);
			} else {
				globalTip(msg);
			}
			return false;
		}
	})
	return false;
});


//删除作品
$(document).on('click', '.mobtn .yes', function () {

	// if ( confirm ('确定删除该作品么？') ) {
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

	// }else{

	// 	return false;
	// }

})
// 判断是不是0
$(document).ready(function () {
	var lP = $('.modal_de .contents p');
	for (var i = 0; i < lP.length; i++) {
		var Is = lP.eq(i).find('em').text();
		if (Is == 0) {
			lP.eq(i).remove();
		}
	}
})

//延迟加载
$(document).ready(function () {
	$('.imgloadinglater').lazyload({
		threshold: -100, //距离100像素触发
		effect: "fadeIn" //显示特效
	});
});

// 星级评分
$(function () {
	$(".star-fixed .star li").hover(function () {
		$(this).addClass('hon');
		$(this).prevAll().addClass('hon');
	}, function () {
		$(this).removeClass('hon');
		$(this).prevAll().removeClass('hon');
	})

	$(".star-fixed .star li").click(function () {
		$(this).addClass('con');
		$(this).prevAll().addClass('con');
		$(this).nextAll().removeClass('con');
	});
	$(".work_tags .operate a.recom").click(function () {
		$(".star-fixed").show();
		$('body').css({ "overflow": "hidden" })
	})
	$(".star-fixed .star .cancle").click(function () {
		$(".star-fixed").hide();
		$('body').css({ "overflow": "auto" })
	});
	$("#in").on("input", function () {
		var str = $.trim($(this).val());
		var len = str.length;
		if (len > 200) {
			$(".star-fixed .star .tip em").text(200);
			$(this).val(str.substr(0, 200));
		} else {
			$(".star-fixed .star .tip em").text(len);
		}
	});
	$(".star-fixed .star .sure").click(function () {
		var wzd_l = $(".star-fixed .wzd li.con").length;
		var qf_l = $(".star-fixed .qf li.con").length;
		var qfx_l = $(".star-fixed .qfx li.con").length;
		var pb_l = $(".star-fixed .pb li.con").length;
		var con = $.trim($("#in").val());
		if (con == "") {
			globalTip({ "msg": "请填写推荐心得" })
		} else {
			$.ajax({
				url: "/Mycenter/Api/recommend",
				type: "post",
				dataType: "json",
				data: { "projectid": pid, "wzd": wzd_l, "qfx": qf_l, "jfx": qfx_l, "pbbj": pb_l, "content": con },
				success: function (msg) {
					globalTip({ "msg": msg.msg });
					if (msg.code == 1) {
						window.setTimeout(function () {
							window.location.reload();
						}, 1500)
					}
				}
			})
		}

	});
})
// 右键禁止点击
$('.work_main').delegate(".forbidden_copy", "contextmenu", function (e) {
	if (forbidright == 1) {
		window.clearTimeout(timer);
		var l = e.pageX - $("#work_img_list").offset().left + 20;
		var str = '<div class="copyRight" style="left:' + (e.offsetX + 10) + 'px;top:' + (e.offsetY + 10) + 'px">作者对此作品设置了隐私保护，禁止保存至本地</div>';
		$('.work_main .copyRight').remove();
		$(this).parent("a").append(str);
		var timer = window.setTimeout(function () {
			$('.work_main .copyRight').remove();
		}, 3000);
		return false;
	}

});
$('.fix-cover').delegate("img", "contextmenu", function (e) {
	if (forbidright == 1) {
		window.clearTimeout(timer);
		var str = '<div class="copyRight" style="left:' + (e.offsetX + 10) + 'px;top:' + (e.offsetY + 10) + 'px">作者对此作品设置了隐私保护，禁止保存至本地</div>';
		$('.fix-cover .copyRight').remove();
		$(this).parent("div").append(str);
		var timer = window.setTimeout(function () {
			$('.fix-cover .copyRight').remove();
		}, 3000);
		return false;
	}
});
$('.work_main').delegate(".exp-content img", "contextmenu", function (e) {
	if (forbidright == 1) {
		window.clearTimeout(timer);
		var l = e.pageX - $('.work_main .read_con').offset().left;
		var str = '<div class="copyRight" style="left:' + l + 'px;top:' + (e.pageY - $('.work_main .read_con').offset().top+15) + 'px">作者对此作品设置了隐私保护，禁止保存至本地</div>';
		$('.work_main .read_con .copyRight').remove();
		$('.work_main .read_con').append(str);
		var timer = window.setTimeout(function () {
			$('.work_main .copyRight').remove();
		}, 3000);
		return false;
	}
});
$(".fix-cover").click(function (e) {
	var con = $(".swiper-button-prev"), con1 = $(".swiper-button-next"), con2 = $(".fix-cover .swiper-container .swiper-slide img");
	if (!con.is(e.target) && con.has(e.target).length === 0 && !con1.is(e.target) && con1.has(e.target).length === 0 && !con2.is(e.target) && con2.has(e.target).length === 0) {
		$(".fix-cover").hide();
		$("body").css({ "overflow": "auto" })
	}
});
$(".fix-cover").delegate(".swiper-container .swiper-slide img", "click", function () {
	$(".fix-cover").toggleClass("zoom");
})



