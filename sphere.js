(function (specs) {
    
  window.onload = function () {
    
    var iframe,
        default_iframe_size = {style: { width: '800px', height: '800px' }};
    
    // iframed from the same origin
    try {
      if (typeof parent === 'object') {
        iframe = parent.document.getElementById('sphere-iframe') || default_iframe_size;
      }
    // different origin
    } catch (e) {
      iframe = default_iframe_size;
    }
    
    var container_width = parseInt(iframe.style.width, 10),
        container_height = parseInt(iframe.style.height, 10);
    
    document.getElementById('sphere-body').style.maxWidth = container_width + 'px';
    document.getElementById('sphere-scene').style.height = container_height + 'px';
    
    Raphael.fn.ball = function (x, y, r, hue) {
      var hue = hue || 0;
      return this.set(
        this.ellipse(x, y + r - r / 5, r, r / 2)
            .attr({fill: 'rhsb(' + hue + ', 1, .25)-hsb(' + hue + ', 1, .25)', stroke: 'none', opacity: 0}),
        this.ellipse(x, y, r, r)
            .attr({fill: 'r(.5,.9)hsb(' + hue + ', 1, .75)-hsb(' + hue + ', .5, .25)', stroke: 'none', opacity: 1}),
        this.ellipse(x, y, r - r / 5, r - r / 20)
            .attr({stroke: 'none', fill: 'r(.5,.1)#ccc-#ccc', opacity: 0})
     );
    };
    
    Raphael.fn.logo = function (scale_x, scale_y) {
      // http://www.w3.org/html/logo/downloads/HTML5_1Color_Black.svg
      return this.set(
        this.path('M119.387,20.312h21.298v21.045h19.485V20.312h21.303v63.727H160.17V62.7h-19.485v21.338h-21.298V20.312z')
            .attr({'fill': '#231F20'}),
        this.path('M209.482,41.444h-18.754V20.312h58.812v21.133h-18.759v42.594h-21.3V41.444z')
            .attr({'fill': '#231F20'}),
        this.path('M258.879,20.312h22.21l13.661,22.392l13.648-22.392h22.219v63.727h-21.212V52.453L294.75,75.111h-0.366' +
                   'l-14.665-22.658v31.585h-20.84V20.312z')
            .attr({'fill': '#231F20'}),
        this.path('M341.219,20.312h21.308v42.664h29.955v21.062h-51.263V20.312z')
            .attr({'fill': '#231F20'}),
        this.path('M200.662,266.676H256v-42.92h-59.169L200.662,266.676z M88.686,' + 
                  '111.982l30.47,341.74l136.762,37.966l136.891-37.948l30.507-341.758H88.686z M366.694,' + 
                  '431.981L256,462.668v-43.494l-0.067,0.02l-85.858-23.835l-6.004-67.298h42.075 l3.116,' +       
                  '34.914l46.68,12.607l0.059-0.019V308.59h-93.669l-11.306-126.749H256v-41.914h136.766L366.694,431.981z')
            .attr({'fill': '#231F20'}),                    
        this.path('M307.592,308.59H256v66.974l46.728-12.613L307.592,308.59z M256,' + 
                  '139.927v41.914h104.975 l-3.754,41.915H256v42.92h97.406l-11.499,' + 
                  '128.683L256,419.174v43.494l110.694-30.687l26.071-292.055H256z')
            .attr({'fill': '#231F20', 'opacity': '0.8'})
      ).scale(scale_x, scale_y, 0, 0);
    };
    
    var R = Raphael('sphere-scene'),
        x = parseInt(0.5 * container_width, 10),
        y = parseInt(0.4 * container_width, 10),
        r = parseInt(0.4 * container_width, 10),
        r2 = parseInt(0.32 * container_width, 10),
        opacity_out = 0.25,
        opacity_in = 1.0,
        default_font_size = 11,
        default_font_family = 'verdana',
        font_size_out = parseInt(12 * (x/250), 10),
        font_size_in = parseInt(24 * (x/250), 10),
        anim_cur = 0,
        anim_max = 5,
        specs_refs = [],
        spec,
        text_bbox,
        i, l;
        
    var ball = R.ball(x, y, r, 0.55),
        logo = R.logo(2*x/container_width, 2*x/container_height).translate(container_width/5.5, container_height/11);
        
        var credits = R.text(x, 2*y+15, 'Open Web Platform Sphere by Anssi Kostiainen')
            .attr({'fill': '#76797C', 'font-size': default_font_size, 'font-family': default_font_family, 'href': 'http://twitter.com/anssik'});
        
        credits.node.onclick = navigateToParentHref;
        
    var powered_by = R.text(x, 2*y+30, 'Powered by Raphael')
        .attr({'fill': '#76797C', 'font-size': default_font_size, 'font-family': default_font_family, 'href': 'http://raphaeljs.com/'});
        
        powered_by.node.onclick = navigateToParentHref;
        
    function navigateToParentHref() {
      // the same window
      parent.location.href = this.parentNode.getAttribute('href');
      // a new window
      //window.open(this.parentNode.getAttribute('href'));
    }
    
    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min; 
    }
    
    function getX() {
      return random(0, 2 * x);
    }
    
    function getY() {
      return random(0, 2 * y);
    }
    
    function getTextBBox(text) {
      var bb = text.getBBox(),
          x1 = bb.x,
          x2 = bb.x + bb.width,
          y1 = bb.y,
          y2 = bb.y + bb.height;
          
      return {x1: x1, x2: x2, y1: y1, y2: y2};
    }
    
    function isBBoxWithinBall(bb) {
      var is_top_left_within = (Math.sqrt(Math.pow(x-bb.x1, 2) + Math.pow(y-bb.y1, 2)) < r2) ? true : false,
          is_bottom_left_within = (Math.sqrt(Math.pow(x-bb.x1, 2) + Math.pow(y-bb.y2, 2)) < r2) ? true : false,
          is_top_right_within = (Math.sqrt(Math.pow(x-bb.x2, 2) + Math.pow(y-bb.y1, 2)) < r2) ? true : false,
          is_bottom_right_within = (Math.sqrt(Math.pow(x-bb.x2, 2) + Math.pow(y-bb.y2, 2)) < r2) ? true : false;
          
      return (is_top_left_within && is_bottom_left_within && is_top_right_within && is_bottom_right_within) ? true : false;
    }
    
    function addMouseOverAnimation(el) {
      el.mouseover(function (event) {
          animateFocusIn(el);
      });
    }
    
    function addMouseOutAnimation(el) {
      el.mouseout(function (event) {
          animateFocusOut(el);
      });
    }
    
    function focusRandomSpec() {
      var rand = random(0, specs_refs.length-1);
      specs_refs[rand].show();
      animateFocusIn(specs_refs[rand]);
      setInterval(function () { animateFocusOut(specs_refs[rand]); }, 3000);
    }
    
    function animateFocusIn(el) {
      el.animate({'font-size': font_size_in}, 1000, 'bounce', function () {
          el.animate({'opacity': opacity_in}, 500);
      });
    }
    
    function animateFocusOut(el) {
      el.animate({'font-size': font_size_out}, 1000, 'bounce', function () {
          this.animate({'opacity': opacity_out}, 500);
      });
    }
    
    function addSpecs(specs) {
      for (i = 0, l = specs.length; i < l; i++) {
        var spec = specs[i],
            text = R.text(getX(), getY(), spec.title)
            .attr({'href': spec.uri, 'fill': '#fff', 'font-size': font_size_out, 'opacity': opacity_out})
            .hide();
        
        text.node.onclick = function () { navigateToParentHref.call(this); };
        
        text_bbox = getTextBBox(text);
        
        specs_refs.push(text);
        
        if (isBBoxWithinBall(text_bbox)) {
        } else {
          do {
            text.attr({ 'x': getX(), 'y': getY() });
          } while (!isBBoxWithinBall(getTextBBox(text)));
        }
        
        text.show();
        addMouseOverAnimation(text);
        addMouseOutAnimation(text);
      }
    }
    
    addSpecs(specs);
    focusRandomSpec();
    
  };
  
}(specs));