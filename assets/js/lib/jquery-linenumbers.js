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

function update(ev, self, opts, linebox) {
  /* Interpret keydown as change */
  if (ev.type == 'keydown') {
    setTimeout(() => $(self).trigger('change'), 0);
    return;
  }

  /* Make sure height is right */
  $(linebox).css('height',
    ($(self).height()
    + parseInt($(self).css('padding-top'))
    + parseInt($(self).css('padding-bottom'))) + 'px');

  /* Get the number of printable char in line */
  let charbr = getCharByRow($(self));

  // Split value into lines
  let lines = $(self).val().split('\n');
  // declare output var
  let output='';
  // declare spacers and max_spacers vars, and set defaults
  let max_spacers = '';
  for(i=0; i < opts.digits; i++)
    max_spacers += ' ';
  // Loop through and process each line
  $.each(lines, function(k, v) {
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
        output += "\n--".repeat((v.length - 1) / charbr);
      }
  });

  // Give the text area out modified content.
  $(linebox).val(output);
  // Change scroll position as they type, makes sure they stay in sync
  $(linebox).scrollTop($(self).scrollTop());

}

/* On JQuery ready */
(function($) {
  $.fn.linenumbers = function(inopts){
    let opts = $.extend({
      width: 42,
      start: 1,
      digits: 3
    }, inopts);
    $('[data-name="linenumbers"]').remove();

    return this.each(function() {
      let self = this;

      /* Generate the line number text-area */
      $(this).before('<textarea data-name="linenumbers" disabled></textarea>');

      /* Get the generated text-area and style it */
      let linebox = $(self).parent().find('textarea[data-name="linenumbers"]');
      $(linebox).css('width', opts.width + 'px');
      $(linebox).css('height',
        ($(this).height()
        + parseInt($(this).css('padding-top'))
        + parseInt($(this).css('padding-bottom'))) + 'px');
      $(linebox).css('padding-right', '0');
      $(linebox).css('position', 'absolute');
      $(linebox).css('overflow', 'hidden');
      $(linebox).css('border-top-right-radius', '0');
      $(linebox).css('border-bottom-right-radius', '0');

      $(this).css({'padding-left':
        (opts.width + parseInt($(self).css('padding-left'))) + 'px',
        'overflow': 'hidden'});

      /* Update on events */
      $(this).on('keydown keyup change', (ev) => update(ev, self, opts, linebox));
      $(window).resize((ev) => update(ev, self, opts, linebox));

      /* Scroll with the base text-area */
      $(this).scroll(function() {
        $(linebox).scrollTop($(this).scrollTop());
      });

      /* Fire it off once to get things started */
      $(this).trigger('change');
    });
  };
})(jQuery);
