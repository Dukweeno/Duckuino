
          let textWidth = function (elem, text) {
            $body = $('body');
            $this = elem;
            $text = text;
            var calc = '<div style="clear:both;display:block;visibility:hidden;"><span style="width;inherit;margin:0;font-family:'  + $this.css('font-family') + ';font-size:'  + $this.css('font-size') + ';font-weight:' + $this.css('font-weight') + '">' + $text + '</span></div>';
            $body.append(calc);
            var width = $('body').find('span:last').width();
            $body.find('span:last').parent().remove();
            return width;
          };
(function($){
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
        'padding': opts.padding + 'px', 'float': 'right'});
      $(this).after('<div style="clear: both;"></div>');

      let lnbox = $(this).parent().find('textarea[data-name="linenumbers"]');

      // Determine textarea len with chars
      let charlen = -1;
      for (let i = 0; charlen == -1; i++)
        if (textWidth($(this), "*".repeat(i)) >= newwidth - opts.padding * 2)
          charlen = i - 2;
      $(this).bind('blur focus change keyup keydown', function() {
        // Break apart and regex the lines, everything to spaces sans linebreaks
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
            output += "\n---".repeat((v.length - 1) / charlen);
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
      $(this).trigger('keydown');
    });
  };
})(jQuery);
