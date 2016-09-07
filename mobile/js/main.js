/*
 *
 * mads - version 2.00.01
 * Copyright (c) 2015, Ninjoe
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * https://en.wikipedia.org/wiki/MIT_License
 * https://www.gnu.org/licenses/old-licenses/gpl-2.0.en.html
 *
 */

var mads = function() {
    /* Get Tracker */
    if (typeof custTracker == 'undefined' && typeof rma != 'undefined') {
        this.custTracker = rma.customize.custTracker;
    } else if (typeof custTracker != 'undefined') {
        this.custTracker = custTracker;
    } else {
        this.custTracker = [];
    }

    /* CT */
    if (typeof ct == 'undefined' && typeof rma != 'undefined') {
        this.ct = rma.ct;
    } else if (typeof ct != 'undefined') {
        this.ct = ct;
    } else {
        this.ct = [];
    }

    /* CTE */
    if (typeof cte == 'undefined' && typeof rma != 'undefined') {
        this.cte = rma.cte;
    } else if (typeof cte != 'undefined') {
        this.cte = cte;
    } else {
        this.cte = [];
    }

    /* tags */
    if (typeof tags == 'undefined' && typeof tags != 'undefined') {
        this.tags = this.tagsProcess(rma.tags);
    } else if (typeof tags != 'undefined') {
        this.tags = this.tagsProcess(tags);
    } else {
        this.tags = '';
    }

    /* Unique ID on each initialise */
    this.id = this.uniqId();

    /* Tracked tracker */
    this.tracked = [];
    /* each engagement type should be track for only once and also the first tracker only */
    this.trackedEngagementType = [];
    /* trackers which should not have engagement type */
    this.engagementTypeExlude = [];
    /* first engagement */
    this.firstEngagementTracked = false;

    /* Body Tag */
    this.bodyTag = document.getElementsByTagName('body')[0];

    /* Head Tag */
    this.headTag = document.getElementsByTagName('head')[0];

    /* RMA Widget - Content Area */
    this.contentTag = document.getElementById('rma-widget');

    /* URL Path */
    this.path = typeof rma != 'undefined' ? rma.customize.src : '';

    /* Solve {2} issues */
    for (var i = 0; i < this.custTracker.length; i++) {
        if (this.custTracker[i].indexOf('{2}') != -1) {
            this.custTracker[i] = this.custTracker[i].replace('{2}', '{{type}}');
        }
    }
};

/* Generate unique ID */
mads.prototype.uniqId = function() {

    return new Date().getTime();
}

mads.prototype.tagsProcess = function(tags) {

    var tagsStr = '';

    for (var obj in tags) {
        if (tags.hasOwnProperty(obj)) {
            tagsStr += '&' + obj + '=' + tags[obj];
        }
    }

    return tagsStr;
}

/* Link Opner */
mads.prototype.linkOpener = function(url) {

    if (typeof url != "undefined" && url != "") {

        if (typeof mraid !== 'undefined') {
            mraid.open(url);
        } else {
            window.open(url);
        }
    }
}

/* tracker */
mads.prototype.tracker = function(tt, type, name, value) {

    /*
     * name is used to make sure that particular tracker is tracked for only once
     * there might have the same type in different location, so it will need the name to differentiate them
     */
    name = name || type;

    if (typeof this.custTracker != 'undefined' && this.custTracker != '' && this.tracked.indexOf(name) == -1) {
        for (var i = 0; i < this.custTracker.length; i++) {
            var img = document.createElement('img');

            if (typeof value == 'undefined') {
                value = '';
            }

            /* Insert Macro */
            var src = this.custTracker[i].replace('{{rmatype}}', type);
            src = src.replace('{{rmavalue}}', value);

            /* Insert TT's macro */
            if (this.trackedEngagementType.indexOf(tt) != '-1' || this.engagementTypeExlude.indexOf(tt) != '-1') {
                src = src.replace('tt={{rmatt}}', '');
            } else {
                src = src.replace('{{rmatt}}', tt);
                this.trackedEngagementType.push(tt);
            }

            /* Append ty for first tracker only */
            if (!this.firstEngagementTracked && tt == 'E') {
                src = src + '&ty=E';
                this.firstEngagementTracked = true;
            }

            /* */
            img.src = src + this.tags + '&' + this.id;

            img.style.display = 'none';
            this.bodyTag.appendChild(img);

            this.tracked.push(name);
        }
    }
};

/* Load JS File */
mads.prototype.loadJs = function(js, callback, id) {
    if (id && document.getElementById(id)) {
        callback();
        return;
    }

    var script = document.createElement('script');
    script.src = js;
    if (id) {
        script.id = id;
    }


    if (typeof callback != 'undefined') {
        script.onload = callback;
    }

    this.headTag.appendChild(script);
}

/* Load CSS File */
mads.prototype.loadCss = function(href) {
    var link = document.createElement('link');
    link.href = href;
    link.setAttribute('type', 'text/css');
    link.setAttribute('rel', 'stylesheet');

    this.headTag.appendChild(link);
}


var ad = function(_m) {
    // var _m = new mads();

    var selfie;

    var sliderHead = '<div id="chooser"><div class="slider js_slider"> <div class="frame js_frame"> <ul class="slides js_slides"> <li class="js_slide selected"><img class="image1" src="' + _m.path + 'img/1-d.png"></li><li class="js_slide"><img class="image2" src="' + _m.path + 'img/2-d.png"></li><li class="js_slide"><img class="image3" src="' + _m.path + 'img/3-d.png"></li><li class="js_slide"><img class="image4" src="' + _m.path + 'img/4-d.png"></li><li class="js_slide"><img class="image5" src="' + _m.path + 'img/5-d.png"></li><li class="js_slide"><img class="image6" src="' + _m.path + 'img/6-d.png"></li></ul> </div><img class="js_prev prev" src="' + _m.path + 'img/slider_btn.png"> <img class="js_next next" src="' + _m.path + 'img/slider_btn.png"> </div></div><div id="buttons"><div id="kembali">Kembali</div><div id="pilih">Pilih</div></div>';

    _m.contentTag.innerHTML = '<div id="adc"><div id="first"><label id="btnSelfie" for="file-input">Selfie<input type="file" accept="image/*;capture=camera" id="file-input"></label></div><div id="second"><img id="instruction" src="' + _m.path + 'img/gif.gif"><div class="mask"></div><div id="controls"><img class="rotate" src="' + _m.path + 'img/rotate.png"><img class="zoomin" src="' + _m.path + 'img/zoom_plus.png"><img class="zoomout" src="' + _m.path + 'img/zoom_minus.png"></div><div id="containerwork"><div id="workspace"></div></div>' + sliderHead + '</div><div id="last"><img src="' + _m.path + 'img/last.png"><img id="fb-share" src="'+_m.path+'img/fb-icn.png"><img id="tw-share" src="'+_m.path+'img/tw-icn.png"><div id="coba">Coba Lagi</div><div id="info">Info Hadiah</div></div></div><div id="overlay"></div>';


    var firstPage = _m.contentTag.querySelector('#first');
    firstPage.style.background = "url(" + _m.path + "img/first.png)";

    var secondPage = _m.contentTag.querySelector('#second');
    secondPage.style.background = "url(" + _m.path + "img/second.png)";

    var lastPage = _m.contentTag.querySelector('#last');

    var inputFile = _m.contentTag.querySelector('input');

    inputFile.addEventListener('change', function(e) {
        var files = inputFile.files;
        var len = files.length;

        if (FileReader && files && len) {
            var fr = new FileReader();
            fr.onload = function() {
                var dimg = selfie = new Image();
                dimg.id = 'selfie'
                dimg.onload = function() {}
                dimg.src = fr.result;
                workspace.appendChild(dimg);
                addControlTo(dimg);
            }
            fr.readAsDataURL(files[0])

            GotoPage(2)
        }
    });

    var mask = _m.contentTag.querySelector('.mask');
    var inst = _m.contentTag.querySelector('#instruction');

    var kembali = _m.contentTag.querySelector('#kembali');
    var pilih = _m.contentTag.querySelector('#pilih');
    kembali.addEventListener('click', function() {
        GotoPage(1);
    });
    var lastimg = new Image();
    lastimg.id = "lastimg";
    pilih.addEventListener('click', function() {
        activ.src = activ.src.replace('-d', '-e');

        html2canvas(workspace, {
            onrendered: function(canvas) {
                lastimg.src = canvas.toDataURL("image/png");
                GotoPage(3);
            }
        })
    })

    var rotate = _m.contentTag.querySelector('#controls .rotate');
    var zoomin = _m.contentTag.querySelector('#controls .zoomin');
    var zoomout = _m.contentTag.querySelector('#controls .zoomout');

    rotate.addEventListener('click', function() {
        Velocity(selfie, {
            rotateZ: '+=45deg'
        })
    })
    zoomin.addEventListener('click', function() {
        Velocity(selfie, {
            scale: '+=0.1'
        })
    })
    zoomout.addEventListener('click', function() {
        Velocity(selfie, {
            scale: '-=0.1'
        })
    })


    var images = _m.contentTag.querySelectorAll(".js_slide")
    var activ;
    for (i = 0; i < images.length; i++) {
        (function(i) {
            images[i].addEventListener('click', function() {
                _m.contentTag.querySelector('.js_slide.selected').className = 'js_slide';
                images[i].className += ' selected';
                activ.src = _m.contentTag.querySelector('#chooser .selected img').src;
            });
        })(i);
    }

    var workspace = _m.contentTag.querySelector('#workspace');

    var addControlTo = function(dimg) {
        var manager = new Hammer.Manager(dimg);

        var Pan = new Hammer.Pan();
        var Rotate = new Hammer.Rotate();
        var Pinch = new Hammer.Pinch();

        Rotate.recognizeWith([Pan]);
        Pinch.recognizeWith([Rotate, Pan]);

        manager.add(Pan);
        manager.add(Rotate);
        manager.add(Pinch);

        // Rotating
        var liveScale = 1;
        var currentRotation = 0;
        manager.on('rotatemove', function(e) {
            var rotation = currentRotation + Math.round(liveScale * e.rotation);
            Velocity.hook(dimg, 'rotateZ', rotation + 'deg');
        });
        manager.on('rotateend', function(e) {
            currentRotation += Math.round(e.rotation);
        });

        // Panning
        var deltaX = 0;
        var deltaY = 0;
        manager.on('panmove', function(e) {
            var dx = deltaX + (e.deltaX);
            var dy = deltaY + (e.deltaY);

            Velocity.hook(dimg, 'translateX', dx + 'px');
            Velocity.hook(dimg, 'translateY', dy + 'px');
        });
        manager.on('panend', function(e) {
            deltaX = deltaX + e.deltaX;
            deltaY = deltaY + e.deltaY;
        })

        // Scaling
        var currentScale = 1;

        function getRelativeScale(scale) {
            return scale * currentScale;
        }
        manager.on('pinchmove', function(e) {
            var scale = getRelativeScale(e.scale);
            Velocity.hook(dimg, 'scale', scale);
        });
        manager.on('pinchend', function(e) {
            currentScale = getRelativeScale(e.scale);
            liveScale = currentScale;
        });
    }

    // Goto
    var GotoPage = function(page, d) {
        switch (page) {
            case 1:
                firstPage.style.display = 'block';
                secondPage.style.display = 'none';
                mask.style.display = 'block';
                inst.style.display = 'block';
                break;
            case 2:
                firstPage.style.display = 'none';
                secondPage.style.display = 'block';
                workspace.innerHTML = '';
                activ = _m.contentTag.querySelector('#chooser .selected img').cloneNode(true);
                activ.className = 'coverlay';
                workspace.appendChild(activ);
                if (d) {
                    var dimg = selfie = new Image();
                    dimg.id = 'selfie'
                    dimg.onload = function() {}
                    dimg.src = _m.path + 'img/first.png';
                    workspace.appendChild(dimg);
                    addControlTo(dimg);
                }
                _m.loadJs(_m.path + 'js/lory.min.js', function() {
                    setTimeout(function() {
                        var slider = _m.contentTag.querySelector('.js_slider');
                        lory(slider, {
                            slidesToScroll: 3
                        })
                    }, 500)
                }, 'lory')
                var close = function() {
                    mask.style.display = 'none';
                    inst.style.display = 'none';
                }
                setTimeout(function() {
                    mask.addEventListener('click', close)
                }, 6000);
                setTimeout(function() {
                    close();
                }, 10000)
                break;
            case 3:
                firstPage.style.display = 'none';
                secondPage.style.display = 'none';
                lastPage.style.display = 'block';
                if (lastimg) {
                    lastPage.appendChild(lastimg);
                }
                break;
        }
    }

    GotoPage(2, true)

    _m.loadCss(_m.path + "css/style.css");
};

(function(ad) {
    var _m = new mads();
    var scripts = [_m.path + 'js/hammer.min.js', _m.path + 'js/velocity.min.js', _m.path + 'js/html2canvas.min.js'];
    var loadCount = scripts.length;

    function done() {
        loadCount -= 1;
        if (loadCount == 0) {
            ad(_m);
        }
    }

    for (var i = 0; i < scripts.length; i++) {
        _m.loadJs(scripts[i], done);
    }
})(ad)