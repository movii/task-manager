$(function() {
	var dragging, sender, target, original, index, UI;
	function countChild() {
		$.each($('.childCount'), function(index, value) {
			$(value).html($(value).parent('h2').siblings('.inner').children('.portlet').not('.ui-sortable-helper').length);
		})
	};
	countChild()

	$(".backLog ,.in-progress,.done").sortable({
		distance: 1,
		tolerance : "intersect",
		connectWith : ".backLog ,.in-progress,.done",
		helper : "clone",
		forcePlaceholderSize : true,
		start : uiStart,
		update : function() {
			countChild()
		},
		receive : function(e, ui) {
			if ($(e.target).hasClass('in-progress')) {
				ui.item.find('.inner-startTime').html(new Date().toGMTString())
			} else if ($(e.target).hasClass('done')) {
				ui.item.find('.inner-startTime').html(new Date().toGMTString())
				ui.item.find('.inner-endTime').html(new Date().toGMTString())
			}
		},
		over : function(e, ui) {
			target = $(e.target);
			$(e.target).parent('.column').css({
				'background' : '#a0ff66'
			})
			if ((target.hasClass('backLog') && (ui.sender.hasClass('done') || ui.sender.hasClass('in-progress'))) || target.hasClass('in-progress') && ui.sender.hasClass('done')) {
				var placeHolderIdx = $('.ui-sortable-placeholder').index();
				$('.ui-sortable-placeholder').closest('.column').css({
					"background" : 'red',
					'opacity' : '.3'
				})//.end().clone().insertBefore($('.ui-sortable-placeholder').parent('.inner').children(".portlet:eq(" + index + ")")).show()

			}

		},
		out : function(e, ui) {
			$(e.target).parent('.column').css({
				'background' : 'none'
			})
			$(e.target).css({
				'opacity' : '1'
			})
		},
		beforeStop : uiBeforeStop,
		stop : function(e, ui) {
			$('.portlet:hidden').remove();
			countChild()
		}
	});

	function uiStart(e, ui) {
		index = ui.item.index();
		sender = $(this);
		ui.item.show().css({
			'opacity' : '.3'
		})
	}

	function uiBeforeStop(e, ui) {
		if ((target.hasClass('backLog') && (sender.hasClass('done') || sender.hasClass('in-progress'))) || target.hasClass('in-progress') && sender.hasClass('done')) {
			ui.item.fadeOut()
			$(ui.helper.clone()).appendTo(sender).css({
				left : ui.position.left,
				top : ui.position.top
			}).show().animate({
				left : ui.originalPosition.left,
				top : ui.originalPosition.top
			}, function() {
				$(this).hide()
			})

			$(ui.item.clone(true)).addClass("copy").insertBefore($(sender).children(".portlet:eq(" + index + ")")).show();
			ui.item.remove()
		}

		$(".column,.portlet,.copy").css({
			'opacity' : ' 1'
		});
		$('.copy').removeClass('copy')

	}

	function addTask(e) {
		e.preventDefault();
		var taskVal = $('.atInput').val(), taskTmpl = $.trim($('#taskTemp').html());

		if (taskVal.length == 0) {
			alert('You can not create a task without a word.')
		} else {
			var finalTml = taskTmpl.replace(/{{TaskDesc}}/ig, taskVal);
			$('.backLog').prepend(finalTml);
			$('.atInput').val('');
		}
		$('a.editTask').on('click', editTask);
		$('a.delTask').on('click', deleteTask);
	};

	$('.atBtn').on('click', addTask);

	$(document).keypress(function(e) {
		if (e.which == 13) {
			$('.atBtn').trigger('click');
		}
	});

	/*
	 * Edit Task
	 */

	function editTask(e) {
		e.preventDefault();
		if ($(this).closest('.portlet').children('div.editContent').length > 0) {
			return;
		}
		var curContent = $(this).siblings('.portlet-content').text(), contentWidth = $(this).siblings('.portlet-content').width(), contentHeigth = $(this).siblings('.portlet-content').height(), editBox = $.trim($('#editTemp').html());

		$(this).siblings('.portlet-content').hide();
		$(editBox).insertAfter($(this).siblings('.portlet-header')).hide();
		$(this).siblings(".editContent").children('textarea').css({
			'font-size' : '12px',
			'font-family' : 'arial',
			'width' : contentWidth,
			'height' : contentHeigth,
			'min-height' : '60px',
			'background' : "white"
		}).val($.trim(curContent));
		$('.editContent').show()
		$(this).siblings(".editContent").children('.saveContent').on('click', saveContent);

		function saveContent(e) {
			e.preventDefault();
			var newContent = $(this).siblings('textarea').val();

			$(this).parent(".editContent").siblings('.portlet-content').html(newContent).show();
			$(this).parent(".editContent").hide().remove();
		}

	};
	$('a.editTask').on('click', editTask);

	/*
	 * Delete Task
	 */

	$('a.delTask').on('click', deleteTask);
	function deleteTask(e) {
		e.preventDefault();
		if (confirm('Do you really want to delete the Task?')) {
			$(this).closest('.portlet').remove();
		} else {
			return false;
		}

	}

});
