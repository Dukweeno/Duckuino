function getCharByRow(e) {
  let name = Math.random().toString(36).substr(2, 12);
  let span = '<span id="' + name + '" style="     \
    font-family: ' + e.css('font-family') + ';    \
    font-size: '  + e.css('font-size') + ';       \
    font-weight: ' + e.css('font-weight') + ';    \
    display: block;                               \
    word-wrap: break-word;                        \
    padding: ' + e.css('padding-left') + ';       \
    width: ' + e.width() + 'px"></span>';
  $('body').append(span);

  $('#' + name).text('*');
  let inith = $('#' + name).height();

  let chars;
  for (chars = 1; $('#' + name).height() <= inith; chars++)
    $('#' + name).text("*".repeat(chars));

  $('#' + name).remove();
  return chars - 2;
}

(function($) {
  $.fn.linenumbers = function(inopts){
    let opts = $.extend({
      width: 32,
      padding: 8,
      start: 1,
      digits: 4
    }, inopts);
    $('[data-name="linenumbers"]').remove();

    return this.each(function(){
      let self = this;
      let width = $(this).width();
      let height = $(this).height();
      let newwidth = width - opts.width;

      $(this).before('<textarea                  \
          data-name="linenumbers"                \
          style="                                \
              width: ' + newwidth + 'px;         \
              height: ' + height + 'px;          \
              float: left;                       \
              margin-right: -' + newwidth + 'px; \
              white-space: pre; overflow: hidden;\
          " disabled></textarea>');
      $(this).css({'width': newwidth + 'px', 'height': height + 'px',
        'padding': opts.padding + 'px', 'float': 'right', 'overflow-y': 'hidden'});
      $(this).after('<div style="clear: both;"></div>');

      let lnbox = $(this).parent().find('textarea[data-name="linenumbers"]');
      let charbr = getCharByRow($(this));

      $(this).on('keydown keyup change', function(ev) {
        // Make change directly
        if (ev.type == 'keydown') {
          setTimeout(() => $(this).trigger('change'), 0);
          return;
        }

        // Split value into lines
        let lines = $(this).val().split('\n');
        // declare output var
        let output='';
        // declare spacers and max_spacers vars, and set defaults
        let max_spacers = '';
        for(i=0; i < opts.digits; i++)
          max_spacers += ' ';
        // Loop through and process each line
        $.each(lines,function(k, v) {
          // Add a line if not blank
          if (k != 0)
            output += '\n';
          // Determine the appropriate number of leading spaces
          let lencheck = k + opts.start + '!';
          let spacers = max_spacers.substr(lencheck.length - 1);
          // Add the line with out line number, to the output variable
          if (k >= Math.pow(10, opts.digits) - 1)
            output += "\n"
          else {
            output += spacers + (k + opts.start) + ':';
            if (v != "")
              output += "\n---".repeat((v.length - 1) / charbr);
          }
        });
        // Give the text area out modified content.
        $(lnbox).val(output);
        // Change scroll position as they type, makes sure they stay in sync
        $(lnbox).scrollTop($(this).scrollTop());
      });
      // Lock scrolling together, for mouse-wheel scrolling
      $(this).scroll(function(){
        $(lnbox).scrollTop($(this).scrollTop());
      });
      // Fire it off once to get things started
      $(this).trigger('change');
    });
  };
})(jQuery);
