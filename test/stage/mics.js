/* global window, classNames */

;( function () {
  var redom = window.redom
  var el = redom.el
  var mount = redom.mount
  var list = redom.list

  var id = 'component-root__mics'

  // console.log( 'whale' )

  /*
  <div class="col-xs-12 g-nopadding maincontent-content-inner-box-form-group">
    <div class="col-xs-push-2 col-xs-8  col-sm-push-2 col-sm-3 g-nopadding maincontent-content-row">
      <label for="maincontent-content-ethernet-dns1" class="maincontent-content-label-2">DNS</label>
    </div>
    <div class="col-xs-push-2 col-xs-8  col-sm-push-3 col-sm-4 g-nopadding">
      <input class="maincontent-content-textedit-fill-width-2 ip" type="text" id="maincontent-content-ethernet-dns1"
        name="ethernet-dns1" value="{{ethernet-dns1}}" {{maincontent-content-ethernet-dns-permission}}>
    </div>
  </div>
  */

  var B_PATH = '/dev/serial/by-path/platform-ci_hdrc.1-usb-0:1.3:1.3-port0'
  var D_PATH = '/dev/serial/by-path/platform-ci_hdrc.1-usb-0:1.4:1.3-port0'

  function MicsAddressBox () {
    var _list, _addButton

    function Item () {
      var _input, _index, _removeButton

      var _el = el(
        '.component-mics-address-box-list-item',
        _input = el(
          'input.component-mics-address-box-list-item__input',
          {
            name: 'mics_addresses[]',
            type: 'text',
            placeholder: 'name=value'
          }
        ),
        _removeButton = el(
          'button.component-mics-address-box-list-item__remove',
          {
            onclick: function ( evt ) {
              evt.preventDefault()

              if ( _index >= 0 ) {
                console.log( 'removing index: ' + _index )
                window.mics_addresses.splice( _index, 1 )

                if ( window.mics_addresses.length <= 0 ) {
                  window.mics_addresses.push( '' )
                }

                var e = document.createEvent( 'Event' )
                e.initEvent(
                  'update',
                  true,
                  true
                )
                e.detail = _index
                _el.dispatchEvent( e )
              }
            }
          },
          'X'
        )
      )

      _input.onkeypress = function ( evt ) {
        var key = ( evt.keyCode || evt.which )
        if ( key === 13 ) {
          console.log( 'preventing Enter key' )
          evt.preventDefault()
        }
      }

      _input.oninput = function () {
        // console.log( 'change at index: ' + _index )
        window.mics_addresses[ _index ] = _input.value
      }

      function update ( val, ind, arr ) {
        _input.value = val
        _index = ind
      }

      return {
        el: _el,
        update: update
      }
    }

    var _el = el(
      '.component-mics-address-box',

      el(
        '.component-mics-address-box__title',
        'Mics Address'
      ),
      _list = redom.list(
        'ul.component-mics-address-box-list',
        Item
      ),
      _addButton = el(
        'button.component-mics-address-box-add-button',
        {
          onclick: function ( evt ) {
            evt.preventDefault()

            window.mics_addresses.push( '' )

            update()
          },
          style: {
            background: 'skyblue'
          }
        },
        window.isEnglish ? 'Add' : 'Lisää'
      )
    )

    _el.addEventListener( 'update', function ( evt ) {
      evt.preventDefault()
      evt.stopPropagation()

      update()
    } )

    function update () {
      _list.update( window.mics_addresses )
    }

    function onmount () {
      update()
    }

    return {
      el: _el,
      update: update,
      onmount: onmount
    }
  }

  function MicsSdConfForm () {
    var _form, _input

    var _el = el(
      '.component-mics',
      _form = el(
        'form.component-mics-form',

        {
          action: '',
          method: 'post'
        },

        // hidden form validation id
        el( 'input.component-mics-form-input',
          {
            style: {
              display: 'none'
            },
            name: 'rand',
            type: 'text',
            value: window[ 'form_rand' ]
          }
        ),

        // hidden POST submittion parameter ( php workaround.. )
        // adjusted by two buttons
        _input = el(
          'input.component-mics-form-input',
          {
            style: {
              display: 'none'
            },
            name: 'mics_sd_conf',
            type: 'text',
            value: ''
          }
        ),
        el(
          '.component-mics-form-title',
          'MICS SD conf'
        ),
        el(
          'button.component-mics-form-button.component-mics-form-button--mics-sd-conf',
          {
            style: {
              background: 'skyblue'
            },
            onclick: function ( evt ) {
              evt.preventDefault()
              if (
                window.confirm(
                  window.isEnglish
                    ? 'Are you sure you want to load from SD card?'
                    : 'Haluatko varmasti palauttaa SD kortista?'
                )
              ) {
                // argument for shell script mics_sd_conf.sh
                _input.value = 'install'

                _form.submit()
              } else {
                // ignore
              }
            }
          },
          window.isEnglish ? 'Restore' : 'Palauta'
        ),
        el(
          'button.component-mics-form-button.component-mics-form-button--mics-sd-conf',
          {
            style: {
              background: 'tomato'
            },
            onclick: function ( evt ) {
              evt.preventDefault()
              if (
                window.confirm(
                  window.isEnglish
                    ? 'Are you sure you want to overwrite SD card conf?'
                    : 'Haluatko varmasti tallentaa SD korttiin?'
                )
              ) {
                // argument for shell script mics_sd_conf.sh
                _input.value = 'save'

                _form.submit()
              } else {
                // ignore
              }
            }
          },
          window.isEnglish ? 'Save' : 'Tallenna'
        )
      ),
      el(
        '.component-mics-form-overlay'
      )
    )

    function update () {
      _el.className = classNames(
        'component-mics',
        {
          'component-mics--disabled': !window.is_admin
        }
      )
    }

    function onmount () {
      update()
    }

    return {
      el: _el,
      update: update,
      onmount: onmount
    }
  }

  function MicsSocketId () {
    var _form, _id, _select, _submit

    var _el = el(
      '.component-mics',

      _form = el(
        'form.component-mics-form',

        {
          action: '',
          method: 'post'
        },

        el( 'input.component-mics__rand',
          {
            style: {
              display: 'none'
            },
            name: 'rand',
            type: 'text',
            value: window[ 'form_rand' ]
          }
        ),
        el( '.component-mics__box',
          el( 'label.component-mics__label', 'id' ),
          _id = el( 'input.component-mics__target',
            {
              name: 'mics_id',
              type: 'text',
              placeholder: ''
            }
          )
        ),
        el( '.component-mics__box',
          el( 'label.component-mics__label', 'socket' ),
          _select = el( 'select.component-mics__target',
            {
              name: 'mics_socket'
            },
            el( 'option', { value: 'NOT_SET' }, 'NOT_SET' ),
            el( 'option', { value: 'B' }, 'B' ),
            el( 'option', { value: 'D' }, 'D' )
          )
        ),
        MicsAddressBox(),
        _submit = el( 'input#mics-submit', { type: 'submit', style: { display: 'none' } } )
      )
    )

    function update () {
      _id.value = window.mics_id
      // _select.selectedIndex = 2
      var options = [].forEach.call( _select.options, function ( option, index ) {
        if ( option.value.toLowerCase() === window.mics_socket.toLowerCase() ) {
          _select.selectedIndex = index
        }
      } )
    }

    function onmount () {
      update()
    }

    return {
      el: _el,
      update: update,
      onmount: onmount
    }
  }

  function Mics () {
    var _socketId

    var _el = el(
      '.component-mics-container',
      MicsSdConfForm(),
      _socketId = MicsSocketId()
    )

    function update () {
      _socketId.update()
    }

    function onmount () {
      update()
    }

    return {
      el: _el,
      update: update,
      onmount: onmount
    }
  }

  var app = Mics()

  window.onload = function () {
    // console.log( ' == onload giraffe == ' )
    var root = document.getElementById( id )
    mount( root, app )
  }
} )()
